import type { ReactNode } from "react";
import type { CV, LevelItem } from "@/lib/cv-schema";

/** A4 o'lchami 96dpi da */
export const A4 = { width: 794, height: 1123 };

export const has = (s?: string) => !!s && s.trim().length > 0;
export const nonEmpty = <T,>(arr: T[], pick: (x: T) => string) => arr.filter((x) => has(pick(x)));

export function splitName(fullName: string): [string, string] {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return [parts[0] ?? "", ""];
  return [parts[0], parts.slice(1).join(" ")];
}

export function dateRange(start?: string, end?: string) {
  if (has(start) && has(end)) return `${start} - ${end}`;
  return start || end || "";
}

export function Bullets({ items, className }: { items: string[]; className?: string }) {
  const list = items.filter(has);
  if (!list.length) return null;
  return (
    <ul className={className}>
      {list.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

export function LevelBars({
  items,
  barColor,
  trackColor = "#e5e5e5",
  labelClass,
  columns = 2,
}: {
  items: LevelItem[];
  barColor: string;
  trackColor?: string;
  labelClass?: string;
  columns?: 1 | 2;
}) {
  const list = nonEmpty(items, (x) => x.name);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns === 2 ? "1fr 1fr" : "1fr",
        columnGap: 38,
        rowGap: 14,
      }}
    >
      {list.map((s) => (
        <div key={s.id} style={{ breakInside: "avoid" }}>
          <div className={labelClass}>{s.name}</div>
          <div style={{ height: 4, background: trackColor, marginTop: 4 }}>
            <div style={{ height: "100%", width: `${s.level}%`, background: barColor }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Avatar({ src, size, ring }: { src: string; size: number; ring?: string }) {
  if (!has(src)) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        display: "block",
        boxShadow: ring ? `0 0 0 4px ${ring}` : undefined,
      }}
    />
  );
}

export type TemplateProps = { cv: CV; accent: string };

export function Show({ when, children }: { when: boolean; children: ReactNode }) {
  return when ? <>{children}</> : null;
}
