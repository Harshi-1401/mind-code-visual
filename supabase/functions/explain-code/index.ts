import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, difficulty, mode } = await req.json();

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt: string;
    let userPrompt: string;

    if (mode === "flow") {
      systemPrompt = `You are a code analysis expert. Given code, produce a JSON array of flow steps representing the code's logical flow. Each step has: id (number), type ("start"|"process"|"decision"|"end"), label (short description). Always start with a "start" step and end with an "end" step. Keep labels concise (under 8 words). Return ONLY the JSON array, no markdown.`;
      userPrompt = `Analyze this code and return a flow diagram as a JSON array:\n\n${code}`;
    } else {
      systemPrompt = `You are a patient coding teacher. Explain code at the ${difficulty || "beginner"} level. Return a JSON object with:
- "lines": array of objects with "line" (the code line) and "explanation" (your explanation)
- "summary": a clear overall summary
Skip empty lines. For beginner level use simple words and analogies. Return ONLY valid JSON, no markdown.`;
      userPrompt = `Explain the following code in a ${difficulty || "beginner"} level. Break it down line by line and then provide a short and clear summary.\n\nCode:\n${code}`;
    }

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
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error: " + response.status);
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    if (!content || content.trim().length === 0) {
      throw new Error("AI returned empty response");
    }

    // Parse JSON from response, stripping markdown fences if present
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", cleaned.substring(0, 500));
      throw new Error("AI returned invalid JSON");
    }

    // Normalize flow mode: if response wrapped in object, extract the array
    if (mode === "flow" && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      const arrKey = keys.find(k => Array.isArray(parsed[k]));
      if (arrKey) parsed = parsed[arrKey];
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("explain-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
