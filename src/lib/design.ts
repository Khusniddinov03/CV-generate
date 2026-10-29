export type TemplateId = "classic" | "modern" | "minimal";

export interface Design {
  template: TemplateId;
  /** Asosiy rang (sidebar / aksentlar) */
  accent: string;
}

export const defaultDesign: Design = { template: "classic", accent: "#3f3f42" };

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: "classic", name: "Classic Sidebar", description: "Chap tomonda to'q sidebar, timeline" },
  { id: "modern", name: "Modern", description: "Rangli sarlavha, ikki ustun" },
  { id: "minimal", name: "Minimal ATS", description: "Bir ustun, ATS uchun ideal" },
];

export const ACCENTS = [
  "#3f3f42",
  "#1e293b",
  "#1e3a8a",
  "#0f766e",
  "#166534",
  "#7c2d12",
  "#831843",
  "#4c1d95",
];
