import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import ContactLinks, { ContactIcon, ROW } from "@/components/ContactLinks";

const MAIL_PATH =
  "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z";

const TITLE = "Amirali Abbasi | Backend Developer, Python & FastAPI";
const DESCRIPTION =
  "Backend developer building APIs with Python and FastAPI, with a background in Java and Spring Boot. Exploring computer vision, AI, machine learning and deep learning.";

const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Amirali Abbasi",
  jobTitle: "Backend Developer",
  url: "https://amiraliabbasi.ir",
  sameAs: ["https://github.com/amiralicv", "https://www.linkedin.com/in/amirali-abbasi"],
  knowsAbout: [
    "Python",
    "FastAPI",
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "Computer Vision",
    "Machine Learning",
    "Deep Learning",
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      {
        name: "description",
        content: DESCRIPTION,
      },
      { property: "og:title", content: TITLE },
      {
        property: "og:description",
        content: DESCRIPTION,
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      {
        name: "twitter:description",
        content: DESCRIPTION,
      },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(PERSON) }],
  }),
  component: Portfolio,
});

// The same endpoint the Download button on the FlowCV page calls: returns the PDF directly.
const RESUME_URL = "https://app.flowcv.com/api/public/download_resume?token=vcb1fuhh1roi";
const EMAIL = "abbasigudarzi@gmail.com";

// Read like the key–value block at the top of a CV.
const FACTS = [
  ["Focus", "Backend APIs with Python & FastAPI"],
  ["Background", "Java & Spring Boot"],
  ["Exploring", "Computer vision"],
  ["Learning", "AI · Machine learning · Deep learning"],
  ["Studying", "M.Sc, Software Engineering"],
  ["Degree", "B.Eng, Computer Engineering"],
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
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
              Open to remote, hybrid &amp; on-site roles
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
              Backend Developer · Python &amp; FastAPI
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80">
              I build backend services and APIs with Python and FastAPI, with a background in Java
              and Spring Boot. Alongside backend work, I&apos;m exploring computer vision and
              studying AI, machine learning and deep learning from the math up.
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

        <Section id="experience" label="Experience">
          <dl className="mt-4">
            <Reveal>
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-4 text-sm transition-colors duration-200 hover:border-primary/50 sm:grid-cols-[9rem_1fr] sm:text-base">
                <dt className="text-muted-foreground">Backend Developer</dt>
                <dd>
                  <p>Java · Spring Boot · PostgreSQL</p>
                  <p className="mt-1 text-muted-foreground">
                    Built backend features, PostgreSQL data access and integrations with external
                    APIs.
                  </p>
                </dd>
              </div>
            </Reveal>
          </dl>
        </Section>

        <Section id="contact" label="Contact">
          <div className="mt-8 grid min-w-0 gap-8 sm:mt-10">
            <div>
              <Reveal delay={60}>
                <p className="font-display text-5xl leading-[1.02] text-balance sm:text-6xl">
                  Let&apos;s build something.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-4 max-w-sm leading-relaxed text-pretty text-muted-foreground">
                  Open to backend, Python and AI roles: remote, hybrid or on-site.
                </p>
              </Reveal>
            </div>
            <Reveal delay={180}>
              <ul className="w-full min-w-0 overflow-hidden rounded-md border border-border bg-card">
                <li className="flex items-stretch">
                  <a href={`mailto:${EMAIL}`} className={ROW}>
                    <ContactIcon path={MAIL_PATH} />
                    <span className="w-16 shrink-0 sm:w-20 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                      Email
                    </span>
                    <span className="link-sweep min-w-0 flex-1 truncate text-base sm:text-lg">
                      {EMAIL}
                    </span>
                  </a>
                  <div className="flex items-center border-l border-border px-2">
                    <CopyEmail />
                  </div>
                </li>
                <ContactLinks />
              </ul>
            </Reveal>
          </div>
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
