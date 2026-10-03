import { useEffect, useRef, useState } from "react";
import type { Act } from "../../data/acts";
import { profile, about, perspective, skillGroups, tools, languages, projects, certificates, testingCapabilities, testingDemos, aiInterests, achievements, journey, contact, type Certificate } from "../../data/profile";
import { MagneticName } from "./MagneticName";
import { useApp } from "../../hooks/useApp";
import { ActTree, type TreeNode } from "./ActTree";

/* ------------------------------------------------------------------------ */
/*  Shell                                                                   */
/* ------------------------------------------------------------------------ */

export function ActView({ act }: { act: Act }) {
  const id = act.id;
  return (
    <section
      id={id}
      data-scene={act.id}
      className={`act act--${act.zone}`}
      aria-hidden="true"
    >
      <div className="act-in">{renderAct(act)}</div>
    </section>
  );
}

function renderAct(act: Act) {
  switch (act.id) {
    case "about":
      return <AboutAct />;
    case "craft":
      return <CraftAct />;
    case "work":
      return <WorkAct />;
    case "proof":
      return <ProofAct />;
    case "explore":
      return <ExploreAct />;
    case "reach":
      return <ReachAct />;
    default:
      return <IntroAct />;
  }
}

/* ------------------------------------------------------------------------ */
/*  Prologue                                                                */
/* ------------------------------------------------------------------------ */

function HeroRotator({ items }: { items: { name: string; tagline: string }[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".film-hero");
    let id = 0;
    const tick = () => setIndex((i) => (i + 1) % items.length);
    const start = () => {
      if (!id) id = window.setInterval(tick, 2600);
    };
    const stop = () => {
      if (id) {
        window.clearInterval(id);
        id = 0;
      }
    };
    start();
    if (!el) return () => stop();
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [items.length]);
  const item = items[index];
  return (
    <>
      <p key={`role-${index}`} className="film-roles">
        {item.name}
      </p>
      <p key={`intro-${index}`} className="film-intro">
        {item.tagline}
      </p>
    </>
  );
}

