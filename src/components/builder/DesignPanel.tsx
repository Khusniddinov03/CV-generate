"use client";

import clsx from "clsx";
import { Check } from "lucide-react";
import { CVDocument } from "@/components/templates";
import { A4 } from "@/components/templates/shared";
import { ACCENTS, TEMPLATES } from "@/lib/design";
import { useCV } from "@/store/cv-store";

const THUMB = 0.22;

export function DesignPanel() {
  const { cv, design, setDesign } = useCV();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((t) => {
            const active = design.template === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setDesign({ template: t.id })}
                className={clsx(
                  "group relative overflow-hidden rounded-xl border-2 bg-white text-left transition",
                  active ? "border-brand-500 shadow-lg shadow-brand-500/10" : "border-slate-200 hover:border-slate-300",
                )}
              >
                <div
                  className="pointer-events-none overflow-hidden border-b border-slate-100"
                  style={{ height: A4.height * THUMB * 0.62 }}
                >
                  <div style={{ transform: `scale(${THUMB})`, transformOrigin: "top left", width: A4.width }}>
                    <CVDocument cv={cv} design={{ ...design, template: t.id }} />
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-slate-800">{t.name}</div>
                  <div className="text-[11px] leading-snug text-slate-500">{t.description}</div>
                </div>
                {active && (
                  <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="size-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Asosiy rang</h3>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setDesign({ accent: c })}
              className={clsx(
                "size-8 rounded-full ring-offset-2 transition",
                design.accent === c ? "ring-2 ring-slate-900" : "hover:scale-110",
              )}
              style={{ background: c }}
              title={c}
            />
          ))}
          <label
            className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-200 text-[10px] text-slate-500"
            title="Boshqa rang"
            style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }}
          >
            <input
              type="color"
              value={design.accent}
              onChange={(e) => setDesign({ accent: e.target.value })}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
