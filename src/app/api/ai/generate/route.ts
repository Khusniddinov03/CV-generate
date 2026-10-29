import { NextResponse } from "next/server";
import { z } from "zod";
import { aiCvSchema } from "@/lib/cv-schema";
import { generateStructured, LANG_NAMES } from "@/lib/gemini";
import { parseCvLocally } from "@/lib/local-parser";
import { errorResponse } from "@/lib/api-error";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  text: z.string().min(10, "Matn juda qisqa").max(20000),
  language: z.enum(["auto", "uz", "ru", "en"]).default("auto"),
  current: aiCvSchema.optional(),
});

const SYSTEM = `You are a world-class professional resume writer and career coach.
Your job: turn the user's free-form text about themselves into a polished, ATS-friendly resume.

Rules:
- Extract ONLY facts present in the text (or in the existing resume). NEVER invent companies, dates, degrees, contacts or references.
- You MAY rewrite wording to be professional: strong action verbs, concise, quantified where the user provided numbers.
- Write a compelling 3-5 sentence professional summary based on the facts.
- Experience bullets: 3-5 per role, achievement-oriented. If the user gives little detail, write fewer but realistic bullets derived from the role.
- Order experience and education from most recent to oldest.
- Skill/language levels are 0-100. Infer from words like "native" (100), "fluent" (90), "advanced" (80), "intermediate" (60), "basic" (35). Default 75 for skills if unknown.
- Unknown text fields must be empty strings, unknown lists must be empty arrays.
- Dates format: "Jan 2020" style (localized month names in the target language), or the user's year only if that's all they gave. Use "Present"/"Hozirgacha"/"Настоящее время" for current roles.`;

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());

    const langInstruction =
      body.language === "auto"
        ? "Write the resume in the SAME language the user wrote in."
        : `Write the entire resume in ${LANG_NAMES[body.language]}.`;

    const prompt = body.current
      ? `${langInstruction}

EXISTING RESUME (JSON) — keep all of it, and merge / update it with the new information below:
${JSON.stringify(body.current)}

NEW INFORMATION FROM USER:
"""${body.text}"""`
      : `${langInstruction}

USER TEXT:
"""${body.text}"""`;

    try {
      const cv = await generateStructured({ schema: aiCvSchema, system: SYSTEM, prompt });
      return NextResponse.json({ cv });
    } catch {
      const cv = parseCvLocally(body.text, body.language);
      return NextResponse.json({ cv });
    }
  } catch (err) {
    return errorResponse(err);
  }
}
