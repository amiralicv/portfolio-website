import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  siApachemaven,
  siDocker,
  siGit,
  siHibernate,
  siIntellijidea,
  siOpenjdk,
  siPostgresql,
  siPostman,
  siSpring,
  siSpringboot,
} from "simple-icons";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import ContactLinks from "@/components/ContactLinks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amirali Abbasi" },
      {
        name: "description",
        content:
          "Java backend developer building reliable server-side systems with Spring Boot, with a growing focus on databases and data pipelines.",
      },
      { property: "og:title", content: "Amirali Abbasi — Java Backend Developer" },
      {
        property: "og:description",
        content:
          "Java backend developer building reliable server-side systems with Spring Boot, with a growing focus on databases and data pipelines.",
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
  ["Focus", "Backend & Data Systems"],
  ["Degree", "B.Eng, Computer Engineering"],
  ["Studying", "M.Sc, Software Engineering"],
  ["Based in", "Tehran, Iran"],
];

// simple-icons has no "Java" mark (Oracle asked for its removal); OpenJDK stands in.
const TOOLKIT = [
  { ...siOpenjdk, title: "Java" },
  siSpringboot,
  siSpring,
  { ...siHibernate, title: "Hibernate / JPA" },
  siPostgresql,
  siDocker,
  siGit,
  siApachemaven,
  siIntellijidea,
  siPostman,
];

// Near-black brand colours (OpenJDK, IntelliJ) would vanish in dark mode; they hover to the ink colour instead.
function brandColor(hex: string) {
  const n = parseInt(hex, 16);
  const luma = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return luma < 60 ? "var(--foreground)" : `#${hex}`;
}

function ToolIcons({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0" aria-hidden={hidden || undefined}>
      {TOOLKIT.map((icon) => (
        <li key={icon.title} className="pr-10 sm:pr-14">
          <svg
            viewBox="0 0 24 24"
            role={hidden ? undefined : "img"}
            aria-label={hidden ? undefined : icon.title}
            className="size-8 fill-muted-foreground/70 transition-colors duration-300 hover:fill-[var(--brand)] sm:size-9"
            style={{ "--brand": brandColor(icon.hex) } as CSSProperties}
          >
            <title>{icon.title}</title>
            <path d={icon.path} />
          </svg>
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
              Open to remote &amp; on-site
            </span>
            <ThemeToggle />
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-5xl leading-none sm:text-7xl">Amirali Abbasi</h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 font-mono text-xs tracking-[0.2em] text-primary uppercase">
              Java Backend Developer
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80">
              Java backend developer building reliable server-side systems with Spring Boot, with a
              growing focus on databases and data pipelines.
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
              Let's build reliable systems.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-muted-foreground">
              Open to remote, hybrid, and on-site backend and data platform roles. Java, Spring
              Boot, SQL.
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
