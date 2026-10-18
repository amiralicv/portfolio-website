import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import ContactLinks from "@/components/ContactLinks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amirali Abbasi | Data Engineering" },
      {
        name: "description",
        content:
          "M.Sc student in Software Engineering focused on data engineering: batch pipelines, data modeling, and orchestration.",
      },
      { property: "og:title", content: "Amirali Abbasi | Data Engineering" },
      {
        property: "og:description",
        content:
          "M.Sc student in Software Engineering focused on data engineering: batch pipelines, data modeling, and orchestration.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Amirali Abbasi | Data Engineering" },
      {
        name: "twitter:description",
        content:
          "M.Sc student in Software Engineering focused on data engineering: batch pipelines, data modeling, and orchestration.",
      },
    ],
  }),
  component: Portfolio,
});

// The same endpoint the Download button on the FlowCV page calls: returns the PDF directly.
const RESUME_URL = "https://app.flowcv.com/api/public/download_resume?token=vcb1fuhh1roi";
const EMAIL = "abbasigudarzi@gmail.com";

// Read like the key–value block at the top of a CV.
const FACTS = [
  ["Focus", "Data Engineering: batch pipelines, data modeling"],
  ["Studying", "M.Sc, Software Engineering"],
  ["Degree", "B.Eng, Computer Engineering"],
  ["Exploring", "Rust, AI & ML"],
  ["Based in", "Tehran, Iran"],
];

const BUTTON =
  "inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium transition-[color,background-color,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none";

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 py-10 sm:py-14">
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
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-300">
      <main id="top" className="relative mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        {/* Intro */}
        <div className="pt-8 pb-6 sm:pt-24">
          <Reveal className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-md bg-primary opacity-50 motion-reduce:animate-none" />
                <span className="relative inline-flex size-1.5 rounded-md bg-primary" />
              </span>
              Open to remote, hybrid &amp; on-site
            </span>
            <ThemeToggle />
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-[2.5rem] leading-[0.95] font-normal tracking-tight sm:text-8xl">
              Amirali Abbasi
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-4 font-mono text-xs tracking-[0.2em] text-primary uppercase">
              Data Engineering
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80">
              M.Sc student in Software Engineering, focused on data engineering. I study and build
              batch pipelines and data models, and I&apos;m learning AI and Rust along the way. Open
              to remote, hybrid, and on-site opportunities.
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
              <Link to="/projects" className={`${BUTTON} border border-border hover:bg-secondary`}>
                Projects
              </Link>
              <Link to="/writing" className={`${BUTTON} border border-border hover:bg-secondary`}>
                Writing
              </Link>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer noopener"
                className={`${BUTTON} border border-border hover:bg-secondary`}
              >
                Resume
                <Download className="size-4" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>

        <Section id="about" label="Focus">
          <dl className="mt-4">
            {FACTS.map(([k, v], i) => (
              <Reveal key={k} delay={i * 50}>
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-4 text-sm transition-colors duration-200 hover:border-primary/50 sm:grid-cols-[9rem_1fr] sm:text-base">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd>{v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>

        <Section id="contact" label="Contact">
          <Reveal delay={60}>
            <p className="mt-8 font-display text-5xl leading-[1.02] text-balance sm:text-6xl">
              Let's build together.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-xl leading-relaxed text-pretty text-muted-foreground">
              Open to remote, hybrid, and on-site opportunities.
            </p>
          </Reveal>
          <Reveal delay={180}>
            {/* Email card: the address is the link, copy sits beside it. */}
            <div className="mt-8 flex items-center gap-3 rounded-md border border-border bg-card p-2 pl-4">
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
