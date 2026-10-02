import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import ContactLinks from "@/components/ContactLinks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amirali Abbasi | Data Engineer" },
      {
        name: "description",
        content:
          "Data engineer with a Java backend foundation, building batch pipelines and dimensional models with Python, SQL, and PostgreSQL.",
      },
      { property: "og:title", content: "Amirali Abbasi | Data Engineer" },
      {
        property: "og:description",
        content:
          "Data engineer with a Java backend foundation, building batch pipelines and dimensional models with Python, SQL, and PostgreSQL.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const RESUME_URL = "https://flowcv.com/resume/vcb1fuhh1roi";
const EMAIL = "abbasigudarzi@gmail.com";

// Read like the key–value block at the top of a CV.
const FACTS = [
  ["Focus", "Data Engineering: batch ETL, data modeling"],
  ["Degree", "B.Eng, Computer Engineering"],
  ["Studying", "M.Sc, Software Engineering"],
  ["Based in", "Tehran, Iran"],
];

// Full-colour, filled logos (Devicon, MIT) served from public/icons. Shown grey and faded,
// in colour on hover, so every mark reads as a solid shape rather than an outline.
const TOOLKIT = [
  { file: "python", title: "Python" },
  { file: "postgresql", title: "PostgreSQL" },
  { file: "apacheairflow", title: "Airflow" },
  { file: "docker", title: "Docker" },
  { file: "git", title: "Git" },
  { file: "java", title: "Java" },
];

// The marquee loops by sliding one copy's width, so a copy must be wider than the strip.
// Six icons are not, so each copy shows the set twice (second pass hidden from screen readers).
const STRIP = [0, 1].flatMap((pass) => TOOLKIT.map((icon) => ({ ...icon, pass })));

function ToolIcons({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {STRIP.map((icon) => (
        <li
          key={`${icon.pass}-${icon.file}`}
          aria-hidden={(!hidden && icon.pass === 1) || undefined}
          className="pr-10 sm:pr-14"
        >
          <img
            src={`/icons/${icon.file}.svg`}
            alt={hidden || icon.pass ? "" : icon.title}
            title={icon.title}
            width={36}
            height={36}
            loading="lazy"
            draggable={false}
            className="size-8 opacity-45 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:size-9"
          />
        </li>
      ))}
    </ul>
  );
}

const BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 py-6 sm:py-8">
      <Reveal>
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-[11px] font-normal tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (insecure context, permissions): the mailto link still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email"}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main id="top" className="mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        {/* Intro */}
        <div className="pt-8 pb-4 sm:pt-20">
          <Reveal className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50 motion-reduce:animate-none" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Open to remote, hybrid &amp; on-site
            </span>
            <ThemeToggle />
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-5xl leading-none sm:text-7xl">Amirali Abbasi</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 font-mono text-xs tracking-[0.2em] text-primary uppercase">
              Data Engineer
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80">
              Data engineer with a Java backend foundation, building batch pipelines and dimensional
              models with Python, SQL, and PostgreSQL.
            </p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className={`${BUTTON} bg-foreground text-background hover:bg-foreground/85`}
              >
                Get in touch
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer noopener"
                className={`${BUTTON} border border-border hover:bg-secondary`}
              >
                Resume
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Stack strip: unlabelled band between the hero and the CV block. Hover pauses. */}
        <Reveal delay={320}>
          <div
            aria-label="Tech stack"
            role="region"
            className="marquee mt-6 overflow-hidden border-y border-border py-5"
          >
            {/* Two identical lists in a row; sliding the pair by half loops seamlessly. */}
            <div className="marquee-track flex w-max">
              <ToolIcons />
              <ToolIcons hidden />
            </div>
          </div>
        </Reveal>

        <Section id="about" label="At a glance">
          <dl className="mt-4">
            {FACTS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 50}>
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-3 text-sm sm:grid-cols-[9rem_1fr]">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd>{v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>

        <Section id="contact" label="Contact">
          <Reveal delay={60}>
            <p className="mt-8 font-display text-4xl leading-tight text-balance sm:text-5xl">
              Let's build reliable data systems.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-muted-foreground">
              Open to remote, hybrid, and on-site data engineering roles. Python, SQL, PostgreSQL.
            </p>
          </Reveal>
          <Reveal delay={180}>
            {/* Email card: the address is the link, copy sits beside it. */}
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-card p-2 pl-4">
              <a
                href={`mailto:${EMAIL}`}
                className="group flex min-w-0 flex-1 items-center gap-2 py-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span className="link-sweep truncate text-base sm:text-xl">{EMAIL}</span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <CopyEmail />
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-6">
              <ContactLinks />
            </div>
          </Reveal>
        </Section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6 text-xs text-muted-foreground sm:px-8">
          <span>© {new Date().getFullYear()} Amirali Abbasi</span>
          <a href="#top" className="transition-colors hover:text-foreground">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
