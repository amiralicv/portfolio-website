import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import GithubStats from "@/components/GithubStats";
import { projects } from "@/data/projects";

const TITLE = "Projects | Amirali Abbasi";
const DESCRIPTION =
  "Projects by Amirali Abbasi: backend APIs, computer vision and machine learning.";

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

const SORTED = [...projects].sort((a, b) => b.date.localeCompare(a.date));

function ProjectItem({ project }: { project: (typeof projects)[number] }) {
  return (
    <li className="border-b border-border py-6 sm:py-8">
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        {project.topic}
      </p>
      <h2 className="mt-2 font-display text-xl leading-tight tracking-tight break-words sm:text-3xl">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-start gap-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <span className="link-sweep">{project.title}</span>
          <ArrowUpRight
            aria-hidden
            strokeWidth={1}
            className="mt-0.5 size-5 shrink-0 text-foreground/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-7"
          />
        </a>
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
        {project.description}
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground sm:text-xs">
        {project.tech.join(" · ")}
      </p>
      {project.status && (
        <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
          {project.status}
        </p>
      )}
    </li>
  );
}

function Projects() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-300">
      <main className="relative mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        <Reveal className="flex items-center justify-between gap-4 pt-8 sm:pt-20">
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
        <Reveal delay={100}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
            Things I&apos;ve built, newest first.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <GithubStats />
        </Reveal>
        <Reveal delay={140}>
          <ul className="mt-8 border-t border-border">
            {SORTED.map((p) => (
              <ProjectItem key={p.url} project={p} />
            ))}
          </ul>
        </Reveal>
      </main>
    </div>
  );
}
