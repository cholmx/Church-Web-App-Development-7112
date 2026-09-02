import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_MODEL = "gemini-3.6-flash";

async function callGemini(apiKey: string, system: string, userContent: string, maxTokens = 1000): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: userContent }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini API error (${response.status})`);
  }
  const parts = data.candidates?.[0]?.content?.parts as { text?: string }[] | undefined;
  return parts?.map((p) => p.text ?? "").join("") || "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    if (body._direct && body.systemPrompt && body.userPrompt) {
      const result = await callGemini(geminiKey, body.systemPrompt, body.userPrompt, 1000);
      return new Response(
        JSON.stringify({ script: result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { announcements, date } = body;

    // Stage scripts are read on Sunday, find the upcoming Sunday from the generation date
    const genDate = new Date(date + "T12:00:00");
    const dayOfWeek = genDate.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const sundayDate = new Date(genDate);
    sundayDate.setDate(genDate.getDate() + daysUntilSunday);
    const sundayStr = sundayDate.toISOString().split("T")[0];

    const itemsContext = announcements.map((a: Record<string, unknown>, i: number) => {
      const lines: string[] = [
        `ANNOUNCEMENT ${i + 1}: "${a.title}"`,
        `Details: ${a.body}`,
      ];
      if (a.event_date) {
        const d = new Date((a.event_date as string) + "T12:00:00");
        const formatted = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        const refDate = new Date(sundayStr + "T12:00:00");
        const weeksOut = Math.ceil((d.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        lines.push(`Event Date: ${formatted}${weeksOut > 0 ? ` (${weeksOut} weeks from this Sunday)` : " (this week)"}`);
      } else {
        lines.push("Ongoing");
      }
      if (a.stage_notes) lines.push(`Tone Notes: ${a.stage_notes}`);
      const contact = [a.contact_name, a.contact_info].filter(Boolean).join(" | ");
      if (contact) lines.push(`Contact: ${contact}`);
      return lines.join("\n");
    }).join("\n\n");

    const formattedSunday = sundayDate.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

    const systemPrompt = `You are writing a Sunday morning announcement script for Upper Room Fellowship. This script will be read on ${formattedSunday}. All date references should be oriented from that Sunday, that is "today" from the pastor's perspective. The lead pastor will read this from the stage. Write the way a real person actually talks to people they know and love. It should feel warm without being performative, not fake-friendly, just genuinely human. Use natural spoken rhythm. Sentences don't all have to be short, vary the length so it flows well out loud. Plain words. No em dashes. No colons. No lists. No hype. No filler phrases. Don't announce what you're about to say, just say it. Let each announcement breathe, give it enough space that people can actually absorb it. If there is a contact person, mention their name and tell people to reach out to them, never read out a phone number or email address from the stage. Move between announcements naturally, the way a pastor would in real life. After covering all the announcements, release kids to Sunday school, then invite everyone to head to the lobby, grab some coffee, and take a minute to introduce themselves to somebody. Then let them know the sermon starts in about 6 minutes. Write ONLY the words the pastor would say out loud. No headers, no labels, no stage directions.`;

    const userContent = `Write the Sunday morning stage announcement script for ${formattedSunday}. Here are the whole-church announcements that need to be covered:\n\n${itemsContext}\n\nWrite ONLY the script text. No headers, no labels, no stage directions. Just the words the pastor would say out loud.`;

    const script = await callGemini(geminiKey, systemPrompt, userContent, 1000);

    return new Response(
      JSON.stringify({ script: script || "Could not generate script." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
