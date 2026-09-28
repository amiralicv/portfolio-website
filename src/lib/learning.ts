import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export type LearningRef = { slug: string; title: string; emoji: string };
export type Progress = { done: number; total: number };

// Only the reader's own progress exists on the site (per browser). Amirali's
// ticks in his vault are never published.
export type LearningNote = LearningRef & {
  type: string;
  crumbs: LearningRef[];
  prev: LearningRef | null;
  next: LearningRef | null;
  html: string;
};

export type TrackLogo = { title: string; path: string };

export type LearningTrack = LearningRef & { intro: string; stages: number; logo: TrackLogo | null };

export type LearningIndex = {
  tracks: LearningTrack[];
  /** tickable boxes per note slug */
  boxes: Record<string, number>;
  slugs: string[];
  builtAt: string;
};

// The JSON is imported inside the handlers, so it stays in the server bundle
// and the browser only ever receives the one note it asked for.
export const getLearningIndex = createServerFn({ method: "GET" }).handler(async () => {
  const { default: index } = await import("@/server/learning-index.json");
  return index as LearningIndex;
});

export const getLearningNote = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    const { default: notes } = await import("@/server/learning-notes.json");
    const note = notes[data] as LearningNote | undefined;
    if (!note) throw notFound();
    return note;
  });

export const percent = ({ done, total }: Progress) =>
  total ? Math.round((done / total) * 100) : 0;
