import { NextResponse } from "next/server";
import { z } from "zod";
import { generateStructured } from "@/lib/gemini";
import { improveLocally } from "@/lib/local-parser";
import { errorResponse } from "@/lib/api-error";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  kind: z.enum(["summary", "bullets"]),
  /** summary uchun bitta element, bullets uchun bir nechta */
  items: z.array(z.string()).min(1).max(20),
  context: z.string().max(500).default(""),
});

const resultSchema = z.object({ items: z.array(z.string()) });

const SYSTEM = `You are an elite resume editor. Improve the given resume text so it is concise, professional,
impactful and ATS-friendly. Use strong action verbs and keep all facts unchanged — never invent numbers or claims.
Keep the SAME language as the input text.`;

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const input = body.items.filter((s) => s.trim());
    if (!input.length) {
      return NextResponse.json({ error: "Yaxshilash uchun matn kiriting" }, { status: 400 });
    }

    const task =
      body.kind === "summary"
        ? `Rewrite this professional summary (3-5 sentences). Return exactly one item.`
        : `Rewrite these experience bullet points. Return 3-5 polished bullets (you may merge/split for clarity).`;

    const prompt = `${task}
${body.context ? `Context (role / company): ${body.context}\n` : ""}
INPUT:
${input.map((s) => `- ${s}`).join("\n")}`;

    try {
      const { items } = await generateStructured({
        schema: resultSchema,
        system: SYSTEM,
        prompt,
        temperature: 0.6,
      });
      return NextResponse.json({ items });
    } catch {
      return NextResponse.json({ items: improveLocally(body.kind, input) });
    }
  } catch (err) {
    return errorResponse(err);
  }
}
