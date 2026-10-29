import { notFound } from "next/navigation";
import { CVDocument } from "@/components/templates";
import type { CV } from "@/lib/cv-schema";
import type { Design } from "@/lib/design";
import { takePrintPayload } from "@/lib/pdf";

export const dynamic = "force-dynamic";

/** Faqat server ichidagi Puppeteer uchun: CV'ni toza holda chizadi */
export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const payload = token ? (takePrintPayload(token) as { cv: CV; design: Design } | null) : null;
  if (!payload) notFound();

  return (
    <div style={{ background: "#fff" }}>
      <style>{"html,body{background:#fff !important;margin:0}"}</style>
      <CVDocument cv={payload.cv} design={payload.design} />
    </div>
  );
}
