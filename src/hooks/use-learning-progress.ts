import { useEffect, useState, useSyncExternalStore } from "react";
import type { Progress } from "@/lib/learning";

/**
 * A visitor's own ticks, per note, kept in this browser only.
 * { "<note slug>": [indexes of ticked boxes] }
 */
type Ticks = Record<string, number[]>;

const KEY = "learning-progress-v1";
const LAST_KEY = "learning-last-v1";
const EMPTY: Ticks = {};

let cache: Ticks | null = null;
const listeners = new Set<() => void>();

function read(): Ticks {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    cache = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    cache = {};
  }
  return cache!;
}

function write(next: Ticks) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode or full storage: progress still works for this visit
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    cache = null; // another tab changed it
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTicks(): Ticks {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function setTick(slug: string, index: number, on: boolean) {
  const current = new Set(read()[slug] ?? []);
  if (on) current.add(index);
  else current.delete(index);
  const next = { ...read() };
  if (current.size) next[slug] = [...current].sort((a, b) => a - b);
  else delete next[slug];
  write(next);
}

/** Progress over every note whose slug is `prefix` or lives under it ("" = everything). */
export function progressUnder(
  ticks: Ticks,
  boxes: Record<string, number>,
  prefix: string,
): Progress {
  let done = 0;
  let total = 0;
  for (const [slug, count] of Object.entries(boxes)) {
    if (prefix && slug !== prefix && !slug.startsWith(prefix + "/")) continue;
    total += count;
    done += Math.min(ticks[slug]?.length ?? 0, count);
  }
  return { done, total };
}

type LastVisited = { slug: string; title: string };

export function rememberVisit(visit: LastVisited) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(visit));
  } catch {
    // not worth surfacing
  }
}

/** Read after mount so server and first client render agree. */
export function useLastVisited(): LastVisited | null {
  const [last, setLast] = useState<LastVisited | null>(null);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(LAST_KEY) ?? "null");
      if (v?.slug && v?.title) setLast(v);
    } catch {
      // ignore
    }
  }, []);
  return last;
}
