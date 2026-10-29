import type { CV } from "@/lib/cv-schema";
import type { Design } from "@/lib/design";
import { ClassicTemplate } from "./ClassicTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ModernTemplate } from "./ModernTemplate";

export function CVDocument({ cv, design }: { cv: CV; design: Design }) {
  switch (design.template) {
    case "modern":
      return <ModernTemplate cv={cv} accent={design.accent} />;
    case "minimal":
      return <MinimalTemplate cv={cv} accent={design.accent} />;
    default:
      return <ClassicTemplate cv={cv} accent={design.accent} />;
  }
}
