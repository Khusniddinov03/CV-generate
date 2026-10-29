"use client";

import clsx from "clsx";
import { Download, Eye, FileText, Palette, PencilLine, Printer, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiPanel } from "@/components/builder/AiPanel";
import { DesignPanel } from "@/components/builder/DesignPanel";
import { EditorPanel } from "@/components/builder/EditorPanel";
import { Preview } from "@/components/builder/Preview";
import { toast, Toaster } from "@/components/toast";
import { Button } from "@/components/ui";
import { useCV } from "@/store/cv-store";

type Tab = "ai" | "edit" | "design";

const TABS: { id: Tab; label: string; icon: typeof Sparkles }[] = [
  { id: "ai", label: "AI yaratish", icon: Sparkles },
  { id: "edit", label: "Tahrirlash", icon: PencilLine },
  { id: "design", label: "Dizayn", icon: Palette },
];

export default function BuilderPage() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("ai");
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [downloading, setDownloading] = useState(false);
  const { cv, design, reset } = useCV();

  useEffect(() => setMounted(true), []);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const fileName = `${cv.personal.fullName || "CV"} - CV`;
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, design, fileName }),
      });
      if (!res.ok) {
        // Agar server (masalan, serverless muhit) da mahalliy Chrome bo'lmasa,
        // brauzerning o'z PDF generatorini ochamiz (sifati 100% bir xil vektorli PDF).
        toast.success("PDF saqlash oynasi ochildi («Save as PDF» ni tanlang)");
        setTimeout(() => window.print(), 150);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF yuklab olindi");
    } catch (e) {
      toast.error(`${(e as Error).message}. "Chop etish" tugmasi orqali ham PDF saqlashingiz mumkin.`);
    } finally {
      setDownloading(false);
    }
  }

  if (!mounted) {
    return <div className="flex h-screen items-center justify-center text-sm text-slate-400">Yuklanmoqda...</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* ---------- Header ---------- */}
      <header className="z-10 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white">
            <FileText className="size-4" />
          </span>
          <span className="font-display text-lg font-medium tracking-wide text-slate-900">CVMaker AI</span>
        </Link>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          className="hidden md:inline-flex"
          onClick={() => {
            if (confirm("CV tozalansinmi? (Bekor qilish AI panelida mavjud)")) reset("empty");
          }}
        >
          <RotateCcw className="size-3.5" /> Tozalash
        </Button>
        <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={() => window.print()}>
          <Printer className="size-3.5" /> Chop etish
        </Button>
        <Button variant="primary" size="sm" loading={downloading} onClick={downloadPdf}>
          {!downloading && <Download className="size-3.5" />} PDF yuklab olish
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ---------- Chap panel ---------- */}
        <aside
          className={clsx(
            "flex w-full shrink-0 flex-col border-r border-slate-200 bg-[#fbfbfd] md:w-[440px] lg:w-[480px]",
            mobileView === "preview" && "hidden md:flex",
          )}
        >
          <nav className="flex gap-1 border-b border-slate-200 p-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={clsx(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition",
                  tab === t.id ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-800",
                )}
              >
                <t.icon className="size-4" /> {t.label}
              </button>
            ))}
          </nav>
          <div className="thin-scroll flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
            {tab === "ai" && <AiPanel onDone={() => setTab("edit")} />}
            {tab === "edit" && <EditorPanel />}
            {tab === "design" && <DesignPanel />}
          </div>
        </aside>

        {/* ---------- Preview ---------- */}
        <main
          className={clsx(
            "thin-scroll min-w-0 flex-1 overflow-y-auto bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:18px_18px]",
            mobileView === "form" && "hidden md:block",
          )}
        >
          <Preview />
        </main>
      </div>

      {/* ---------- Mobil almashtirgich ---------- */}
      <button
        onClick={() => setMobileView(mobileView === "form" ? "preview" : "form")}
        className="fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl md:hidden"
      >
        {mobileView === "form" ? (
          <>
            <Eye className="size-4" /> Ko&apos;rish
          </>
        ) : (
          <>
            <PencilLine className="size-4" /> Tahrirlash
          </>
        )}
      </button>

      <Toaster />
    </div>
  );
}
