import { NextResponse } from "next/server";
import { structureCustomerReview, SupportedLanguage } from "@/lib/humanReviewEngine";
import { recordDraft, saveReviewSession } from "@/lib/reviewFlowStore";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/**
 * Call Google Gemini 1.5/2.0 Flash (Free Tier)
 */
async function callGeminiReviewAPI(apiKey: string, prompt: string): Promise<string | null> {
  const models = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 120,
          },
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return text.replace(/^["']|["']$/g, "").trim();
        }
      }
    } catch (_) {
      // Try next model if timeout or error
      continue;
    }
  }

  return null;
}

/**
 * Call Groq Cloud Free Tier API
 */
async function callGroqReviewAPI(apiKey: string, prompt: string): Promise<string | null> {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You write genuine, natural, short human Google reviews as if typed on a mobile phone. Never sound like marketing AI.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 120,
    }),
    signal: AbortSignal.timeout(6000),
  });

  if (!response.ok) {
    throw new Error(`Groq returned ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text ? text.replace(/^["']|["']$/g, "").trim() : null;
}

/**
 * Call OpenAI API
 */
async function callOpenAIReviewAPI(apiKey: string, prompt: string): Promise<string | null> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write genuine, natural, short human Google reviews as if typed on a mobile phone. Never sound like marketing AI.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 120,
    }),
    signal: AbortSignal.timeout(6000),
  });

  if (!response.ok) {
    throw new Error(`OpenAI returned ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text ? text.replace(/^["']|["']$/g, "").trim() : null;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`reviewflow-draft:${clientIp}`, {
      windowMs: 60 * 1000,
      max: 60,
    });

    if (!rateLimit.success) {
      return rateLimitExceededResponse(rateLimit);
    }

    const body = await request.json().catch(() => ({}));
    const {
      businessId = "business",
      businessName = "This Business",
      category = "General",
      customerRating = 5,
      language = "en",
      prompts = [],
      keywords = [],
      userNotes = "",
      sessionId,
      seed = Date.now() + Math.random() * 10000,
    } = body;

    const ratingNum = Math.min(5, Math.max(1, Number(customerRating) || 5));
    const lang = (["en", "hi", "hinglish", "mr"].includes(language) ? language : "en") as SupportedLanguage;
    const combinedKeywords = Array.isArray(prompts) && prompts.length > 0 ? prompts : keywords;

    let generatedDraft = "";
    let providerUsed = "local-neural";

    // Build anti-duplicate prompt for external LLM if available
    const langDescriptions: Record<SupportedLanguage, string> = {
      en: "Natural, everyday Indian English. Relaxed phone-typing style. No robotic AI buzzwords.",
      hi: "Authentic spoken Hindi in Devanagari script (हिंदी). Polite, warm, and genuine.",
      hinglish: "Romanized Hindi / Hinglish (e.g. 'kaam bohot achha tha, team ne ache se support kiya'). Casual colloquial tone.",
      mr: "Natural Marathi script (मराठी). Genuine and respectful regional phrasing.",
    };

    const aspectContext = combinedKeywords.length > 0 ? `Specific highlights: ${combinedKeywords.join(", ")}.` : "";
    const notesContext = userNotes ? `Customer notes: "${userNotes}".` : "";

    const aiPrompt = `Write a completely unique, 100% natural Google Maps review for "${businessName}" (${category}).
Language: ${langDescriptions[lang]}
Customer Rating: ${ratingNum}/5 stars
${aspectContext}
${notesContext}

CRITICAL ANTI-DUPLICATE & REAL HUMAN CONSTRAINTS:
1. Make the review 100% UNIQUE. Never repeat typical template phrases.
2. Sounds like a real customer typing on a smartphone (2-3 short sentences, under 45 words).
3. Do NOT use fake marketing or robotic words (NEVER use: "testament", "delighted", "exemplary", "unparalleled", "beacon", "look no further").
4. Return ONLY the review text. Do not wrap in quotes.`;

    // 1. Try Google Gemini API
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    if (!generatedDraft && geminiKey) {
      try {
        const text = await callGeminiReviewAPI(geminiKey, aiPrompt);
        if (text) {
          generatedDraft = text;
          providerUsed = "Google Gemini AI";
        }
      } catch (geminiErr) {
        console.warn("Gemini review API skipped:", geminiErr);
      }
    }

    // 2. Try Groq Free Tier API
    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (!generatedDraft && groqKey) {
      try {
        const text = await callGroqReviewAPI(groqKey, aiPrompt);
        if (text) {
          generatedDraft = text;
          providerUsed = "Groq Llama-3.3-70b";
        }
      } catch (groqErr) {
        console.warn("Groq review API skipped:", groqErr);
      }
    }

    // 3. Try OpenAI API
    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    if (!generatedDraft && openAiKey && openAiKey.startsWith("sk-")) {
      try {
        const text = await callOpenAIReviewAPI(openAiKey, aiPrompt);
        if (text) {
          generatedDraft = text;
          providerUsed = "OpenAI GPT-4o-mini";
        }
      } catch (openAiErr) {
        console.warn("OpenAI review API skipped:", openAiErr);
      }
    }

    // 4. Guaranteed High-Entropy Neural Engine Fallback (0ms latency, zero duplicates)
    if (!generatedDraft) {
      generatedDraft = structureCustomerReview({
        businessName,
        category,
        rating: ratingNum,
        keywords: combinedKeywords,
        userNotes,
        language: lang,
        seed: Number(seed) || Date.now() + Math.random() * 50000,
      });
      providerUsed = "Digital FX Neural Synthesizer";
    }

    // Record draft analytics
    if (businessId) {
      try {
        await recordDraft(businessId);
      } catch (_) {}
    }

    if (sessionId) {
      try {
        await saveReviewSession({
          sessionId,
          businessId,
          category,
          customerRating: ratingNum,
          answers: { prompts: combinedKeywords, userNotes },
          generatedDraft,
          finalReviewText: generatedDraft,
          completed: false,
          clickedGoogleReview: false,
          createdAt: new Date().toISOString(),
        });
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      draft: generatedDraft,
      provider: providerUsed,
      uniqueHash: Math.random().toString(36).substring(2, 9),
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
