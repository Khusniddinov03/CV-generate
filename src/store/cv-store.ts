"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emptyCV, emptyItem, sampleCV, type CV, type ListSection, type Personal } from "@/lib/cv-schema";
import { defaultDesign, type Design } from "@/lib/design";

type ItemOf<K extends ListSection> = CV[K][number];

interface CVState {
  cv: CV;
  design: Design;
  /** AI natijasidan oldingi holat (bekor qilish uchun) */
  previous: CV | null;

  setCV: (cv: CV, keepUndo?: boolean) => void;
  undo: () => void;
  reset: (kind: "empty" | "sample") => void;
  setDesign: (patch: Partial<Design>) => void;

  setPersonal: <K extends keyof Personal>(key: K, value: Personal[K]) => void;
  addItem: (section: ListSection) => void;
  updateItem: <K extends ListSection>(section: K, id: string, patch: Partial<ItemOf<K>>) => void;
  removeItem: (section: ListSection, id: string) => void;
  moveItem: (section: ListSection, id: string, dir: -1 | 1) => void;
  setHobbies: (hobbies: string[]) => void;
}

export const useCV = create<CVState>()(
  persist(
    (set) => ({
      cv: sampleCV(),
      design: defaultDesign,
      previous: null,

      setCV: (cv, keepUndo = true) =>
        set((s) => ({ cv, previous: keepUndo ? s.cv : null })),
      undo: () => set((s) => (s.previous ? { cv: s.previous, previous: null } : s)),
      reset: (kind) =>
        set((s) => ({ cv: kind === "empty" ? emptyCV() : sampleCV(), previous: s.cv })),
      setDesign: (patch) => set((s) => ({ design: { ...s.design, ...patch } })),

      setPersonal: (key, value) =>
        set((s) => ({ cv: { ...s.cv, personal: { ...s.cv.personal, [key]: value } } })),

      addItem: (section) =>
        set((s) => ({
          cv: { ...s.cv, [section]: [...s.cv[section], emptyItem[section]()] },
        })),

      updateItem: (section, id, patch) =>
        set((s) => ({
          cv: {
            ...s.cv,
            [section]: (s.cv[section] as ItemOf<typeof section>[]).map((x) =>
              x.id === id ? { ...x, ...patch } : x,
            ),
          },
        })),

      removeItem: (section, id) =>
        set((s) => ({
          cv: {
            ...s.cv,
            [section]: (s.cv[section] as { id: string }[]).filter((x) => x.id !== id),
          },
        })),

      moveItem: (section, id, dir) =>
        set((s) => {
          const arr = [...(s.cv[section] as { id: string }[])];
          const i = arr.findIndex((x) => x.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= arr.length) return s;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          return { cv: { ...s.cv, [section]: arr } };
        }),

      setHobbies: (hobbies) => set((s) => ({ cv: { ...s.cv, hobbies } })),
    }),
    {
      name: "cvmaker-v1",
      partialize: (s) => ({ cv: s.cv, design: s.design }),
    },
  ),
);
