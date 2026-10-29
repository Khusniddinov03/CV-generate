import { Globe, Mail, MapPin, Phone } from "lucide-react";
import {
  A4,
  Avatar,
  Bullets,
  dateRange,
  has,
  LevelBars,
  nonEmpty,
  Show,
  type TemplateProps,
} from "./shared";

/** Zamonaviy: rangli sarlavha + o'ngda yon ustun */
export function ModernTemplate({ cv, accent }: TemplateProps) {
  const p = cv.personal;
  const links = nonEmpty(cv.links, (l) => l.url);
  const refs = nonEmpty(cv.references, (r) => r.name);
  const hobbies = cv.hobbies.filter(has);
  const exp = nonEmpty(cv.experience, (e) => e.company + e.role);
  const edu = nonEmpty(cv.education, (e) => e.institution + e.degree);
  const contacts = [
    { icon: Mail, value: p.email },
    { icon: Phone, value: p.phone },
    { icon: MapPin, value: p.location },
  ].filter((c) => has(c.value));

  return (
    <div
      className="cv-root cv-modern"
      style={{ width: A4.width, minHeight: A4.height, background: "#fff", ["--accent" as string]: accent }}
    >
      <header className="md-header" style={{ background: accent }}>
        <Avatar src={p.photo} size={112} ring="rgba(255,255,255,.35)" />
        <div style={{ flex: 1 }}>
          <h1 className="md-name">{p.fullName}</h1>
          {has(p.title) && <div className="md-title">{p.title}</div>}
          <div className="md-contacts">
            {contacts.map(({ icon: Icon, value }, i) => (
              <span key={i}>
                <Icon size={12} /> {value}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="md-body">
        <main className="md-main">
          <Show when={has(p.summary)}>
            <section className="md-sec">
              <h2>Profile</h2>
              <p className="md-text">{p.summary}</p>
            </section>
          </Show>

          <Show when={exp.length > 0}>
            <section className="md-sec">
              <h2>Experience</h2>
              {exp.map((e) => (
                <div key={e.id} className="md-item">
                  <div className="md-item-head">
                    <div>
                      <div className="md-role">{e.role}</div>
                      <div className="md-org">
                        {e.company}
                        {has(e.location) && ` · ${e.location}`}
                      </div>
                    </div>
                    <div className="md-date">{dateRange(e.start, e.end)}</div>
                  </div>
                  <Bullets items={e.bullets} className="md-bullets" />
                </div>
              ))}
            </section>
          </Show>

          <Show when={edu.length > 0}>
            <section className="md-sec">
              <h2>Education</h2>
              {edu.map((e) => (
                <div key={e.id} className="md-item">
                  <div className="md-item-head">
                    <div>
                      <div className="md-role">{e.degree}</div>
                      <div className="md-org">
                        {e.institution}
                        {has(e.location) && ` · ${e.location}`}
                      </div>
                    </div>
                    <div className="md-date">{e.year}</div>
                  </div>
                  <Bullets items={e.bullets} className="md-bullets" />
                </div>
              ))}
            </section>
          </Show>
        </main>

        <aside className="md-side">
          <Show when={nonEmpty(cv.skills, (s) => s.name).length > 0}>
            <section className="md-sec">
              <h2>Skills</h2>
              <LevelBars items={cv.skills} barColor={accent} columns={1} labelClass="md-bar-label" />
            </section>
          </Show>
          <Show when={nonEmpty(cv.languages, (s) => s.name).length > 0}>
            <section className="md-sec">
              <h2>Languages</h2>
              <LevelBars items={cv.languages} barColor={accent} columns={1} labelClass="md-bar-label" />
            </section>
          </Show>
          <Show when={links.length > 0}>
            <section className="md-sec">
              <h2>Links</h2>
              {links.map((l) => (
                <div key={l.id} className="md-link">
                  <Globe size={11} style={{ color: accent, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <b>{l.label}</b>
                    <div className="md-url">{l.url}</div>
                  </div>
                </div>
              ))}
            </section>
          </Show>
          <Show when={hobbies.length > 0}>
            <section className="md-sec">
              <h2>Hobbies</h2>
              <div className="md-tags">
                {hobbies.map((h, i) => (
                  <span key={i} style={{ borderColor: accent, color: accent }}>
                    {h}
                  </span>
                ))}
              </div>
            </section>
          </Show>
          <Show when={refs.length > 0}>
            <section className="md-sec">
              <h2>References</h2>
              {refs.map((r) => (
                <div key={r.id} className="md-ref">
                  <b>{r.name}</b>
                  {has(r.company) && <div>{r.company}</div>}
                  {has(r.phone) && <div>{r.phone}</div>}
                  {has(r.email) && <div>{r.email}</div>}
                </div>
              ))}
            </section>
          </Show>
        </aside>
      </div>
    </div>
  );
}
