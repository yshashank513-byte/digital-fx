import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OPENAI_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    const {
      url,
      seo,
      performance,
      mobile,
      content,
      geo,
      overall,
      recommendations,
    } = body || {};

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "Website URL is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional digital marketing consultant working for Digital FX.

Analyze the following website performance data.

Website:
${url}

Scores:
SEO: ${Number(seo) || 0}/100
Performance: ${Number(performance) || 0}/100
Mobile: ${Number(mobile) || 0}/100
Content: ${Number(content) || 0}/100
GEO / Local Visibility: ${Number(geo) || 0}/100
Overall: ${Number(overall) || 0}/100

Technical recommendations:
${Array.isArray(recommendations)
  ? recommendations.join("\n")
  : "No technical recommendations available."}

Your job is to provide a concise, professional business-focused analysis.

IMPORTANT:
- Do not invent traffic numbers.
- Do not invent revenue.
- Do not claim that the website ranks on Google unless the data proves it.
- Do not claim actual AI-search visibility unless the data proves it.
- Explain opportunities based only on the supplied information.
- Keep the language easy for a business owner to understand.
- Prioritize practical actions that could improve SEO, website performance, local visibility and conversions.

Return ONLY valid JSON in exactly this structure:

{
  "summary": "2-4 sentence professional summary",
  "priority": "High",
  "opportunities": [
    "Opportunity 1",
    "Opportunity 2",
    "Opportunity 3"
  ],
  "actions": [
    "Action 1",
    "Action 2",
    "Action 3"
  ]
}

Priority must be exactly one of:
High
Medium
Low
`;

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
                "You are a professional digital marketing consultant. Return only valid JSON. Never invent business results or unsupported facts.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,

          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const openAIData = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error(
        "OPENAI API ERROR:",
        openAIData
      );

      return NextResponse.json(
        {
          success: false,
          error:
            openAIData?.error?.message ||
            `OpenAI request failed with status ${openAIResponse.status}.`,
        },
        {
          status: openAIResponse.status,
        }
      );
    }

    const text =
      openAIData?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI returned an empty response.",
        },
        { status: 500 }
      );
    }

    let analysis;

    try {
      analysis =
        typeof text === "string"
          ? JSON.parse(text)
          : text;
    } catch (error) {
      console.error(
        "AI JSON PARSE ERROR:",
        error
      );

      console.error(
        "AI RAW RESPONSE:",
        text
      );

      return NextResponse.json(
        {
          success: false,
          error: "AI returned an invalid JSON response.",
        },
        { status: 500 }
      );
    }

    const priority =
      analysis?.priority === "High" ||
      analysis?.priority === "Medium" ||
      analysis?.priority === "Low"
        ? analysis.priority
        : "Medium";

    const opportunities = Array.isArray(
      analysis?.opportunities
    )
      ? analysis.opportunities
          .filter(
            (item: unknown) =>
              typeof item === "string" &&
              item.trim()
          )
          .slice(0, 5)
      : [];

    const actions = Array.isArray(
      analysis?.actions
    )
      ? analysis.actions
          .filter(
            (item: unknown) =>
              typeof item === "string" &&
              item.trim()
          )
          .slice(0, 5)
      : [];

    return NextResponse.json({
      success: true,

      data: {
        summary:
          typeof analysis?.summary === "string"
            ? analysis.summary
            : "Your website analysis has been completed.",

        priority,

        opportunities,

        actions,
      },
    });
  } catch (error) {
    console.error(
      "AI ANALYSIS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate AI analysis.",
      },
      { status: 500 }
    );
  }
}