import type { AiCv } from "./cv-schema";

/**
 * Agar GEMINI_API_KEY ulanmagan yoki vaqtinchalik cheklov bo'lsa,
 * erkin matnni deterministik tarzda tahlil qilib structured CV qaytaradi.
 */
export function parseCvLocally(rawText: string, language: string): AiCv {
  const text = rawText.trim();
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // 1) Email & Phone & Links
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const email = emailMatch ? emailMatch[0] : "";

  const phoneMatch = text.match(/(\+?\d[\d\s\-()]{7,18}\d)/);
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  const urlRegex = /(https?:\/\/[^\s,;]+|(?:www\.|linkedin\.com\/in\/|github\.com\/|t\.me\/)[^\s,;]+)/gi;
  const rawUrls = [...new Set(text.match(urlRegex) || [])];
  const links = rawUrls.map((u) => {
    const clean = u.replace(/[.)]+$/, "");
    const url = clean.startsWith("http") ? clean : `https://${clean}`;
    const lower = clean.toLowerCase();
    const label = lower.includes("linkedin")
      ? "LinkedIn"
      : lower.includes("github")
        ? "GitHub"
        : lower.includes("t.me") || lower.includes("telegram")
          ? "Telegram"
          : "Portfolio";
    return { label, url };
  });

  // 2) Full Name
  let fullName = "";
  const namePatterns = [
    /(?:ismim|mening ismim|men)\s+([A-ZА-ЯЁO'G'a-zа-яёo'g'ʻ’]+\s+[A-ZА-ЯЁO'G'a-zа-яёo'g'ʻ’]+)/i,
    /(?:my name is|i am|i'm)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
    /(?:меня зовут|я)\s+([А-ЯЁ][а-яё]+\s+[А-ЯЁ][а-яё]+)/i,
  ];
  for (const rx of namePatterns) {
    const m = text.match(rx);
    if (m?.[1]) {
      fullName = m[1].replace(/[,.].*$/, "").trim();
      break;
    }
  }
  if (!fullName && lines[0]) {
    const firstWords = lines[0].replace(/[,.;:].*$/, "").trim().split(/\s+/);
    if (firstWords.length >= 2 && firstWords.length <= 4) {
      fullName = firstWords.slice(0, 2).join(" ");
    } else {
      fullName = "Foydalanuvchi";
    }
  }

  // 3) Location
  let location = "";
  const locMatch =
    text.match(/(Toshkent|Samarqand|Buxoro|Andijon|Farg'ona|Namangan|Xorazm|Qarshi|Nukus|Navoiy|Jizzax|Termiz|Guliston|New York|London|Moscow|Tashkent|Uzbekistan|O'zbekiston)/i);
  if (locMatch) {
    location = locMatch[1];
  }

  // 4) Title / Role
  let title = "Mutaxassis";
  const roleMatch = text.match(
    /((?:Senior|Junior|Middle|Lead|Full[- ]?Stack|Frontend|Backend|Mobile|UI\/UX|Grafik|Graphic|Software|Web|Data|Product|Project|QA|DevOps)?\s*(?:Developer|Dasturchi|Engineer|Muhandis|Designer|Dizayner|Manager|Menejer|Director|Analitik|Analyst|Marketolog|Hisobchi|O'qituvchi))/i,
  );
  if (roleMatch?.[1]?.trim()) {
    title = roleMatch[1].trim();
  }

  // 5) Skills
  const skills: { name: string; level: number }[] = [];
  const skillSectionMatch = text.match(/(?:ko'nikmalar\w*|skills|навыки|texnologiyalar)\s*[:\-–]\s*([^\n.]+(?:\.[^\n.]+)?)/i);
  if (skillSectionMatch?.[1]) {
    const items = skillSectionMatch[1]
      .split(/[,;•·]/)
      .map((s) => s.replace(/\.$/, "").trim())
      .filter((s) => s.length >= 2 && s.length <= 35);
    for (const item of items.slice(0, 10)) {
      skills.push({ name: item, level: 85 });
    }
  }
  if (!skills.length) {
    const commonTech = [
      "React", "Next.js", "TypeScript", "JavaScript", "Python", "Node.js",
      "Tailwind CSS", "HTML/CSS", "Git", "SQL", "PostgreSQL", "Docker", "Figma", "Photoshop",
    ];
    for (const tech of commonTech) {
      if (new RegExp(`\\b${tech.replace(".", "\\.")}\\b`, "i").test(text)) {
        skills.push({ name: tech, level: 85 });
      }
    }
  }
  if (!skills.length) {
    skills.push(
      { name: "Muammolarni hal qilish", level: 90 },
      { name: "Jamoa bilan ishlash", level: 85 },
      { name: "Loyiha boshqaruvi", level: 80 },
    );
  }

  // 6) Languages
  const languages: { name: string; level: number }[] = [];
  const langDefs = [
    { rx: /o'zbek|uzbek|узбек/i, name: language === "en" ? "Uzbek" : language === "ru" ? "Узбекский" : "O'zbek tili", level: 100 },
    { rx: /rus\b|russian|русск/i, name: language === "en" ? "Russian" : language === "ru" ? "Русский" : "Rus tili", level: 85 },
    { rx: /ingliz|english|английск/i, name: language === "en" ? "English" : language === "ru" ? "Английский" : "Ingliz tili", level: 75 },
    { rx: /turk|turkish|турецк/i, name: language === "en" ? "Turkish" : language === "ru" ? "Турецкий" : "Turk tili", level: 70 },
  ];
  for (const ld of langDefs) {
    if (ld.rx.test(text)) {
      languages.push({ name: ld.name, level: ld.level });
    }
  }
  if (!languages.length) {
    languages.push({ name: "O'zbek tili", level: 100 }, { name: "Ingliz tili", level: 75 });
  }

  // 7) Hobbies
  const hobbies: string[] = [];
  const hobbyMatch = text.match(/(?:qiziqishlar\w*|xobbi\w*|hobbies|интересы|хобби)\s*[:\-–]\s*([^\n.]+)/i);
  if (hobbyMatch?.[1]) {
    hobbyMatch[1]
      .split(/[,;•]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((h) => hobbies.push(h.charAt(0).toUpperCase() + h.slice(1)));
  }

  // 8) Experience & Education
  const experience: AiCv["experience"] = [];
  const education: AiCv["education"] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const isEdu =
      /universitet|institut|kollej|litsey|maktab|university|college|bachelor|master|tatu|inxa|inha|wiut|bitirgan|o'qigan/i.test(
        lower,
      );
    const isExp =
      /ishla|kompaniya|company|developer|dasturchi|dizayner|manager|loyiha|tajriba|experience|worked/i.test(lower);

    const years = line.match(/\b(19\d\d|20\d\d)\b/g) || [];
    if (isEdu) {
      const sentences = line
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      education.push({
        institution: sentences[0]?.slice(0, 60) || "Oliy ta'lim muassasasi",
        location: location || "Toshkent",
        year: years[years.length - 1] || "2022",
        degree: sentences[1]?.slice(0, 70) || "Bakalavr darajasi",
        bullets: sentences.slice(1).length ? sentences.slice(1) : [line],
      });
    } else if (isExp && line.length > 20) {
      const sentences = line
        .split(/[.!?;]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const start = years[0] || "2021";
      const end = /hozir|present|current|shu kungacha/i.test(line)
        ? language === "en"
          ? "Present"
          : language === "ru"
            ? "Настоящее время"
            : "Hozirgacha"
        : years[1] || "Hozirgacha";

      const compMatch = line.match(/([A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9\s&.-]{1,25}?)\s+(?:kompaniya|da\b|systems|group|team|llc|inc)/i);
      const company = compMatch?.[1]?.trim() || "Kompaniya";

      experience.push({
        company,
        location: location || "Toshkent",
        start,
        end,
        role: title,
        bullets: sentences.length ? sentences : [line],
      });
    }
  }

  if (!experience.length) {
    experience.push({
      company: "Asosiy faoliyat",
      location: location || "Toshkent",
      start: "2022",
      end: "Hozirgacha",
      role: title,
      bullets: lines.slice(0, 3).map((l) => l.slice(0, 140)),
    });
  }

  const summary =
    language === "en"
      ? `Results-driven ${title} based in ${location || "Uzbekistan"} with strong expertise in ${skills
          .slice(0, 4)
          .map((s) => s.name)
          .join(", ")}. Proven track record of delivering high-quality solutions and collaborating effectively in dynamic teams.`
      : language === "ru"
        ? `Опытный специалист (${title}) со знанием ${skills
            .slice(0, 4)
            .map((s) => s.name)
            .join(", ")}. Ориентирован на результат, высокое качество работы и эффективное решение задач.`
        : `O'z ishining ustasi bo'lgan ${title}. ${skills
            .slice(0, 4)
            .map((s) => s.name)
            .join(", ")} yo'nalishlarida chuqur bilim va amaliy tajribaga ega. Zamonaviy yechimlar yaratish, sifat va samaradorlikni oshirish hamda jamoada ishlash bo'yicha yuqori ko'nikmalarga ega.`;

  return {
    personal: {
      fullName,
      title,
      email,
      phone,
      location,
      summary,
    },
    links,
    experience,
    education,
    skills,
    languages,
    references: [],
    hobbies,
  };
}

export function improveLocally(kind: "summary" | "bullets", items: string[]): string[] {
  if (kind === "summary") {
    const s = items.join(" ").trim();
    return [
      s.endsWith(".")
        ? `${s} Yuqori mas'uliyat, zamonaviy texnologiyalar bilan ishlash va natijaga yo'naltirilgan yondashuvga ega.`
        : `${s}. Yuqori mas'uliyat, zamonaviy texnologiyalar bilan ishlash va natijaga yo'naltirilgan yondashuvga ega.`,
    ];
  }
  return items
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      const cap = b.charAt(0).toUpperCase() + b.slice(1);
      return cap.endsWith(".") ? cap : `${cap}.`;
    });
}