export function IntroAct() {
  return (
    <div className="act-inner act-inner--intro">
      <MagneticName name="TAUSEEF KHAN" className="film-title" ariaLabel={profile.name} />
      <HeroRotator items={profile.heroRoles} />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  About                                                                   */
/* ------------------------------------------------------------------------ */

function AboutAct() {
  return (
    <div className="act-inner">
      <h2 className="act-title">About</h2>
      <p className="act-body">{perspective.body}</p>
      <ul className="interest-cloud">
        {about.interests.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
      <div className="journey-wrap">
        <p className="act-sub">How I got here</p>
        <ol className="journey-mini" aria-label="Learning journey">
          {journey.map((j, i) => (
            <li key={j.stage}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <b>{j.stage}</b>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Craft                                                                   */
/* ------------------------------------------------------------------------ */

function CraftAct() {
  const leafCount =
    skillGroups.reduce((n, g) => n + g.skills.length, 0) + languages.length + tools.length;
  const nodes: TreeNode[] = [
    {
      id: "skills",
      label: "Skill Groups",
      meta: `${skillGroups.length} clusters`,
      children: skillGroups.map((g) => ({
        id: g.id,
        label: g.label,
        accent: g.accent,
        meta: `${g.skills.length} skills`,
        children: g.skills.map((s) => ({ id: `${g.id}-${s.name}`, label: s.name, detail: s.note })),
      })),
    },
    {
      id: "languages",
      label: "Languages & Frameworks",
      meta: `${languages.length} entries`,
      children: languages.map((l) => ({
        id: l.name,
        label: l.name,
        accent: l.accent,
        detail: l.note,
        tags: l.usage,
      })),
    },
    {
      id: "tools",
      label: "Tools & Platforms",
      meta: `${tools.length} entries`,
      children: tools.map((t) => ({ id: t, label: t })),
    },
  ];
  return (
    <div className="act-inner act-inner--wide">
      <ActTree
        title="What I build with"
        count={`${skillGroups.length} groups · ${leafCount} leaves`}
        detail="The full stack behind everything on this page — languages, frameworks, tools and platforms, listed end to end."
        nodes={nodes}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Work — every repo, fully visible                                        */
/* ------------------------------------------------------------------------ */

function WorkAct() {
  const statusOrder = ["Live", "Open Source", "Published", "In Development"];
  const nodes: TreeNode[] = statusOrder
    .map((status) => {
      const list = projects.filter((p) => p.status === status);
      if (!list.length) return null;
      return {
        id: `status-${status}`,
        label: status,
        meta: `${list.length} project${list.length > 1 ? "s" : ""}`,
        children: list.map((p) => ({
          id: p.id,
          label: p.name,
          accent: p.accent,
          meta: p.status,
          detail: p.tagline,
          note: p.contribution,
          tags: p.technologies,
          links: [
            ...(p.demo
              ? [{ label: "Live demo", href: p.demo, kind: "primary" as const }]
              : []),
            ...(p.github
              ? [{ label: "Repository", href: p.github, kind: "ghost" as const }]
              : []),
          ],
        })),
      } as TreeNode;
    })
    .filter((n): n is TreeNode => n !== null);
  return (
    <div className="act-inner act-inner--wide">
      <ActTree
        title="Everything I've shipped"
        count={`${projects.length} projects`}
        detail={`All ${projects.length} projects, listed one by one — repository or live demo on every row. None hidden, none behind a click.`}
        nodes={nodes}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Proof — all certificates, fully visible                                 */
/* ------------------------------------------------------------------------ */

function ProofAct() {
  const toLeaf = (c: Certificate): TreeNode => ({
    id: c.id,
    label: c.title,
    accent: c.accent,
    meta: c.issuer,
    detail: c.date,
    tags: c.skills,
    links: [
      { label: "Certificate", href: c.file, kind: "primary" as const },
      ...(c.verify ? [{ label: "Verify badge", href: c.verify }] : []),
    ],
  });
  const includes = (c: Certificate, re: RegExp) => re.test(`${c.issuer} ${c.title}`);
  const simulations = certificates.filter((c) => c.issuer.includes("Deloitte"));
  const hackathons = certificates.filter((c) => includes(c, /hackathon|training/i));
  const learning = certificates.filter(
    (c) => !c.issuer.includes("Deloitte") && !includes(c, /hackathon|training/i)
  );
  const nodes: TreeNode[] = [
    {
      id: "simulations",
      label: "Work Simulations",
      meta: `${simulations.length} certificates`,
      children: simulations.map(toLeaf),
    },
    {
      id: "hackathons",
      label: "Hackathons & Training",
      meta: `${hackathons.length} certificates`,
      children: hackathons.map(toLeaf),
    },
    {
      id: "learning",
      label: "Learning & Courses",
      meta: `${learning.length} certificates`,
      children: learning.map(toLeaf),
    },
  ];
  return (
    <div className="act-inner act-inner--wide">
      <ActTree
        title={achievements[2].title}
        count={`${certificates.length} certificates`}
        detail={achievements[2].hint}
        nodes={nodes}
      />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Experiments (AI + testing)                                              */
/* ------------------------------------------------------------------------ */

function ExploreAct() {
  return (
    <div className="act-inner">
      <h2 className="act-title">AI &amp; testing playground</h2>
      <p className="act-body">Curiosity, unterminated — I experiment constantly with AI tools and evaluate interfaces the way a tester would.</p>

      <h3 className="act-sub">AI interests</h3>
      <ul className="tag-cloud">
        {aiInterests.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h3 className="act-sub">Testing capabilities</h3>
      <ul className="tag-cloud">
        {testingCapabilities.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h3 className="act-sub">Bugs recently found</h3>
      <ul className="bug-list">
        {testingDemos.map((b) => (
          <li key={b.id}>
            <b>{b.label}</b>
            <span>{b.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/*  Reach — outside the animated frame, at the very end                     */
/* ------------------------------------------------------------------------ */

function ReachAct() {
  return <ContactSection />;
}

export function ContactSection() {
  const { scrollTo } = useApp();
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="reach" ref={secRef} className="contact">
      <div className="contact-in">
        <MagneticName name="TAUSEEF KHAN" className="film-title contact-name" ariaLabel={profile.name} />
        <p className="act-sub">Reach</p>
        <h2 className="contact-title">{contact.heading}</h2>
        <p className="contact-summary">
          {profile.heroIntro} Everything on this page — the products, the design, the tests, the AI
          experiments — is hand-built and driven by curiosity.
        </p>
        <ul className="contact-roles" aria-label="What Tauseef does">
          {profile.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <div className="reach-actions">
          <a href={`mailto:${contact.email}`} data-cursor="SEND" className="btn btn-primary">
            Send an email
          </a>
          <a href={contact.github} target="_blank" rel="noreferrer" data-cursor="OPEN" className="btn btn-ghost">
            GitHub
          </a>
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noreferrer" data-cursor="OPEN" className="btn btn-ghost">
              LinkedIn
            </a>
          )}
          {contact.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-cursor="OPEN" className="btn btn-ghost">
              {s.label}
            </a>
          ))}
          <button type="button" onClick={() => scrollTo("#intro")} data-cursor="BACK" className="btn btn-primary">
            Back to the top
          </button>
        </div>
        <p className="reach-credit">© 2026 TAUSEEF KHAN — BUILT BY HAND, NO TEMPLATES</p>
      </div>
    </section>
  );
}