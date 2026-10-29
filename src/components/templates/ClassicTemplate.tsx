import { Mail, MapPin, Phone } from "lucide-react";
import {
  A4,
  Avatar,
  Bullets,
  dateRange,
  has,
  LevelBars,
  nonEmpty,
  Show,
  splitName,
  type TemplateProps,
} from "./shared";

const SIDEBAR = 258;

/** Foydalanuvchi template'ining aniq nusxasi: chapda to'q sidebar + timeline */
export function ClassicTemplate({ cv, accent }: TemplateProps) {
  const p = cv.personal;
  const [first, last] = splitName(p.fullName);
  const links = nonEmpty(cv.links, (l) => l.url);
  const refs = nonEmpty(cv.references, (r) => r.name);
  const hobbies = cv.hobbies.filter(has);
  const exp = nonEmpty(cv.experience, (e) => e.company + e.role);
  const edu = nonEmpty(cv.education, (e) => e.institution + e.degree);

  const contacts = [
    { icon: MapPin, value: p.location },
    { icon: Phone, value: p.phone },
    { icon: Mail, value: p.email },
  ].filter((c) => has(c.value));

  return (
    <div
      className="cv-root cv-classic"
      style={{
        width: A4.width,
        minHeight: A4.height,
        display: "flex",
        background: `linear-gradient(to right, ${accent} ${SIDEBAR}px, #fff ${SIDEBAR}px)`,
        ["--accent" as string]: accent,
      }}
    >
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="cl-side" style={{ width: SIDEBAR, background: accent }}>
        <Show when={has(p.photo)}>
          <div className="cl-photo">
            <Avatar src={p.photo} size={150} />
          </div>
        </Show>

        <Show when={has(p.summary)}>
          <section className="cl-side-sec">
            <h3>About me</h3>
            <p className="cl-about">{p.summary}</p>
          </section>
        </Show>

        <Show when={links.length > 0}>
          <section className="cl-side-sec">
            <h3>Links</h3>
            {links.map((l) => (
              <div key={l.id} className="cl-link">
                <div className="cl-link-label">{l.label || "Link"}:</div>
                <a href={l.url}>{l.url}</a>
              </div>
            ))}
          </section>
        </Show>

        <Show when={refs.length > 0}>
          <section className="cl-side-sec">
            <h3>Reference</h3>
            {refs.map((r) => (
              <div key={r.id} className="cl-ref">
                <div className="cl-ref-name">{r.name}</div>
                {has(r.company) && <div>{r.company}</div>}
                {has(r.phone) && (
                  <div>
                    <b>T:</b> {r.phone}
                  </div>
                )}
                {has(r.email) && (
                  <div>
                    <b>E:</b> {r.email}
                  </div>
                )}
              </div>
            ))}
          </section>
        </Show>

        <Show when={hobbies.length > 0}>
          <section className="cl-side-sec">
            <h3>Hobbies</h3>
            <ul className="cl-hobbies">
              {hobbies.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        </Show>
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <main className="cl-main">
        <header className="cl-header">
          <div>
            <h1 className="cl-name" style={{ color: accent }}>
              {first}
              {last && <br />}
              {last}
            </h1>
            {has(p.title) && <div className="cl-title">{p.title}</div>}
          </div>
          <Show when={contacts.length > 0}>
            <div className="cl-contacts">
              {contacts.map(({ icon: Icon, value }, i) => (
                <div key={i} className="cl-contact">
                  <span className="cl-ico" style={{ background: accent }}>
                    <Icon size={11} color="#fff" strokeWidth={2.5} />
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </Show>
        </header>

        <Show when={exp.length > 0}>
          <section className="cl-sec">
            <h2>Work Experience</h2>
            {exp.map((e) => (
              <div key={e.id} className="cl-item">
                <div className="cl-item-left">
                  <div className="cl-org">{e.company}</div>
                  {has(e.location) && <div>{e.location}</div>}
                  <div>{dateRange(e.start, e.end)}</div>
                </div>
                <div className="cl-item-right" style={{ borderColor: accent }}>
                  <span className="cl-dot" style={{ background: accent }} />
                  <div className="cl-role">{e.role}</div>
                  <Bullets items={e.bullets} className="cl-bullets" />
                </div>
              </div>
            ))}
          </section>
        </Show>

        <Show when={edu.length > 0}>
          <section className="cl-sec">
            <h2>Education</h2>
            {edu.map((e) => (
              <div key={e.id} className="cl-item">
                <div className="cl-item-left">
                  <div className="cl-org">{e.institution}</div>
                  {has(e.location) && <div>{e.location}</div>}
                  <div>{e.year}</div>
                </div>
                <div className="cl-item-right" style={{ borderColor: accent }}>
                  <span className="cl-dot" style={{ background: accent }} />
                  <div className="cl-role">{e.degree}</div>
                  <Bullets items={e.bullets} className="cl-bullets" />
                </div>
              </div>
            ))}
          </section>
        </Show>

        <Show when={nonEmpty(cv.skills, (s) => s.name).length > 0}>
          <section className="cl-sec">
            <h2>Skills</h2>
            <LevelBars items={cv.skills} barColor={accent} labelClass="cl-bar-label" />
          </section>
        </Show>

        <Show when={nonEmpty(cv.languages, (s) => s.name).length > 0}>
          <section className="cl-sec">
            <h2>Languages</h2>
            <LevelBars items={cv.languages} barColor={accent} labelClass="cl-bar-label" />
          </section>
        </Show>
      </main>
    </div>
  );
}
