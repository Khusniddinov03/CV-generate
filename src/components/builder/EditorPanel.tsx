"use client";

import clsx from "clsx";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Heart,
  ImagePlus,
  Languages,
  Link2,
  Plus,
  Sparkles,
  Trash2,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import type { ListSection } from "@/lib/cv-schema";
import { postJSON, resizeImage } from "@/lib/client";
import { useCV } from "@/store/cv-store";
import { toast } from "../toast";
import { Button, Field, Input, Textarea } from "../ui";

/* ------------------------------------------------------------------ */

function Section({
  icon: Icon,
  title,
  count,
  defaultOpen,
  children,
}: {
  icon: typeof User;
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="size-4" />
        </span>
        <span className="flex-1 text-sm font-semibold text-slate-800">{title}</span>
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{count}</span>
        )}
        <ChevronDown className={clsx("size-4 text-slate-400 transition", open && "rotate-180")} />
      </button>
      {open && <div className="space-y-3 border-t border-slate-100 p-4">{children}</div>}
    </div>
  );
}

function ItemShell({
  section,
  id,
  index,
  total,
  title,
  children,
}: {
  section: ListSection;
  id: string;
  index: number;
  total: number;
  title: string;
  children: ReactNode;
}) {
  const { removeItem, moveItem } = useCV();
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-2 flex items-center gap-1">
        <span className="flex-1 truncate text-xs font-semibold text-slate-600">{title || "Yangi element"}</span>
        <button
          type="button"
          disabled={index === 0}
          onClick={() => moveItem(section, id, -1)}
          className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"
          title="Yuqoriga"
        >
          <ChevronUp className="size-3.5" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => moveItem(section, id, 1)}
          className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-30"
          title="Pastga"
        >
          <ChevronDown className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => removeItem(section, id)}
          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
          title="O'chirish"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function AddButton({ section, label }: { section: ListSection; label: string }) {
  const addItem = useCV((s) => s.addItem);
  return (
    <Button size="sm" variant="secondary" className="w-full border-dashed" onClick={() => addItem(section)}>
      <Plus className="size-3.5" /> {label}
    </Button>
  );
}

