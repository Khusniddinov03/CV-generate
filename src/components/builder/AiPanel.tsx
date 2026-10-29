"use client";

import { Lightbulb, Sparkles, Undo2 } from "lucide-react";
import { useState } from "react";
import { fromAi, toAi, type AiCv } from "@/lib/cv-schema";
import { postJSON } from "@/lib/client";
import { useCV } from "@/store/cv-store";
import { toast } from "../toast";
import { Button, Textarea } from "../ui";

const EXAMPLE = `Mening ismim Aziz Karimov, Toshkentda yashayman. 28 yoshdaman.
Telefon: +998 90 123 45 67, email: aziz.karimov@gmail.com, LinkedIn: linkedin.com/in/azizkarimov

2021-yildan hozirgacha EPAM Systems kompaniyasida Senior Frontend Developer bo'lib ishlayapman. React va Next.js da 5 ta yirik loyiha qildim, sahifa tezligini 40% ga oshirdim, 4 ta junior dasturchiga mentorlik qilaman.
2018-2021 yillarda Uzum (Toshkent) da Frontend developer bo'lganman, internet-do'kon interfeysini yaratganman, to'lov tizimini ulaganman.

TATU (Toshkent axborot texnologiyalari universiteti) ni 2018 yilda dasturiy injiniring yo'nalishi bo'yicha bitirganman.

Ko'nikmalarim: React, Next.js, TypeScript, Tailwind, Node.js, Git, Figma.
Tillar: o'zbek tili ona tilim, rus tilini erkin bilaman, ingliz tili B2.
Qiziqishlarim: shaxmat, sayohat, kitob o'qish.`;

const LANGS = [
  { id: "auto", label: "Avto" },
  { id: "uz", label: "O'zbek" },
  { id: "ru", label: "Русский" },
  { id: "en", label: "English" },
] as const;

export function AiPanel({ onDone }: { onDone?: () => void }) {
  const { cv, setCV, previous, undo } = useCV();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<(typeof LANGS)[number]["id"]>("auto");
  const [merge, setMerge] = useState(false);
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (text.trim().length < 10) {
      toast.error("Iltimos, o'zingiz haqingizda batafsilroq yozing");
      return;
    }
    setLoading(true);
    try {
      const { cv: ai } = await postJSON<{ cv: AiCv }>("/api/ai/generate", {
        text,
        language,
        current: merge ? toAi(cv) : undefined,
      });
      setCV(fromAi(ai, cv.personal.photo));
      toast.success("CV tayyor! Endi uni tahrirlashingiz mumkin.");
      onDone?.();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-fuchsia-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Sparkles className="size-4 text-brand-600" /> AI bilan CV yaratish
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          O&apos;zingiz haqingizda istalgan tilda, erkin shaklda yozing: ism, aloqa, ish tajribasi, o&apos;qish,
          ko&apos;nikmalar, tillar. AI hammasini tartiblab, professional CV&apos;ga aylantiradi.
        </p>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        placeholder="Masalan: Mening ismim ..., 2020-yildan beri ... kompaniyasida ... bo'lib ishlayman ..."
        className="text-[13px]"
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setText(EXAMPLE)}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
        >
          <Lightbulb className="size-3.5" /> Namuna matnni qo&apos;yish
        </button>
        <span className="text-xs text-slate-400">{text.length} belgi</span>
      </div>

      <div>
        <div className="mb-1.5 text-xs font-medium text-slate-500">CV tili</div>
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l.id)}
              className={
                "rounded-lg py-1.5 text-xs font-medium transition " +
                (language === l.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")
              }
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={merge}
          onChange={(e) => setMerge(e.target.checked)}
          className="mt-0.5 accent-brand-600"
        />
        <span>
          <b className="text-slate-800">Mavjud CV&apos;ni yangilash</b>
          <br />
          Yangi ma&apos;lumot hozirgi CV bilan birlashtiriladi (aks holda yangidan yaratiladi).
        </span>
      </label>

      <Button variant="ai" size="lg" className="w-full" loading={loading} onClick={generate}>
        {!loading && <Sparkles className="size-4" />}
        {loading ? "AI yozmoqda..." : "CV yaratish"}
      </Button>

      {previous && (
        <Button variant="ghost" size="sm" className="w-full" onClick={undo}>
          <Undo2 className="size-3.5" /> Oldingi holatga qaytarish
        </Button>
      )}
    </div>
  );
}
