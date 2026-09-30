import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, FileDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LetterGlitch from "@/components/LetterGlitch";
import { Reveal } from "@/components/Reveal";
import ContactLinks from "@/components/ContactLinks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amirali Abbasi" },
      {
        name: "description",
        content:
          "Java backend engineer in Tehran building APIs and services with Java, Spring Boot, PostgreSQL and clean architecture. Experience with KYC, payments and SMS notification systems.",
      },
      { property: "og:title", content: "Amirali Abbasi — Software Engineer" },
      {
        property: "og:description",
        content:
          "Java backend engineer in Tehran building APIs and services with Java, Spring Boot, PostgreSQL and clean architecture. Experience with KYC, payments and SMS notification systems.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

const SLIDES = ["Intro", "Contact"];

// Repeats weight the pick: 1 bright letter in 8, the rest deep green.
const GLITCH_COLORS = [
  "#0f1f17",
  "#14291e",
  "#1b3528",
  "#0f1f17",
  "#14291e",
  "#24473a",
  "#1b3528",
  "#61dca3",
];

// Surface one or two at a time in the background, glowing.
const DATA_WORDS = [
  "SQL",
  "ETL",
  "ELT",
  "PYTHON",
  "OLAP",
  "SPARK",
  "KAFKA",
  "AIRFLOW",
  "DBT",
  "PARQUET",
  "DATA LAKE",
  "STAR SCHEMA",
  "POSTGRESQL",
  "CDC",
];

/** Wheel/swipe input inside this window after a slide change is ignored, so one gesture moves one slide. */
const LOCK_MS = 900;

/** Frosted glass: the letter field shows through, blurred, behind a faint white sheen. */
const GLASS =
  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] font-medium text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_8px_24px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl backdrop-saturate-150 transition-colors hover:border-white/25 hover:bg-white/[0.1] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none";

function ResumeButton({ className = "" }: { className?: string }) {
  return (
    <a
      href="/resume.pdf"
      download="Amirali-Abbasi-Resume.pdf"
      className={`${GLASS} px-6 py-3 text-sm ${className}`}
    >
      <FileDown className="size-4" aria-hidden />
      Resume
    </a>
  );
}

