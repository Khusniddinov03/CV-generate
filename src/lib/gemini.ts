import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

let client: GoogleGenAI | null = null;

export class AiConfigError extends Error {}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiConfigError(
      "GEMINI_API_KEY topilmadi. .env.local fayliga GEMINI_API_KEY=... qo'shing (https://aistudio.google.com/apikey).",
    );
  }
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

export const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/**
 * Gemini'dan Zod schema'ga mos, tekshirilgan JSON obyekt oladi.
 */
export async function generateStructured<T extends z.ZodType>(opts: {
  schema: T;
  system: string;
  prompt: string;
  temperature?: number;
}): Promise<z.infer<T>> {
  const ai = getClient();
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
    config: {
      systemInstruction: opts.system,
      temperature: opts.temperature ?? 0.4,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(opts.schema, { target: "draft-7" }),
    },
  });

  const text = res.text;
  if (!text) throw new Error("AI bo'sh javob qaytardi");

  const parsed = opts.schema.safeParse(JSON.parse(text));
  if (!parsed.success) {
    throw new Error("AI javobi kutilgan formatga mos kelmadi");
  }
  return parsed.data;
}

export const LANG_NAMES: Record<string, string> = {
  uz: "Uzbek (Latin script)",
  ru: "Russian",
  en: "English",
};
