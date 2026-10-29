import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";

const TITLE = "Projects | Amirali Abbasi";
const DESCRIPTION =
  "Projects by Amirali Abbasi: backend and full-stack work built with TypeScript.";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
  }),
  component: Projects,
});

// Add a project by adding one object. Images live in public/projects.
const projects = [
  {
    title: "parvazigold",
    topic: "Gold & coin trading platform",
    caption:
      "Live gold, coin and Tether prices with buy and sell quotes, on a landing page and a mobile app.",
    topics: ["Next.js", "Bun", "Spring Boot", "Java"],
    url: "https://parvazigold.ir",
    web: "/projects/parvazigold-web.webp",
    app: "/projects/parvazigold-app.webp",
  },
];

function Projects() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-300">
      <main className="relative mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <Reveal className="flex items-center justify-between gap-4 pt-8 sm:pt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
          <ThemeToggle />
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 text-6xl leading-[0.95] font-normal tracking-tight sm:text-8xl">
            Projects
          </h1>
        </Reveal>
        <ul className="mt-12 space-y-16">
          {projects.map((p) => (
            <li key={p.url}>
              <Reveal delay={120}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group relative block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <img
                      src={p.web}
                      alt={`${p.title} website`}
                      width={1910}
                      height={976}
                      loading="lazy"
                      className="aspect-[1910/976] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </div>
                  <img
                    src={p.app}
                    alt={`${p.title} mobile app`}
                    width={1440}
                    height={3040}
                    loading="lazy"
                    className="absolute -bottom-6 -left-2 hidden w-[18%] rounded-2xl border border-border shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 motion-reduce:transition-none sm:block lg:-left-6"
                  />
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4 sm:pl-[20%]">
                    <div className="max-w-xl">
                      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                        {p.topic}
                      </p>
                      <h2 className="mt-2 inline-flex items-start gap-2 font-display text-3xl leading-tight tracking-tight sm:text-5xl">
                        <span className="link-sweep">{p.title}</span>
                        <ArrowUpRight
                          aria-hidden
                          strokeWidth={1}
                          className="mt-1 size-6 shrink-0 text-foreground/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-10"
                        />
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {p.caption}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {p.topics.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-border px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
