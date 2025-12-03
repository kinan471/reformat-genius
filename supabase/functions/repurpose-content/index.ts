import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text_content, meta } = await req.json();
    
    if (!text_content) {
      throw new Error("No content provided");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const language = meta?.language || "auto";
    const tone = meta?.tone || "professional";

    const systemPrompt = `You are a content repurposing engine. Your task is to transform the provided content into 10 different platform-optimized formats. 

CRITICAL RULES:
- Return ONLY valid JSON
- Base everything on the provided content
- Use ${tone} tone
- IMPORTANT: Detect the input language and generate ALL outputs in the SAME language as the input. If the input is in Arabic, all outputs must be in Arabic. If the input is in English, all outputs must be in English. This applies to ALL fields including hooks, headlines, posts, scripts, hashtags, and CTAs.
- Never invent facts not in the content`;

    const userPrompt = `Transform this content into the specified formats:

${text_content}

Return a JSON object with this exact structure:
{
  "meta": {
    "input_type": "text",
    "detected_language": "en",
    "summary": "2-3 sentence summary",
    "timestamp_generated": "ISO8601 timestamp"
  },
  "outputs": {
    "viral_hook": { "text": "compelling hook", "length_chars": 0 },
    "headlines": [
      { "title": "headline 1", "score": 85 },
      { "title": "headline 2", "score": 82 },
      { "title": "headline 3", "score": 80 },
      { "title": "headline 4", "score": 78 },
      { "title": "headline 5", "score": 75 }
    ],
    "linkedin_post": { "text": "LinkedIn formatted post", "length_chars": 0 },
    "twitter_thread": {
      "tweets": ["tweet 1", "tweet 2", "tweet 3"],
      "total_tweets": 3
    },
    "instagram_carousel": {
      "slides": [
        { "headline": "slide 1 title", "body": "slide 1 content", "visual_note": "image suggestion" },
        { "headline": "slide 2 title", "body": "slide 2 content", "visual_note": "image suggestion" },
        { "headline": "slide 3 title", "body": "slide 3 content", "visual_note": "image suggestion" },
        { "headline": "slide 4 title", "body": "slide 4 content", "visual_note": "image suggestion" },
        { "headline": "slide 5 title", "body": "slide 5 content", "visual_note": "image suggestion" }
      ],
      "total_slides": 5
    },
    "instagram_reel_script": {
      "script": "15-30 second script",
      "time_seconds": 30
    },
    "youtube_description": {
      "description": "YouTube description with timestamps",
      "seo_keywords": ["keyword1", "keyword2", "keyword3"],
      "hashtags": ["#tag1", "#tag2", "#tag3"]
    },
    "tiktok_script": {
      "script": "15-60 second TikTok script",
      "time_seconds": 30
    },
    "hashtags": {
      "tags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
      "platform_scores": {
        "instagram": 90,
        "tiktok": 85,
        "linkedin": 75
      }
    },
    "cta": {
      "text": "compelling call to action",
      "type": "link"
    }
  }
}`;

    console.log("Calling Lovable AI for content repurposing...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON response from AI");
    }

    console.log("Content repurposing completed successfully");

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in repurpose-content function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
