"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CVDocument } from "@/components/templates";
import { A4 } from "@/components/templates/shared";
import { useCV } from "@/store/cv-store";

/** A4 sahifani konteyner kengligiga moslab, real vaqtda ko'rsatadi */
export function Preview() {
  const { cv, design } = useCV();
  const wrapRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [height, setHeight] = useState(A4.height);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(Math.min(1.15, Math.max(0.3, (w - 48) / A4.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = docRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pages = Math.max(1, Math.ceil((height - 2) / A4.height));

  return (
    <div ref={wrapRef} className="flex w-full flex-col items-center py-6">
      <div
        id="cv-print-area"
        style={{ width: A4.width * scale, height: height * scale }}
        className="relative"
      >
        <div
          ref={docRef}
          className="cv-scale bg-white shadow-[0_10px_40px_-10px_rgba(15,23,42,.25)] ring-1 ring-slate-200"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: A4.width }}
        >
          <CVDocument cv={cv} design={design} />
        </div>

        {/* Sahifa chegaralari */}
        {Array.from({ length: pages - 1 }, (_, i) => (
          <div
            key={i}
            className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-brand-500/50 print:hidden"
            style={{ top: A4.height * (i + 1) * scale }}
          >
            <span className="absolute -top-2.5 right-2 rounded bg-brand-500 px-1.5 text-[10px] font-medium text-white">
              {i + 2}-sahifa
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400 print:hidden">
        A4 · {pages} sahifa · {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
