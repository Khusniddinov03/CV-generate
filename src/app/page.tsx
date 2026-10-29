import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Download,
  FileText,
  Globe2,
  LayoutTemplate,
  MessageSquareText,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";
import { CVDocument } from "@/components/templates";
import { A4 } from "@/components/templates/shared";
import { sampleCV } from "@/lib/cv-schema";
import { defaultDesign } from "@/lib/design";

const FEATURES = [
  {
    icon: MessageSquareText,
    title: "Erkin matndan CV",
    text: "O'zingiz haqingizda oddiy so'zlar bilan yozing, AI hammasini bo'limlarga ajratib, tartiblab beradi.",
  },
  {
    icon: Wand2,
    title: "AI bilan yaxshilash",
    text: "Bir tugma bilan tavsif va yutuqlaringiz kuchli, professional va ATS'ga mos matnga aylanadi.",
  },
  {
    icon: Globe2,
    title: "3 tilda",
    text: "O'zbek, rus yoki ingliz tilida yozing, CV'ni istalgan tilda oling. AI o'zi tarjima qiladi.",
  },
  {
    icon: LayoutTemplate,
    title: "Professional template'lar",
    text: "Classic, Modern va Minimal ATS dizaynlari. Rangni o'zingiz tanlaysiz.",
  },
  {
    icon: Palette,
    title: "Live preview",
    text: "Har bir o'zgarishni A4 sahifada darhol ko'rasiz, sahifa chegaralari bilan.",
  },
  {
    icon: Download,
    title: "Pixel-perfect PDF",
    text: "Chrome dvigateli orqali yaratilgan, matni tanlanadigan va ATS o'qiy oladigan PDF.",
  },
];

const STEPS = [
  { n: "01", title: "Yozing", text: "Tajriba, ta'lim va ko'nikmalaringiz haqida erkin matn" },
  { n: "02", title: "AI tuzadi", text: "Bir necha soniyada tayyor, tartibli CV" },
  { n: "03", title: "Sozlang va yuklang", text: "Tahrirlang, dizayn tanlang va PDF oling" },
];

export default function Home() {
  const preview = 0.52;
  return (
    <div className="min-h-screen overflow-hidden bg-white">
      {/* NAV */}
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white">
            <FileText className="size-4" />
          </span>
          <span className="font-display text-lg font-medium tracking-wide">CVMaker AI</span>
        </Link>
        <Link
          href="/builder"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Boshlash
        </Link>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-100 via-violet-100 to-fuchsia-100 opacity-70 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur">
              <Sparkles className="size-3.5" /> Gemini AI asosida
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl">
              Matn yozing,{" "}
              <span className="bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                professional CV
              </span>{" "}
              oling.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              O&apos;zingiz haqingizda istalgan shaklda yozing. Sun&apos;iy intellekt uni 30 soniyada chiroyli,
              ATS-friendly CV&apos;ga aylantiradi va PDF holatida tayyorlab beradi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/builder"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-600 px-6 font-medium text-white shadow-lg shadow-brand-500/25 transition hover:brightness-110"
              >
                <Bot className="size-5" /> CV yaratishni boshlash
                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {["Ro'yxatdan o'tish shart emas", "Bepul", "Ma'lumotlar brauzeringizda"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto" style={{ width: A4.width * preview, height: A4.height * preview }}>
            <div className="absolute -inset-4 rotate-3 rounded-2xl bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20" />
            <div
              className="relative overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-200"
              style={{ width: A4.width * preview, height: A4.height * preview }}
            >
              <div style={{ transform: `scale(${preview})`, transformOrigin: "top left", width: A4.width }}>
                <CVDocument cv={sampleCV()} design={defaultDesign} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="font-display text-3xl font-medium text-brand-600/40">{s.n}</span>
              <div>
                <div className="font-semibold text-slate-900">{s.title}</div>
                <div className="mt-1 text-sm text-slate-500">{s.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
          Ish topish uchun kerak bo&apos;lgan hamma narsa
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <f.icon className="size-5" />
              </span>
              <div className="mt-4 font-semibold text-slate-900">{f.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Orzuingizdagi ishga birinchi qadam</h2>
          <p className="mt-3 text-slate-300">Professional CV yaratish bor-yo&apos;g&apos;i bir necha daqiqa oladi.</p>
          <Link
            href="/builder"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Hoziroq boshlash <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} CVMaker AI
      </footer>
    </div>
  );
}