function Portfolio() {
  const [slide, setSlide] = useState(0);
  const lockedUntil = useRef(0);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, next));
    lockedUntil.current = Date.now() + LOCK_MS;
    setSlide(clamped);
  };

  // Keyboard, wheel and swipe all step one slide at a time.
  useEffect(() => {
    const step = (dir: number) => {
      if (Date.now() < lockedUntil.current) return;
      lockedUntil.current = Date.now() + LOCK_MS;
      setSlide((s) => Math.max(0, Math.min(SLIDES.length - 1, s + dir)));
    };

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) step(1);
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) step(-1);
      else return;
      e.preventDefault();
    };
    const onWheel = (e: WheelEvent) => {
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) > 20) step(Math.sign(d));
    };
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = startX - e.changedTouches[0].clientX;
      const dy = startY - e.changedTouches[0].clientY;
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(d) > 50) step(Math.sign(d));
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Mostly deep greens with a rare bright spark, so the field reads as texture behind the type. */}
        <div className="absolute inset-0 opacity-80">
          <LetterGlitch
            glitchColors={GLITCH_COLORS}
            glitchSpeed={60}
            words={DATA_WORDS}
            smooth
            outerVignette
            centerVignette={false}
          />
        </div>
        {/* Scrim behind the hero copy: solid under the text on the left, open on the right so the glitch still shows. */}
        <div className="absolute inset-0 bg-background/75 sm:bg-transparent sm:bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_88%,transparent)_40%,transparent_85%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_20%,color-mix(in_oklab,var(--background)_88%,transparent)_95%)]" />
        {/* Contact backdrop: fades over the field instead of sliding in with a hard edge. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,color-mix(in_oklab,var(--primary)_12%,var(--background))_0%,var(--background)_70%)] transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
          style={{ opacity: slide === 1 ? 0.9 : 0 }}
        />
      </div>

      {/* Slide track: each slide is one viewport; the track slides sideways. */}
      <div
        className="relative z-10 flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${slide * 100}%)` }}
      >
        {/* Hero */}
        <section
          aria-label="Intro"
          inert={slide !== 0}
          className="flex h-full w-full shrink-0 items-center"
        >
          <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
            <Reveal delay={80}>
              <h1 className="text-5xl leading-[0.95] font-semibold sm:text-7xl">
                <span className="text-gradient">Amirali Abbasi</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-lg text-foreground/80 sm:text-xl">
                Data engineer in training, building pipelines and data models on top of a solid{" "}
                <span className="text-foreground">Java and Spring Boot</span> foundation.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-105"
                >
                  Get in touch
                </button>
                <ResumeButton />
              </div>
            </Reveal>
            <Reveal delay={320}>
              <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:mt-16 sm:grid-cols-4">
                <div>
                  <dt>
                    <span className="label-glow inline-flex items-center gap-2 rounded-full border bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-2 rounded-full bg-primary" />
                      </span>
                      Available for work
                    </span>
                  </dt>
                  <dd className="mt-2 text-xs text-muted-foreground">Tehran, Iran</dd>
                </div>
                {[
                  ["Data Engineering", "Current focus"],
                  ["B.Eng", "Computer Engineering"],
                  ["M.Sc", "Software Engineering (ongoing)"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="font-display text-xl text-foreground">{v}</dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{k}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Contact — corner brackets frame the stage, the email is the loudest thing on it. */}
        <section
          aria-label="Contact"
          inert={slide !== 1}
          className="flex h-full w-full shrink-0 items-center"
        >
          <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
            <div aria-hidden className="contact-aura" />
            {slide === 1 &&
              (
                [
                  ["left-5 sm:left-8 top-0 rounded-tl-[2rem] border-t border-l", 0],
                  ["right-5 sm:right-8 top-0 rounded-tr-[2rem] border-t border-r", 90],
                  ["left-5 sm:left-8 bottom-0 rounded-bl-[2rem] border-b border-l", 180],
                  ["right-5 sm:right-8 bottom-0 rounded-br-[2rem] border-b border-r", 270],
                ] as const
              ).map(([position, delay]) => (
                <span
                  key={position}
                  aria-hidden
                  style={{ animationDelay: `${delay}ms` }}
                  className={`frame-corner absolute size-16 border-primary/45 sm:size-24 ${position}`}
                />
              ))}

            <div className="px-6 py-10 text-center sm:px-16 sm:py-14">
              <Reveal>
                <p className="font-mono text-xs tracking-[0.35em] text-primary uppercase">
                  Contact
                </p>
              </Reveal>
              <Reveal delay={90}>
                <h2 className="mx-auto mt-6 max-w-3xl text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
                  Let's build reliable data systems.
                </h2>
              </Reveal>
              <Reveal delay={170}>
                <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
                  Open to data engineering roles. Java background, data focus
                </p>
              </Reveal>
              <Reveal delay={250}>
                <a
                  href="mailto:abbasigudarzi@gmail.com"
                  className="group mt-8 inline-flex flex-wrap items-center justify-center gap-3 text-xl font-medium break-all text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-3xl"
                >
                  <span className="link-sweep">abbasigudarzi@gmail.com</span>
                  <ArrowUpRight className="size-6 shrink-0 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              </Reveal>
              <Reveal delay={330}>
                <div className="mt-9">
                  <ContactLinks />
                </div>
              </Reveal>
              <Reveal delay={410}>
                <ResumeButton className="mt-9" />
              </Reveal>
            </div>
          </div>
        </section>
      </div>

      {/* Slide dots */}
      <nav
        aria-label="Slides"
        className="absolute inset-x-0 bottom-5 z-30 flex justify-center gap-2 sm:bottom-8"
      >
        {SLIDES.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => go(i)}
            aria-label={label}
            aria-current={slide === i ? "true" : undefined}
            className="flex h-11 items-center rounded-full px-1.5 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                slide === i ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/50"
              }`}
            />
          </button>
        ))}
      </nav>
    </main>
  );
}
