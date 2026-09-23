import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bot,
  Database,
  Github,
  LayoutTemplate,
  Leaf,
  Languages as LanguagesIcon,
  SquareTerminal,
  Wrench,
} from "lucide-react";
import { useEffect, useRef } from "react";
import BorderGlow from "@/components/BorderGlow";
import { HeroNav } from "@/components/HeroNav";
import ProjectSlider from "@/components/ProjectSlider";
import { SceneBackground } from "@/components/SceneBackground";
import { Reveal } from "@/components/Reveal";
import ContactLinks from "@/components/ContactLinks";
import ProfileCard from "@/components/ProfileCard";
import { getLenis, useLenis } from "@/hooks/use-lenis";

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

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const GLOW = {
  edgeSensitivity: 25,
  glowColor: "40 80 80",
  backgroundColor: "oklch(0.11 0.008 155)",
  borderRadius: 24,
  glowRadius: 40,
  glowIntensity: 1,
  coneSpread: 25,
  colors: ["#6ee7a0", "#22c55e", "#38d9c4"],
};

const SKILL_GROUPS = [
  {
    title: "Language & Core",
    icon: SquareTerminal,
    items: ["Java", "OOP", "Collections", "Exception handling"],
  },
  {
    title: "Spring",
    icon: Leaf,
    items: ["Spring Boot", "REST APIs", "Dependency injection"],
  },
  {
    title: "Data",
    icon: Database,
    items: ["SQL", "PostgreSQL", "JPA"],
  },
  {
    title: "Tooling",
    icon: Wrench,
    items: ["Git", "Maven", "IntelliJ IDEA", "Postman", "Docker basics"],
  },
  {
    title: "Frontend touch",
    icon: LayoutTemplate,
    items: ["HTML", "CSS / Tailwind", "JavaScript basics"],
  },
  {
    title: "AI",
    icon: Bot,
    items: ["Claude Code", "Spring AI"],
  },
  {
    title: "Languages",
    icon: LanguagesIcon,
    items: ["Persian (native)", "English (advanced)"],
  },
];

const HIGHLIGHTS = [
  "Learned Java Core fundamentals and adapted to the company's Agile/Scrum task workflow during the ramp-up period",
  "Developed and integrated backend features using Spring and Spring Boot",
  "Integrated third-party APIs, including KYC (facial recognition) verification and payment gateway services",
  "Built inquiry / lookup services for various business use cases",
  "Designed and implemented an SMS notification system for a customer loyalty program, triggered by rule-based business logic",
];

const PROJECTS = [
  {
    title: "Parvazi Gold",
    description:
      "Trading dashboard PWA for buying and selling gold and coins — live pricing, order history and an AI trading assistant.",
    href: "https://parvazigold.ir/",
    image: "/projects/parvazigold.webp",
    label: "In progress",
  },
  {
    title: "OmidPay",
    description:
      "Iranian electronic payment gateway — collaborated on backend services for smart POS/card-reader payments and financial management tooling.",
    href: "https://omidpayment.ir/",
    image: "/projects/omidpay.webp",
    label: "Collaborated",
  },
  {
    title: "NovaStore",
    description:
      "E-commerce platform built for my GitHub portfolio — product catalog, cart and checkout with a Java Spring Boot backend.",
    href: "https://github.com/amiraliverse",
    image: "/projects/novastore.webp",
    label: "In progress",
  },
];

// Same scroll as the nav: Lenis when smooth scrolling is on, a jump otherwise.
function scrollToContact() {
  const target = document.getElementById("contact");
  if (!target) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset: -96 });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96 });
}

