import { NextResponse } from "next/server";
import { synthesizeReviewDraftLocally } from "@/lib/reviewFlowCategories";
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
      answers = {},
      optionalNotes = "",
      sessionId,
    } = body;

    const ratingNum = Math.min(5, Math.max(1, Number(customerRating) || 5));
    const entries = Object.entries(answers || {}).filter(([_, v]) => Boolean(v && String(v).trim()));

    let generatedDraft = "";

    // 1. Attempt OpenAI API draft generation if key is present
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey.startsWith("sk-")) {
      try {
        const answersSummary = entries
          .map(([k, v]) => `- ${k}: ${v}`)
          .join("\n");

        const prompt = `You are a real customer writing an authentic, natural Google review for "${businessName}" (${category}).
Customer Star Rating: ${ratingNum}/5
Actual Experience Details provided by the customer:
${answersSummary || "- Good overall service"}
${optionalNotes ? `Additional customer note: "${optionalNotes}"` : ""}

STRICT COMPLIANCE RULES:
1. Base the review ONLY on the answers above. NEVER invent or fabricate facts not mentioned.
2. Tone must strictly match the customer's actual sentiment (${ratingNum >= 4 ? "positive and pleased" : ratingNum === 3 ? "fair and balanced" : "honest and constructive"}).
3. Write 2 to 3 natural sentences in first person ("I had...", "The team was...", "We found...").
4. Keep it conversational, helpful for local searchers, and sound like a genuine customer, NOT marketing copy or AI.
5. Return ONLY the review text. Do not wrap in quotes or add headers.`;

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

    // 2. Fallback to local intelligent natural language synthesizer if AI was not returned
    if (!generatedDraft) {
      generatedDraft = synthesizeReviewDraftLocally(
        businessName,
        category,
        ratingNum,
        answers,
        optionalNotes
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
