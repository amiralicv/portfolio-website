import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import GithubStats from "@/components/GithubStats";
import projectsData from "@/data/projects.json";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [{ title: "Projects | Amirali Abbasi" }],
  }),
  component: Projects,
});

type Project = { title: string; description: string; tags: string[]; href: string };

// Hand-written entries live in src/data/projects.json. Repos
// tagged `portfolio-<section id>` on GitHub (e.g. `portfolio-rust`) are merged in automatically,
// so projects can be added from the GitHub phone app: tag the repo, no deploy.
const SECTIONS: { id: string; label: string; projects: Project[] }[] = [
  { id: "data-engineering", label: "Data Engineering" },
  { id: "backend", label: "Backend" },
  { id: "rust", label: "Rust" },
  { id: "ai", label: "AI" },
].map((s) => ({
  ...s,
  projects: projectsData.filter((p) => p.section === s.id).map((p) => ({ ...p, href: p.repo })),
}));

const CARD =
  "group lux relative mt-3 block overflow-hidden rounded-xl border border-border bg-card p-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:mt-4 sm:p-7";

function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <ArrowUpRight
        aria-hidden
        strokeWidth={1}
        className="absolute top-4 right-4 size-6 text-foreground/50 sm:top-7 sm:right-7 sm:size-7"
      />
      <h3 className="pr-11 font-display text-xl leading-tight tracking-tight break-words sm:pr-14 sm:text-3xl">
        {project.title}
      </h3>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
        {project.description}
      </p>
      <ul className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2">
        {project.tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground sm:text-[11px]"
          >
            {t}
          </li>
        ))}
      </ul>
    </>
  );
  return (
    <a href={project.href} target="_blank" rel="noreferrer noopener" className={CARD}>
      {body}
    </a>
  );
}

const GITHUB_USER = "amiraliverse";

type Repo = { html_url: string; name: string; description: string | null; topics: string[] };

function useGithubProjects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  useEffect(() => {
    const key = "gh-repos";
    try {
      const hit = sessionStorage.getItem(key);
      if (hit) return setRepos(JSON.parse(hit));
    } catch {
      // Storage blocked: fetch every visit.
    }
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Repo[]) => {
        setRepos(data);
        try {
          sessionStorage.setItem(key, JSON.stringify(data));
        } catch {
          // ignore
        }
      })
      .catch(() => {});
  }, []);
  return repos;
}

function projectsFor(id: string, base: Project[], repos: Repo[]): Project[] {
  const topic = `portfolio-${id}`;
  const fetched = repos
    .filter((r) => r.topics?.includes(topic))
    .map((r) => ({
      title: r.name,
      description: r.description ?? "",
      tags: r.topics.filter((t) => !t.startsWith("portfolio-")),
      href: r.html_url,
    }));
  return [...base, ...fetched.filter((f) => !base.some((b) => b.href === f.href))];
}

function Projects() {
  const repos = useGithubProjects();
  const [active, setActive] = useState(SECTIONS[0].id);
  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];
  const current = { ...section, projects: projectsFor(section.id, section.projects, repos) };
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
          <GithubStats />
        </Reveal>
        <Reveal delay={120}>
          <div
            role="tablist"
            aria-label="Project categories"
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-border"
          >
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={id === current.id}
                aria-controls="projects-panel"
                onClick={() => setActive(id)}
                className={`-mb-px border-b-2 pb-3 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                  id === current.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Reveal>
        <div
          key={current.id}
          role="tabpanel"
          id="projects-panel"
          aria-labelledby={`tab-${current.id}`}
          className="reveal-in animate-in fade-in duration-500"
        >
          {current.projects.length ? (
            current.projects.map((p) => <ProjectCard key={p.title} project={p} />)
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">Not updated yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