function AiImproveButton({
  kind,
  items,
  context,
  onResult,
}: {
  kind: "summary" | "bullets";
  items: string[];
  context?: string;
  onResult: (items: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  async function run() {
    setLoading(true);
    try {
      const res = await postJSON<{ items: string[] }>("/api/ai/improve", { kind, items, context });
      if (res.items.length) onResult(res.items);
      toast.success("AI matnni yaxshiladi");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        run();
      }}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-violet-600 hover:bg-violet-50 disabled:opacity-50"
    >
      <Sparkles className={clsx("size-3", loading && "animate-spin")} />
      {loading ? "Yozmoqda..." : "AI bilan yaxshilash"}
    </button>
  );
}

/** Har bir qator — bitta bullet */
function BulletsField({
  value,
  onChange,
  context,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  context: string;
}) {
  return (
    <Field
      label="Yutuqlar / vazifalar (har biri yangi qatorda)"
      action={<AiImproveButton kind="bullets" items={value} context={context} onResult={onChange} />}
    >
      <Textarea
        rows={4}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
        className="text-xs"
      />
    </Field>
  );
}

function LevelField({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-slate-800"
      />
      <span className="w-9 text-right text-xs tabular-nums text-slate-500">{value}%</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PhotoField() {
  const photo = useCV((s) => s.cv.personal.photo);
  const setPersonal = useCV((s) => s.setPersonal);
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    try {
      setPersonal("photo", await resizeImage(file));
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-brand-500 hover:text-brand-600"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-5" />
        )}
      </button>
      <div className="text-xs text-slate-500">
        <div className="font-medium text-slate-700">Profil rasmi</div>
        <div className="mt-1 flex gap-2">
          <button type="button" className="text-brand-600 hover:underline" onClick={() => ref.current?.click()}>
            Yuklash
          </button>
          {photo && (
            <button type="button" className="text-red-500 hover:underline" onClick={() => setPersonal("photo", "")}>
              O&apos;chirish
            </button>
          )}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function HobbiesField() {
  const hobbies = useCV((s) => s.cv.hobbies);
  const setHobbies = useCV((s) => s.setHobbies);
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v) setHobbies([...hobbies, v]);
    setDraft("");
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {hobbies.map((h, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-3 pr-1.5 text-xs text-slate-700"
          >
            {h}
            <button
              type="button"
              onClick={() => setHobbies(hobbies.filter((_, j) => j !== i))}
              className="rounded-full p-0.5 hover:bg-slate-200"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder="Masalan: Shaxmat"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button size="sm" className="h-9" onClick={add}>
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function EditorPanel() {
  const { cv, setPersonal, updateItem } = useCV();
  const p = cv.personal;

  return (
    <div className="space-y-3">
      <Section icon={User} title="Shaxsiy ma'lumotlar" defaultOpen>
        <PhotoField />
        <div className="grid grid-cols-2 gap-2">
          <Field label="To'liq ism">
            <Input value={p.fullName} onChange={(e) => setPersonal("fullName", e.target.value)} />
          </Field>
          <Field label="Lavozim">
            <Input value={p.title} onChange={(e) => setPersonal("title", e.target.value)} />
          </Field>
          <Field label="Email">
            <Input value={p.email} onChange={(e) => setPersonal("email", e.target.value)} />
          </Field>
          <Field label="Telefon">
            <Input value={p.phone} onChange={(e) => setPersonal("phone", e.target.value)} />
          </Field>
          <Field label="Manzil" className="col-span-2">
            <Input value={p.location} onChange={(e) => setPersonal("location", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section icon={BookOpen} title="O'zim haqimda">
        <Field
          label="Qisqacha professional tavsif"
          action={
            <AiImproveButton
              kind="summary"
              items={[p.summary]}
              context={p.title}
              onResult={(r) => setPersonal("summary", r.join(" "))}
            />
          }
        >
          <Textarea rows={6} value={p.summary} onChange={(e) => setPersonal("summary", e.target.value)} />
        </Field>
      </Section>

      <Section icon={Briefcase} title="Ish tajribasi" count={cv.experience.length}>
        {cv.experience.map((e, i) => (
          <ItemShell
            key={e.id}
            section="experience"
            id={e.id}
            index={i}
            total={cv.experience.length}
            title={[e.role, e.company].filter(Boolean).join(" — ")}
          >
            <div className="grid grid-cols-2 gap-2">
              <Field label="Lavozim">
                <Input value={e.role} onChange={(ev) => updateItem("experience", e.id, { role: ev.target.value })} />
              </Field>
              <Field label="Kompaniya">
                <Input
                  value={e.company}
                  onChange={(ev) => updateItem("experience", e.id, { company: ev.target.value })}
                />
              </Field>
              <Field label="Boshlanish">
                <Input value={e.start} onChange={(ev) => updateItem("experience", e.id, { start: ev.target.value })} />
              </Field>
              <Field label="Tugash">
                <Input value={e.end} onChange={(ev) => updateItem("experience", e.id, { end: ev.target.value })} />
              </Field>
              <Field label="Shahar" className="col-span-2">
                <Input
                  value={e.location}
                  onChange={(ev) => updateItem("experience", e.id, { location: ev.target.value })}
                />
              </Field>
            </div>
            <BulletsField
              value={e.bullets}
              context={`${e.role} at ${e.company}`}
              onChange={(b) => updateItem("experience", e.id, { bullets: b })}
            />
          </ItemShell>
        ))}
        <AddButton section="experience" label="Ish joyi qo'shish" />
      </Section>

      <Section icon={GraduationCap} title="Ta'lim" count={cv.education.length}>
        {cv.education.map((e, i) => (
          <ItemShell
            key={e.id}
            section="education"
            id={e.id}
            index={i}
            total={cv.education.length}
            title={e.institution}
          >
            <div className="grid grid-cols-2 gap-2">
              <Field label="O'quv muassasasi" className="col-span-2">
                <Input
                  value={e.institution}
                  onChange={(ev) => updateItem("education", e.id, { institution: ev.target.value })}
                />
              </Field>
              <Field label="Daraja / yo'nalish" className="col-span-2">
                <Input value={e.degree} onChange={(ev) => updateItem("education", e.id, { degree: ev.target.value })} />
              </Field>
              <Field label="Shahar">
                <Input
                  value={e.location}
                  onChange={(ev) => updateItem("education", e.id, { location: ev.target.value })}
                />
              </Field>
              <Field label="Yil">
                <Input value={e.year} onChange={(ev) => updateItem("education", e.id, { year: ev.target.value })} />
              </Field>
            </div>
            <Field label="Qo'shimcha (har biri yangi qatorda)">
              <Textarea
                rows={2}
                className="text-xs"
                value={e.bullets.join("\n")}
                onChange={(ev) => updateItem("education", e.id, { bullets: ev.target.value.split("\n") })}
              />
            </Field>
          </ItemShell>
        ))}
        <AddButton section="education" label="Ta'lim qo'shish" />
      </Section>

      <Section icon={Wrench} title="Ko'nikmalar" count={cv.skills.length}>
        {cv.skills.map((s, i) => (
          <ItemShell key={s.id} section="skills" id={s.id} index={i} total={cv.skills.length} title={s.name}>
            <Input
              value={s.name}
              placeholder="Ko'nikma nomi"
              onChange={(ev) => updateItem("skills", s.id, { name: ev.target.value })}
            />
            <LevelField value={s.level} onChange={(n) => updateItem("skills", s.id, { level: n })} />
          </ItemShell>
        ))}
        <AddButton section="skills" label="Ko'nikma qo'shish" />
      </Section>

      <Section icon={Languages} title="Tillar" count={cv.languages.length}>
        {cv.languages.map((s, i) => (
          <ItemShell key={s.id} section="languages" id={s.id} index={i} total={cv.languages.length} title={s.name}>
            <Input
              value={s.name}
              placeholder="Til"
              onChange={(ev) => updateItem("languages", s.id, { name: ev.target.value })}
            />
            <LevelField value={s.level} onChange={(n) => updateItem("languages", s.id, { level: n })} />
          </ItemShell>
        ))}
        <AddButton section="languages" label="Til qo'shish" />
      </Section>

      <Section icon={Link2} title="Havolalar" count={cv.links.length}>
        {cv.links.map((l, i) => (
          <ItemShell key={l.id} section="links" id={l.id} index={i} total={cv.links.length} title={l.label}>
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={l.label}
                placeholder="LinkedIn"
                onChange={(ev) => updateItem("links", l.id, { label: ev.target.value })}
              />
              <Input
                className="col-span-2"
                value={l.url}
                placeholder="https://..."
                onChange={(ev) => updateItem("links", l.id, { url: ev.target.value })}
              />
            </div>
          </ItemShell>
        ))}
        <AddButton section="links" label="Havola qo'shish" />
      </Section>

      <Section icon={Users} title="Tavsiyanomalar" count={cv.references.length}>
        {cv.references.map((r, i) => (
          <ItemShell key={r.id} section="references" id={r.id} index={i} total={cv.references.length} title={r.name}>
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={r.name}
                placeholder="Ism"
                onChange={(ev) => updateItem("references", r.id, { name: ev.target.value })}
              />
              <Input
                value={r.company}
                placeholder="Kompaniya"
                onChange={(ev) => updateItem("references", r.id, { company: ev.target.value })}
              />
              <Input
                value={r.phone}
                placeholder="Telefon"
                onChange={(ev) => updateItem("references", r.id, { phone: ev.target.value })}
              />
              <Input
                value={r.email}
                placeholder="Email"
                onChange={(ev) => updateItem("references", r.id, { email: ev.target.value })}
              />
            </div>
          </ItemShell>
        ))}
        <AddButton section="references" label="Tavsiyanoma qo'shish" />
      </Section>

      <Section icon={Heart} title="Qiziqishlar" count={cv.hobbies.length}>
        <HobbiesField />
      </Section>
    </div>
  );
}
