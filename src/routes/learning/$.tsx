import { createFileRoute, getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
import { ProgressBar, TopicIcon, TrackMark } from "@/components/LearningShell";
import { progressUnder, rememberVisit, setTick, useTicks } from "@/hooks/use-learning-progress";
import { getLearningNote, type LearningRef } from "@/lib/learning";

const TYPE_LABEL: Record<string, string> = {
  topic: "Topic",
  stage: "Section",
  hub: "Track",
  index: "Track",
  interview: "Interview prep",
  guide: "Guide",
  reference: "Reference",
};

const layout = getRouteApi("/learning");

export const Route = createFileRoute("/learning/$")({
  loader: ({ params }) => getLearningNote({ data: params._splat ?? "" }),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Learning — Amirali Abbasi` },
          { property: "og:title", content: `${loaderData.title} — Amirali Abbasi` },
        ]
      : [],
  }),
  component: NotePage,
});

function NotePage() {
  const note = Route.useLoaderData();
  const { boxes, tracks } = layout.useLoaderData();
  const navigate = useNavigate();
  const ticks = useTicks();
  const article = useRef<HTMLElement>(null);

  const track = tracks.find((t) => note.slug === t.slug || note.slug.startsWith(t.slug + "/"));
  const isTopic = note.type === "topic" || note.type === "interview";
  const yours = progressUnder(ticks, boxes, note.slug);

  // Mirror this visitor's ticks onto the prerendered checkboxes and topic counts.
  useEffect(() => {
    const root = article.current;
    if (!root) return;
    const mine = new Set(ticks[note.slug] ?? []);
    root.querySelectorAll<HTMLInputElement>("input[data-box]").forEach((input) => {
      input.checked = mine.has(Number(input.dataset.box));
      input.disabled = false;
      if (!input.hasAttribute("aria-label")) {
        const text = input.closest("li")?.textContent ?? "";
        input.setAttribute("aria-label", text.trim().slice(0, 140) || "Mark as done");
      }
    });
    root.querySelectorAll<HTMLElement>(".topic-count").forEach((el) => {
      const slug = el.closest("a")?.dataset.slug;
      if (!slug) return;
      const p = progressUnder(ticks, boxes, slug);
      el.textContent = `${p.done}/${p.total || el.dataset.total}`;
      el.classList.toggle("is-started", p.done > 0);
      el.classList.toggle("is-done", p.total > 0 && p.done === p.total);
    });
  }, [ticks, note.slug, boxes]);

  useEffect(() => {
    if (isTopic) rememberVisit({ slug: note.slug, title: note.title });
  }, [isTopic, note.slug, note.title]);

  // A native listener: React's synthetic onChange doesn't reliably reach
  // checkboxes that live inside dangerouslySetInnerHTML.
  useEffect(() => {
    const root = article.current;
    if (!root) return;
    const onChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.dataset.box === undefined) return;
      setTick(note.slug, Number(input.dataset.box), input.checked);
    };
    root.addEventListener("change", onChange);
    return () => root.removeEventListener("change", onChange);
  }, [note.slug]);

  // Note HTML is prerendered, so its links are plain <a>. Route internal ones
  // through the router so moving between notes doesn't reload the page.
  const onClick = (e: MouseEvent<HTMLElement>) => {
    const href = (e.target as HTMLElement).closest("a")?.getAttribute("href");
    if (!href?.startsWith("/learning/") || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)
      return;
    e.preventDefault();
    const [path, hash] = href.slice("/learning/".length).split("#");
    navigate({ to: "/learning/$", params: { _splat: path }, hash });
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-1 text-sm">
        <Link to="/learning" className="crumb">
          Learning
        </Link>
        {note.crumbs.map((c) => (
          <span key={c.slug} className="flex items-center gap-1">
            <ChevronRight aria-hidden className="size-3.5 text-muted-foreground/60" />
            <Link to="/learning/$" params={{ _splat: c.slug }} className="crumb">
              {c.title}
            </Link>
          </span>
        ))}
      </nav>

      <header className="mb-12">
        <span className="flex size-11 items-center justify-center rounded-xl bg-card text-primary ring-1 ring-border">
          {isTopic || !track ? (
            <TopicIcon emoji={note.emoji} />
          ) : (
            <TrackMark logo={track.logo} className="size-5" />
          )}
        </span>
        <h1 className="mt-6 font-reading text-[2rem] leading-[1.15] font-semibold text-balance sm:text-[2.5rem]">
          {note.title}
        </h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{TYPE_LABEL[note.type] ?? "Note"}</span>
          {yours.total > 0 && (
            <>
              <Dot />
              <span className="tabular-nums">
                {yours.done > 0 ? (
                  <>
                    <span className="text-foreground">{yours.done}</span> of {yours.total} done
                  </>
                ) : (
                  `${yours.total} items to tick`
                )}
              </span>
            </>
          )}
        </p>
        {yours.total > 0 && (
          <ProgressBar progress={yours} label="Your progress" className="mt-5 max-w-72" />
        )}
      </header>

      <article
        ref={article}
        className="note-prose"
        onClick={onClick}
        // Built from my own vault at build time (scripts/learning.ts), not user input.
        dangerouslySetInnerHTML={{ __html: note.html }}
      />

      {(note.prev || note.next) && (
        <nav
          aria-label="Previous and next"
          className="mt-20 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
        >
          {note.prev ? <Neighbor to={note.prev} dir="prev" /> : <span />}
          {note.next && <Neighbor to={note.next} dir="next" />}
        </nav>
      )}
    </>
  );
}

function Dot() {
  return (
    <span aria-hidden className="opacity-40">
      ·
    </span>
  );
}

function Neighbor({ to, dir }: { to: LearningRef; dir: "prev" | "next" }) {
  const next = dir === "next";
  return (
    <Link
      to="/learning/$"
      params={{ _splat: to.slug }}
      className={`group flex flex-col gap-1 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-card ${next ? "sm:items-end sm:text-right" : ""}`}
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {!next && (
          <ArrowLeft
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
          />
        )}
        {next ? "Next" : "Previous"}
        {next && (
          <ArrowRight
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        )}
      </span>
      <span className="font-reading text-[0.9375rem] text-foreground">{to.title}</span>
    </Link>
  );
}
