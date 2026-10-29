import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  AI uchun schema (id va rasm yo'q — ular klient tomonda qo'shiladi) */
/* ------------------------------------------------------------------ */

export const aiCvSchema = z.object({
  personal: z.object({
    fullName: z.string().describe("Full name of the person"),
    title: z.string().describe("Professional title / job position, e.g. 'Creative Director'"),
    email: z.string().describe("Email address or empty string"),
    phone: z.string().describe("Phone number or empty string"),
    location: z.string().describe("City, country or empty string"),
    summary: z
      .string()
      .describe("Professional 'About me' summary, 3-5 sentences, polished and impactful"),
  }),
  links: z
    .array(z.object({ label: z.string(), url: z.string() }))
    .describe("Online profiles: LinkedIn, GitHub, Telegram, portfolio, etc."),
  experience: z.array(
    z.object({
      company: z.string(),
      location: z.string(),
      start: z.string().describe("Start date, e.g. 'Jan 2020'"),
      end: z.string().describe("End date or 'Present'"),
      role: z.string(),
      bullets: z
        .array(z.string())
        .describe("3-5 achievement-oriented bullet points starting with strong action verbs"),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      location: z.string(),
      year: z.string(),
      degree: z.string(),
      bullets: z.array(z.string()).describe("1-3 short highlights"),
    }),
  ),
  skills: z
    .array(z.object({ name: z.string(), level: z.number().describe("0-100 proficiency") }))
    .describe("4-10 key skills"),
  languages: z.array(
    z.object({ name: z.string(), level: z.number().describe("0-100 proficiency") }),
  ),
  references: z.array(
    z.object({
      name: z.string(),
      company: z.string(),
      phone: z.string(),
      email: z.string(),
    }),
  ),
  hobbies: z.array(z.string()),
});

export type AiCv = z.infer<typeof aiCvSchema>;

/* ------------------------------------------------------------------ */
/*  Ilova ichidagi to'liq CV turi                                       */
/* ------------------------------------------------------------------ */

export type WithId<T> = T & { id: string };

export type Personal = AiCv["personal"] & { photo: string };
export type LinkItem = WithId<AiCv["links"][number]>;
export type ExperienceItem = WithId<AiCv["experience"][number]>;
export type EducationItem = WithId<AiCv["education"][number]>;
export type LevelItem = WithId<AiCv["skills"][number]>;
export type ReferenceItem = WithId<AiCv["references"][number]>;

export interface CV {
  personal: Personal;
  links: LinkItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: LevelItem[];
  languages: LevelItem[];
  references: ReferenceItem[];
  hobbies: string[];
}

export type ListSection =
  | "links"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "references";

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

/** AI natijasini ilova CV formatiga o'tkazadi (id qo'shadi, rasmni saqlaydi) */
export function fromAi(ai: AiCv, photo = ""): CV {
  return {
    personal: { ...ai.personal, photo },
    links: ai.links.map((x) => ({ ...x, id: uid() })),
    experience: ai.experience.map((x) => ({ ...x, id: uid() })),
    education: ai.education.map((x) => ({ ...x, id: uid() })),
    skills: ai.skills.map((x) => ({ ...x, level: clamp(x.level), id: uid() })),
    languages: ai.languages.map((x) => ({ ...x, level: clamp(x.level), id: uid() })),
    references: ai.references.map((x) => ({ ...x, id: uid() })),
    hobbies: ai.hobbies,
  };
}

/** Ilova CV'sini AI formatiga o'tkazadi (rasm va id'larni olib tashlaydi) */
export function toAi(cv: CV): AiCv {
  const strip = <T extends { id: string }>(arr: T[]) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    arr.map(({ id: _id, ...rest }) => rest);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { photo: _photo, ...personal } = cv.personal;
  return {
    personal,
    links: strip(cv.links),
    experience: strip(cv.experience),
    education: strip(cv.education),
    skills: strip(cv.skills),
    languages: strip(cv.languages),
    references: strip(cv.references),
    hobbies: cv.hobbies,
  };
}

export const emptyItem: { [K in ListSection]: () => CV[K][number] } = {
  links: () => ({ id: uid(), label: "", url: "" }),
  experience: () => ({
    id: uid(),
    company: "",
    location: "",
    start: "",
    end: "",
    role: "",
    bullets: [""],
  }),
  education: () => ({ id: uid(), institution: "", location: "", year: "", degree: "", bullets: [""] }),
  skills: () => ({ id: uid(), name: "", level: 70 }),
  languages: () => ({ id: uid(), name: "", level: 70 }),
  references: () => ({ id: uid(), name: "", company: "", phone: "", email: "" }),
};

export const emptyCV = (): CV => ({
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    photo: "",
  },
  links: [],
  experience: [],
  education: [],
  skills: [],
  languages: [],
  references: [],
  hobbies: [],
});

/** Template'dagi namunaviy ma'lumot */
export const sampleCV = (): CV =>
  fromAi({
    personal: {
      fullName: "Don Draper",
      title: "Creative Director",
      email: "don.draper@example.com",
      phone: "+1-202-555-0173",
      location: "New York, USA",
      summary:
        "Highly creative and multi-talented Graphic Designer with extensive experience in multimedia, marketing, and print design. Exceptional collaborative and interpersonal skills; dynamic team player with well-developed written and verbal communication abilities.",
    },
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/don-draper" },
      { label: "Twitter", url: "https://twitter.com/don_draper" },
    ],
    experience: [
      {
        company: "Sterling Cooper & Partners",
        location: "New York",
        start: "Jan 2012",
        end: "Dec 2015",
        role: "Creative Director",
        bullets: [
          "Led creative team to design award-winning campaigns",
          "Managed client relationships and pitched new business",
          "Oversaw all creative output from the agency",
          "Mentored junior staff and fostered their professional development",
        ],
      },
      {
        company: "Sterling Cooper",
        location: "New York",
        start: "Jan 2000",
        end: "Dec 2011",
        role: "Senior Designer",
        bullets: [
          "Designed and executed advertising campaigns for clients",
          "Collaborated with copywriters to develop creative concepts",
          "Presented creative work to clients",
          "Assisted in new business pitches",
        ],
      },
    ],
    education: [
      {
        institution: "City College of New York",
        location: "New York",
        year: "1999",
        degree: "Bachelor's in Graphic Design",
        bullets: [
          "Focused on modern design principles",
          "Developed a strong foundation in typography and layout design",
        ],
      },
      {
        institution: "Brooklyn College",
        location: "Brooklyn",
        year: "1997",
        degree: "Associate's in Fine Arts",
        bullets: [
          "Studied various art and design techniques",
          "Gained a strong understanding of color theory and composition",
        ],
      },
    ],
    skills: [
      { name: "Adobe Creative Suite", level: 85 },
      { name: "Typography", level: 85 },
      { name: "Layout Design", level: 85 },
      { name: "Creative Concepting", level: 85 },
      { name: "Client Relations", level: 85 },
      { name: "Team Leadership", level: 85 },
    ],
    languages: [
      { name: "English", level: 85 },
      { name: "French", level: 40 },
      { name: "Spanish", level: 85 },
    ],
    references: [
      {
        name: "Roger Sterling",
        company: "Sterling Cooper & Partners",
        phone: "+1-202-555-0184",
        email: "roger.sterling@example.com",
      },
    ],
    hobbies: ["Sketching", "Photography", "Reading", "Traveling", "Cinema"],
  });
