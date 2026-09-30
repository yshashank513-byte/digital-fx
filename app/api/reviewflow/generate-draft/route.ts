import { NextResponse } from "next/server";
import { structureCustomerReview, SupportedLanguage } from "@/lib/humanReviewEngine";
import { recordDraft, saveReviewSession } from "@/lib/reviewFlowStore";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// ──────────────────────────────────────────────────────────────────────────────
// GEMINI API — correct model names as returned by /v1beta/models endpoint
// ──────────────────────────────────────────────────────────────────────────────
async function callGeminiReviewAPI(apiKey: string, prompt: string): Promise<string | null> {
  const models = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash-lite",
    "gemini-pro-latest",
  ];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.95, maxOutputTokens: 130 },
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text.replace(/^["']|["']$/g, "").trim();
      }
      // 429 or 404 — try next model
    } catch (_) {
      continue;
    }
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// GROQ API
// ──────────────────────────────────────────────────────────────────────────────
async function callGroqReviewAPI(apiKey: string, prompt: string): Promise<string | null> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
      temperature: 0.92,
      max_tokens: 130,
    }),
    signal: AbortSignal.timeout(6000),
  });

  if (!response.ok) throw new Error(`Groq returned ${response.status}`);
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text ? text.replace(/^["']|["']$/g, "").trim() : null;
}

// ──────────────────────────────────────────────────────────────────────────────
// OPENAI API
// ──────────────────────────────────────────────────────────────────────────────
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
      temperature: 0.92,
      max_tokens: 130,
    }),
    signal: AbortSignal.timeout(6000),
  });

  if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text ? text.replace(/^["']|["']$/g, "").trim() : null;
}

// ──────────────────────────────────────────────────────────────────────────────
// RATING-AWARE TONE  (critical fix: 1★ = negative, 5★ = positive)
// ──────────────────────────────────────────────────────────────────────────────
function getRatingTone(rating: number): string {
  switch (rating) {
    case 1:
      return "1-STAR NEGATIVE REVIEW. Customer is genuinely frustrated and disappointed. Mention real problems like delays, damage, rude staff, overcharging, poor handling or broken items. Sound angry or upset — like a real dissatisfied customer. Do NOT include any positive words.";
    case 2:
      return "2-STAR BELOW AVERAGE REVIEW. Customer had a bad experience overall. Mention specific issues (something went wrong, expectations not met). Slightly disappointed tone. One small positive is okay but the overall feeling should be negative.";
    case 3:
      return "3-STAR AVERAGE REVIEW. Mixed experience. Something was good, something was not. Balanced, neutral tone. Suggest there is room for improvement.";
    case 4:
      return "4-STAR GOOD REVIEW. Customer is happy and satisfied overall. Mention what worked well. One minor thing could be better. Mostly positive tone.";
    case 5:
    default:
      return "5-STAR EXCELLENT REVIEW. Customer is very happy, impressed, and fully satisfied. Enthusiastic but genuine and natural. Mention specific positive things about the service/experience.";
  }
}

function getCategoryContext(category: string): string {
  const c = (category || "").toLowerCase();
  if (c.includes("packer") || c.includes("mover") || c.includes("shift") || c.includes("logistics"))
    return "Packers & Movers service. Topics: shifting, bubble wrapping, safe delivery of fragile items, polite loading crew, punctuality, zero damages. Never say 'visited' — say 'booked them', 'hired them', 'shifted with them'.";
  if (c.includes("jewel") || c.includes("gold") || c.includes("diamond"))
    return "Jewellery Store. Topics: hallmark purity, bridal/festive designs, welcoming staff, transparent billing.";
  if (c.includes("restau") || c.includes("cafe") || c.includes("food") || c.includes("dining"))
    return "Restaurant/Cafe. Topics: food quality, hygiene, warm hospitality, quick service, taste.";
  if (c.includes("clinic") || c.includes("doctor") || c.includes("hospital") || c.includes("dental") || c.includes("health"))
    return "Clinic/Doctor. Topics: consultation, diagnosis, clinic hygiene, polite receptionist, treatment effectiveness.";
  if (c.includes("salon") || c.includes("spa") || c.includes("beauty"))
    return "Salon & Spa. Topics: hair styling, clean equipment, skilled stylists, relaxing experience.";
  if (c.includes("hotel") || c.includes("resort") || c.includes("stay"))
    return "Hotel & Stay. Topics: clean rooms, courteous front desk, room service, hospitality.";
  if (c.includes("real estate") || c.includes("property"))
    return "Real Estate. Topics: transparent docs, genuine site visits, honest advisory, reliable deals.";
  if (c.includes("market") || c.includes("digital") || c.includes("seo") || c.includes("agency"))
    return "Digital Marketing. Topics: Google ranking, genuine leads, transparent updates, responsive support.";
  if (c.includes("auto") || c.includes("car") || c.includes("bike") || c.includes("garage"))
    return "Automobile/Workshop. Topics: vehicle service, genuine spare parts, timely updates, courteous staff.";
  return `${category} service. Topics: customer service quality, professionalism, pricing, and staff behavior.`;
}

function getLangInstruction(lang: string): string {
  const map: Record<string, string> = {
    en: "Natural everyday Indian English, relaxed phone-typing style, short sentences.",
    hi: "Authentic spoken Hindi in Devanagari script (हिंदी). Warm and genuine.",
    hinglish: "Romanized Hindi/Hinglish like 'kaam achha tha, team ne help ki'. Casual mobile typing tone.",
    mr: "Natural Marathi (मराठी script). Respectful regional phrasing.",
  };
  return map[lang] || map["en"];
}

// Unique sentence starter per seed to prevent identical reviews
function getSeedStarter(seed: number): string {
  const starters = [
    "", "Honestly,", "Recently used them.", "Just shifted recently,", "My experience:",
    "First time using them,", "Used their service last week,", "Booked them last month,",
    "To be honest,", "Just wanted to share,", "Had a recent experience,",
  ];
  return starters[Math.floor(Math.abs(seed) % starters.length)] || "";
}

function buildPrompt(params: {
  businessName: string;
  category: string;
  rating: number;
  lang: string;
  aspects: string[];
  userNotes: string;
  seed: number;
}): string {
  const { businessName, category, rating, lang, aspects, userNotes, seed } = params;
  const starter = getSeedStarter(seed);
  return `Write a completely genuine Google Maps review for "${businessName}" (${category}).

Language: ${getLangInstruction(lang)}
Business type: ${getCategoryContext(category)}
Star rating context: ${getRatingTone(rating)}
${aspects.length > 0 ? `Customer highlighted: ${aspects.join(", ")}.` : ""}
${userNotes ? `Customer notes: "${userNotes}".` : ""}
${starter ? `Begin with: "${starter}"` : ""}
Variation seed: ${Math.floor(Math.abs(seed) % 99999)}

RULES (must follow strictly):
1. Exactly 2 short sentences. Total 25-45 words.
2. Sound like a real Indian customer typing on phone. No AI marketing words.
3. Sentiment MUST match the rating — 1 star = genuinely negative/frustrated, 5 stars = genuinely positive/happy.
4. Never use: "exemplary", "testament", "unparalleled", "beacon", "pinnacle", "seamless", "exceptional", "delighted".
5. Do not repeat any word twice.
6. Return ONLY the review text. No quotes, no labels, no commentary.`;
}

// ──────────────────────────────────────────────────────────────────────────────
// POST Handler
// ──────────────────────────────────────────────────────────────────────────────
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
      seed = Date.now() + Math.random() * 99999,
    } = body;

    const ratingNum = Math.min(5, Math.max(1, Number(customerRating) || 5));
    const lang = (["en", "hi", "hinglish", "mr"].includes(language) ? language : "en") as SupportedLanguage;
    const aspects = Array.isArray(prompts) && prompts.length > 0 ? prompts : (keywords || []);
    const seedNum = Number(seed) || (Date.now() + Math.random() * 99999);

    let generatedDraft = "";
    let providerUsed = "local-neural";

    const aiPrompt = buildPrompt({
      businessName,
      category,
      rating: ratingNum,
      lang,
      aspects,
      userNotes,
      seed: seedNum,
    });

    // 1. Try Google Gemini (priority)
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    if (!generatedDraft && geminiKey) {
      try {
        const text = await callGeminiReviewAPI(geminiKey, aiPrompt);
        if (text) {
          generatedDraft = text;
          providerUsed = "Digital FX Neural AI";
        }
      } catch (e) {
        console.warn("Gemini skipped:", e);
      }
    }

    // 2. Try Groq fallback
    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (!generatedDraft && groqKey) {
      try {
        const text = await callGroqReviewAPI(groqKey, aiPrompt);
        if (text) {
          generatedDraft = text;
          providerUsed = "Digital FX Neural AI";
        }
      } catch (e) {
        console.warn("Groq skipped:", e);
      }
    }

    // 3. Try OpenAI fallback
    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    if (!generatedDraft && openAiKey && openAiKey.startsWith("sk-")) {
      try {
        const text = await callOpenAIReviewAPI(openAiKey, aiPrompt);
        if (text) {
          generatedDraft = text;
          providerUsed = "Digital FX Neural AI";
        }
      } catch (e) {
        console.warn("OpenAI skipped:", e);
      }
    }

    // 4. Local high-entropy fallback
    if (!generatedDraft) {
      generatedDraft = structureCustomerReview({
        businessName,
        category,
        rating: ratingNum,
        keywords: aspects,
        userNotes,
        language: lang,
        seed: seedNum,
      });
      providerUsed = "Digital FX Neural AI";
    }

    // Analytics
    if (businessId) {
      try { await recordDraft(businessId); } catch (_) {}
    }

    if (sessionId) {
      try {
        await saveReviewSession({
          sessionId,
          businessId,
          category,
          customerRating: ratingNum,
          answers: { prompts: aspects, userNotes },
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
      { success: false, error: error.message || "Failed to generate review draft" },
      { status: 500 }
    );
  }
}
