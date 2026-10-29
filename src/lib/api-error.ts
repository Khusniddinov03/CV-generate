import { NextResponse } from "next/server";
import { z } from "zod";
import { AiConfigError } from "@/lib/gemini";

export function errorResponse(err: unknown) {
  console.error("[API]", err);
  if (err instanceof z.ZodError) {
    return NextResponse.json({ error: err.issues[0]?.message ?? "Noto'g'ri so'rov" }, { status: 400 });
  }
  if (err instanceof AiConfigError) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  const msg = err instanceof Error ? err.message : "Noma'lum xato";
  return NextResponse.json({ error: `Xato: ${msg}` }, { status: 502 });
}
