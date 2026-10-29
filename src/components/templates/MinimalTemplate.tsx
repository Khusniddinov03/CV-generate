import { A4, Bullets, dateRange, has, nonEmpty, Show, type TemplateProps } from "./shared";

/** Bir ustunli, ATS tizimlari uchun eng qulay template */
export function MinimalTemplate({ cv, accent }: TemplateProps) {
  const p = cv.personal;
  const links = nonEmpty(cv.links, (l) => l.url);
  const refs = nonEmpty(cv.references, (r) => r.name);
  const hobbies = cv.hobbies.filter(has);
  const exp = nonEmpty(cv.experience, (e) => e.company + e.role);
  const edu = nonEmpty(cv.education, (e) => e.institution + e.degree);
  const skills = nonEmpty(cv.skills, (s) => s.name);
  const langs = nonEmpty(cv.languages, (s) => s.name);
  const contacts = [p.email, p.phone, p.location, ...links.map((l) => l.url)].filter(has);

  const levelWord = (n: number) =>
    n >= 95 ? "Native" : n >= 80 ? "Fluent" : n >= 60 ? "Advanced" : n >= 40 ? "Intermediate" : "Basic";

  return (
    <div
      className="cv-root cv-minimal"
      style={{ width: A4.width, minHeight: A4.height, background: "#fff", ["--accent" as string]: accent }}
    >
      <header className="mn-header">
        <h1 className="mn-name" style={{ color: accent }}>
          {p.fullName}
        </h1>
        {has(p.title) && <div className="mn-title">{p.title}</div>}
        <div className="mn-contacts">{contacts.join("  •  ")}</div>
      </header>

      <Show when={has(p.summary)}>
        <section className="mn-sec">
          <h2 style={{ color: accent }}>Summary</h2>
          <p>{p.summary}</p>
        </section>
      </Show>

      <Show when={exp.length > 0}>
        <section className="mn-sec">
          <h2 style={{ color: accent }}>Experience</h2>
          {exp.map((e) => (
            <div key={e.id} className="mn-item">
              <div className="mn-row">
                <b>
                  {e.role}
                  {has(e.company) && `, ${e.company}`}
                </b>
                <span>{dateRange(e.start, e.end)}</span>
              </div>
              {has(e.location) && <div className="mn-sub">{e.location}</div>}
              <Bullets items={e.bullets} className="mn-bullets" />
            </div>
          ))}
        </section>
      </Show>

      <Show when={edu.length > 0}>
        <section className="mn-sec">
          <h2 style={{ color: accent }}>Education</h2>
          {edu.map((e) => (
            <div key={e.id} className="mn-item">
              <div className="mn-row">
                <b>
                  {e.degree}
                  {has(e.institution) && `, ${e.institution}`}
                </b>
                <span>{e.year}</span>
              </div>
              {has(e.location) && <div className="mn-sub">{e.location}</div>}
              <Bullets items={e.bullets} className="mn-bullets" />
            </div>
          ))}
        </section>
      </Show>

      <Show when={skills.length > 0}>
        <section className="mn-sec">
          <h2 style={{ color: accent }}>Skills</h2>
          <p>{skills.map((s) => s.name).join(" · ")}</p>
        </section>
      </Show>

      <Show when={langs.length > 0}>
        <section className="mn-sec">
          <h2 style={{ color: accent }}>Languages</h2>
          <p>{langs.map((s) => `${s.name} (${levelWord(s.level)})`).join(" · ")}</p>
        </section>
      </Show>

      <Show when={hobbies.length > 0}>
        <section className="mn-sec">
          <h2 style={{ color: accent }}>Interests</h2>
          <p>{hobbies.join(" · ")}</p>
        </section>
      </Show>

      <Show when={refs.length > 0}>
        <section className="mn-sec">
          <h2 style={{ color: accent }}>References</h2>
          {refs.map((r) => (
            <p key={r.id}>
              <b>{r.name}</b>
              {[r.company, r.phone, r.email].filter(has).map((x) => ` — ${x}`)}
            </p>
          ))}
        </section>
      </Show>
    </div>
  );
}