function Portfolio() {
  useLenis();
  const heroRef = useRef<HTMLElement | null>(null);

  // The browser restores the previous scroll offset on reload by default,
  // which on a one-pager looks like the page scrolling itself down to About.
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Fixed generative background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <SceneBackground heroRef={heroRef} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_20%,color-mix(in_oklab,var(--background)_88%,transparent)_95%)]" />
      </div>

      {/* Nav — lives with the hero and dissolves once you scroll past it */}
      <HeroNav items={NAV} heroRef={heroRef} />

      {/* Hero — the only part of the page that shows the animated background */}
      {/* z-20: above the hero-fade strip below, so text never sinks into the fade on short screens. */}
      <div id="top" className="relative z-20 mx-auto w-full max-w-5xl px-5 sm:px-8">
        <section ref={heroRef} className="flex min-h-[88vh] flex-col justify-center py-24">
          <Reveal delay={80}>
            <h1 className="mt-6 text-5xl leading-[0.95] font-semibold sm:text-7xl">
              <span className="text-gradient">Amirali Abbasi</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Java backend engineer building APIs and services with{" "}
              <span className="text-foreground">Spring Boot</span>, relational data and clean
              architecture — and going deeper, not just broader.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-105"
              >
                Get in touch
              </a>
              <a
                href="#experience"
                className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                See experience
              </a>
              <a
                href="https://github.com/amiraliverse"
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Github className="size-4" />
                GitHub
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <dl className="mt-16 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {/* Availability badge takes the first slot the "9 mo" stat used to hold. */}
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
                ["Java · Spring Boot", "Main stack"],
                ["B.Eng", "Computer Engineering"],
                ["M.Sc", "Software Engineering (ongoing)"],
              ].map(([v, k]) => (
                <div key={k}>
                  <dt className="font-display text-xl whitespace-pre-line text-foreground">{v}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{k}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      </div>

      {/*
        Everything past the hero sits on an opaque black panel, so the animated
        field is confined to the hero. The strip pinned directly above the panel
        is the shadow that fades one into the other.
      */}
      <div className="relative z-10 bg-background">
        {/*
          Sits above the panel, so it must NOT be clipped — the wrapper keeps
          overflow visible and the ambient glow does its own clipping below.
        */}
        <div
          aria-hidden
          className="hero-fade pointer-events-none absolute inset-x-0 bottom-full h-72"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="ambient-glow absolute inset-0" />
        </div>
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
          {/* About */}
          <Section id="about" title="About me" kicker="01">
            <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
              <Reveal className="mx-auto">
                <ProfileCard
                  avatarUrl="/profile.webp"
                  miniAvatarUrl="/avatar.webp"
                  pixelColors="#bbf7d0,#4ade80,#16a34a"
                  enableTilt={false}
                  name="Amirali Abbasi"
                  title="Java Backend Developer"
                  handle="amiraliverse"
                  status="Open to work"
                  contactText="Contact me"
                  innerGradient="linear-gradient(145deg, #0b2a1a8c 0%, #22c55e33 100%)"
                  behindGlowColor="rgba(34, 197, 94, 0.55)"
                  onContactClick={scrollToContact}
                />
              </Reveal>
              <Reveal delay={120}>
                <BorderGlow {...GLOW} className="no-glow">
                  <div className="p-7 sm:p-9">
                    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        I spent 9 months as a Java backend developer — the first 4 months on Java
                        Core fundamentals and adapting to the team's Scrum workflow, then moving
                        into Spring Boot work: integrating third-party APIs like KYC facial
                        recognition, payment services, and inquiry services, and building a
                        business-rule-triggered SMS notification system for a customer loyalty
                        program. That role ended when the war disrupted the company.
                      </p>
                      <p>
                        I'm using this gap deliberately to go deeper, not just wider: not only how
                        to build APIs and services with Java and Spring Boot, but why they work —
                        data structures and algorithms, SOLID, design patterns and DDD, reliable
                        database design, and secure, well-tested systems.
                      </p>
                      <p>
                        I love the JVM family as a whole. I'm also genuinely interested in AI — both
                        developing fast without sacrificing depth of understanding, and building
                        agents, including using Spring AI for modern applications. Beyond the
                        application layer, I'm expanding into deployment and server management,
                        containerization, and CI/CD — and this drive to learn is constant in me, not
                        just something that shows up on a team, though I do strongly prefer learning
                        alongside one.
                      </p>
                    </div>
                  </div>
                </BorderGlow>
              </Reveal>
            </div>
          </Section>

          {/* Experience */}
          <Section id="experience" title="Experience" kicker="02">
            <div className="space-y-6">
              <Reveal>
                <BorderGlow {...GLOW}>
                  <div className="p-7 sm:p-10">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h3 className="text-xl font-semibold">Independent Projects</h3>
                      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        2026 — Present
                      </p>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      Designing and building production-style backend systems independently (Spring
                      Boot, DDD, CI/CD, containerization) and an AI agent using Spring AI.
                    </p>
                  </div>
                </BorderGlow>
              </Reveal>
              <Reveal delay={120}>
                <BorderGlow {...GLOW}>
                  <div className="p-7 sm:p-10">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">
                          Junior Java Backend Developer (Intern)
                        </h3>
                        <p className="mt-1 text-sm text-primary">
                          Electronic Taban Software Company
                        </p>
                      </div>
                      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        2025 — 2026 · 9 months
                      </p>
                    </div>
                    <ul className="mt-7 space-y-4">
                      {HIGHLIGHTS.map((h) => (
                        <li
                          key={h}
                          className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </BorderGlow>
              </Reveal>
            </div>
          </Section>

          {/* Projects */}
          <Section id="projects" title="Projects" kicker="03">
            <Reveal>
              <ProjectSlider projects={PROJECTS} />
            </Reveal>
          </Section>

          {/* Skills */}
          <Section id="skills" title="Skills" kicker="04">
            <dl className="border-b border-border">
              {SKILL_GROUPS.map((group, i) => (
                <Reveal
                  key={group.title}
                  delay={i * 60}
                  className="grid gap-2 border-t border-border py-5 sm:grid-cols-[220px_1fr] sm:gap-6"
                >
                  <dt className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-primary uppercase">
                    <group.icon className="size-4 shrink-0" aria-hidden />
                    {group.title}
                  </dt>
                  <dd className="text-sm leading-relaxed text-foreground/90">
                    {group.items.join(" · ")}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </Section>

          {/* Education */}
          <Section id="education" title="Education" kicker="05">
            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  degree: "Master's Degree in Software Engineering",
                  school: "Islamic Azad University, Electronic Campus (Tehran)",
                  years: "2025 — present",
                },
                {
                  degree: "Computer Engineering",
                  school: "Technical and Vocational University of Khorramabad (TVU)",
                  years: "2021 — 2025",
                },
              ].map((e, i) => (
                <Reveal key={e.degree} delay={i * 100}>
                  <BorderGlow
                    {...GLOW}
                    borderRadius={20}
                    glowRadius={30}
                    className="no-glow h-full"
                  >
                    <div className="p-6 sm:p-8">
                      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        {e.years}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold">{e.degree}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{e.school}</p>
                    </div>
                  </BorderGlow>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* Contact */}
          {/*
            No card here: the section is the stage. Corner brackets draw the
            frame, a slow aura turns behind the type, and the email is the
            single loudest thing on the screen.
          */}
          <section
            id="contact"
            className="relative flex min-h-[calc(100svh-6rem)] flex-col justify-center py-16"
          >
            <div aria-hidden className="contact-aura" />

            <div className="relative">
              {(
                [
                  ["left-0 top-0 rounded-tl-[2rem] border-t border-l", 0],
                  ["right-0 top-0 rounded-tr-[2rem] border-t border-r", 90],
                  ["left-0 bottom-0 rounded-bl-[2rem] border-b border-l", 180],
                  ["right-0 bottom-0 rounded-br-[2rem] border-b border-r", 270],
                ] as const
              ).map(([position, delay]) => (
                <span
                  key={position}
                  aria-hidden
                  style={{ animationDelay: `${delay}ms` }}
                  className={`frame-corner absolute size-16 border-primary/45 sm:size-24 ${position}`}
                />
              ))}

              <div className="px-6 py-8 text-center sm:px-16 sm:py-10">
                <Reveal>
                  <p className="font-mono text-xs tracking-[0.35em] text-primary uppercase">
                    06 — Contact
                  </p>
                </Reveal>

                <Reveal delay={90}>
                  <h2 className="mx-auto mt-7 max-w-3xl text-4xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
                    Let's build the backend.
                  </h2>
                </Reveal>

                <Reveal delay={170}>
                  <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground">
                    Open to work as a Java backend developer.
                  </p>
                </Reveal>

                <Reveal delay={250}>
                  <a
                    href="mailto:abbasigudarzi@gmail.com"
                    className="group mt-10 inline-flex flex-wrap items-center justify-center gap-3 text-xl font-medium break-all text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-3xl"
                  >
                    <span className="link-sweep">abbasigudarzi@gmail.com</span>
                    <ArrowUpRight className="size-6 shrink-0 text-primary transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </a>
                </Reveal>

                <Reveal delay={330}>
                  <div className="mt-11">
                    <ContactLinks />
                  </div>
                </Reveal>

                <Reveal delay={410}>
                  <p className="mt-11 flex items-center justify-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                    </span>
                    Tehran · Available for work
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Amirali Abbasi — Java Backend Engineer
          </footer>
        </div>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  kicker,
  children,
}: {
  id: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10 sm:py-14">
      <Reveal>
        <div className="mb-10 flex items-end gap-4">
          <span className="font-mono text-xs tracking-[0.3em] text-primary">{kicker}</span>
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          <span className="mb-2 h-px flex-1 bg-border" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}
