import { createFileRoute, getRouteApi, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProgressBar, TrackMark } from "@/components/LearningShell";
import { progressUnder, useLastVisited, useTicks } from "@/hooks/use-learning-progress";
import type { Progress } from "@/lib/learning";

const DESCRIPTION =
  "Study roadmaps for Java, databases, Spring Boot, Spring Data JPA and Spring Security. Tick items to track your own progress.";

const layout = getRouteApi("/learning");

export const Route = createFileRoute("/learning/")({
  head: () => ({
    meta: [
      { title: "Learning — Amirali Abbasi" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Learning — Amirali Abbasi" },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LearningIndexPage,
});

const fmt = new Intl.NumberFormat("en");

/** "3 of 612", never a rounded "0%" that tells a reader who has started that they have nothing. */
const countLabel = ({ done, total }: Progress) =>
  done > 0 ? `${fmt.format(done)} of ${fmt.format(total)} done` : `${fmt.format(total)} items`;

function LearningIndexPage() {
  const { tracks, boxes } = layout.useLoaderData();
  const ticks = useTicks();
  const last = useLastVisited();
  const mine = progressUnder(ticks, boxes, "");
  const perTrack = tracks.map((t) => progressUnder(ticks, boxes, t.slug));
  // The rail lights up to the furthest track the reader has started.
  let reached = -1;
  perTrack.forEach((p, i) => {
    if (p.done > 0) reached = i;
  });

  return (
    <>
      <section className="max-w-[36rem]">
        <h1 className="font-reading text-[2.5rem] leading-[1.1] font-semibold text-balance sm:text-5xl">
          Learning
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-pretty text-muted-foreground">
          Five roadmaps to work through in order; tick any item to keep your own progress, saved
          privately in this browser.
        </p>
        <p className="mt-6 text-sm text-muted-foreground tabular-nums">
          {mine.done > 0 ? (
            <>
              You've ticked <span className="text-foreground">{fmt.format(mine.done)}</span> of{" "}
              {fmt.format(mine.total)} items.
            </>
          ) : (
            <>
              {fmt.format(mine.total)} items across {tracks.length} tracks. Nothing ticked yet.
            </>
          )}
        </p>
      </section>

      {last && (
        <Link
          to="/learning/$"
          params={{ _splat: last.slug }}
          className="group mt-10 flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 transition-colors duration-200 hover:border-primary/40 hover:bg-card"
        >
          <span className="min-w-0">
            <span className="block text-xs text-muted-foreground">Continue where you left off</span>
            <span className="mt-0.5 line-clamp-2 text-[0.9375rem] text-foreground">
              {last.title}
            </span>
          </span>
          <ArrowRight
            aria-hidden
            className="size-4 shrink-0 text-primary transition-transform duration-200 ease-out group-hover:translate-x-0.5"
          />
        </Link>
      )}

      <ol aria-label="Roadmaps, in learning order" className="learning-path mt-16">
        {tracks.map((t, i) => {
          const yours = perTrack[i];
          return (
            <li
              key={t.slug}
              className="learning-step"
              data-started={yours.done > 0 ? "" : undefined}
              data-reached={i < reached ? "" : undefined}
            >
              <span className="learning-node" aria-hidden>
                <TrackMark logo={t.logo} className="size-5" />
              </span>
              <Link
                to="/learning/$"
                params={{ _splat: t.slug }}
                className="group -mx-4 block rounded-2xl px-4 py-4 transition-colors duration-200 hover:bg-card focus-visible:bg-card"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-reading text-xl font-semibold text-foreground">{t.title}</h2>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </div>
                <p className="mt-1.5 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {t.intro}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <ProgressBar
                    progress={yours}
                    label={`Your progress in ${t.title}`}
                    className="max-w-56 flex-1"
                  />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {countLabel(yours)}
                    <span className="mx-1.5 opacity-50">·</span>
                    {t.stages} {t.stages === 1 ? "section" : "sections"}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
