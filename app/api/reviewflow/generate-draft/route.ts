import { NextResponse } from "next/server";
import { synthesizeReviewDraftLocally } from "@/lib/reviewFlowCategories";
import { generateNaturalHumanReview, SupportedLanguage } from "@/lib/humanReviewEngine";
import { recordDraft, saveReviewSession } from "@/lib/reviewFlowStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      businessId = "digital-fx",
      businessName = "Digital FX",
      category = "Digital Marketing Agency",
      customerRating = 5,
      language = "en",
      answers = {},
      optionalNotes = "",
      sessionId,
    } = body;

    const ratingNum = Math.min(5, Math.max(1, Number(customerRating) || 5));
    const lang = (["en", "hi", "hinglish", "mr"].includes(language) ? language : "en") as SupportedLanguage;
    const entries = Object.entries(answers || {}).filter(([_, v]) => Boolean(v && String(v).trim()));

    let generatedDraft = "";

    // 1. Attempt OpenAI API draft generation if key is present
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.startsWith("sk-")) {
      try {
        const langDescriptions: Record<SupportedLanguage, string> = {
          en: "Simple, casual Indian English. Natural everyday phrasing. No robotic AI vocabulary.",
          hi: "Natural Hindi in Devanagari script (हिंदी). Common spoken words. Polite and genuine.",
          hinglish: "Romanized Hindi / Hinglish (e.g. 'bohot achha kaam kiya team ne, response fast hai'). Everyday colloquial phrasing.",
          mr: "Natural Marathi script (मराठी). Genuine and respectful regional phrasing.",
        };

        const prompt = `Write a realistic, 100% natural, human Google review for "${businessName}" (${category}).
Language requirement: ${langDescriptions[lang]}
Customer Rating: ${ratingNum}/5 stars

STRICT RULES TO PREVENT GOOGLE SPAM / DUPLICATE DETECTION:
1. MUST sound like an ordinary customer typing on a phone. NEVER use robotic, poetic, or marketing words (NO "testament", "delighted", "exemplary", "unparalleled", "beacon").
2. Write 2-3 short, clear sentences.
3. Vary sentence structures to guarantee high uniqueness so Google's algorithm does not flag duplicate patterns.
4. Return ONLY the review text. No quotes.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You turn customer experience answers into concise, natural, authentic Google review drafts. Never fabricate details. Strictly respect customer sentiment.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.6,
            max_tokens: 180,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const text = json.choices?.[0]?.message?.content?.trim();
          if (text) {
            generatedDraft = text.replace(/^["']|["']$/g, "").trim();
          }
        } else {
          console.warn("OpenAI API returned non-OK status:", response.status);
        }
      } catch (aiErr) {
        console.warn("OpenAI API request failed, falling back to local synthesizer:", aiErr);
      }
    }

    // 2. Fallback to local human review generator with zero duplicate patterns
    if (!generatedDraft) {
      generatedDraft = generateNaturalHumanReview(
        businessName,
        category,
        lang,
        Date.now() + Math.random() * 1000
      );
    }

    // 3. Record draft in store/analytics
    if (businessId) {
      await recordDraft(businessId);
    }

    if (sessionId) {
      await saveReviewSession({
        sessionId,
        businessId,
        category,
        customerRating: ratingNum,
        answers,
        generatedDraft,
        finalReviewText: generatedDraft,
        completed: false,
        clickedGoogleReview: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      draft: generatedDraft,
      source: openAiKey ? "ai-assisted" : "synthesizer",
    });
  } catch (error: any) {
    console.error("ReviewFlow generate-draft error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate review draft",
      },
      { status: 500 }
    );
  }
}
