import { NextResponse } from "next/server";
import { z } from "zod";
import { deletePrintPayload, getBrowser, putPrintPayload } from "@/lib/pdf";
import { errorResponse } from "@/lib/api-error";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  cv: z.record(z.string(), z.unknown()),
  design: z.object({ template: z.string(), accent: z.string() }),
  fileName: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  let token: string | null = null;
  try {
    const body = bodySchema.parse(await req.json());
    token = putPrintPayload({ cv: body.cv, design: body.design });

    const origin = new URL(req.url).origin;
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.goto(`${origin}/print?token=${token}`, { waitUntil: "networkidle0", timeout: 30_000 });
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      const safe = (body.fileName || "CV").replace(/[^\p{L}\p{N}_\- ]/gu, "").trim() || "CV";
      return new NextResponse(Buffer.from(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="cv.pdf"; filename*=UTF-8''${encodeURIComponent(safe)}.pdf`,
        },
      });
    } finally {
      await page.close().catch(() => {});
    }
  } catch (err) {
    return errorResponse(err);
  } finally {
    if (token) deletePrintPayload(token);
  }
}
