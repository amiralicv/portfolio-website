import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LearningShell } from "@/components/LearningShell";
import { getLearningIndex } from "@/lib/learning";

// Reading faces for /learning only: Literata for long text, Figtree for interface.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Literata:ital,opsz,wght@0,7..72,400..600;1,7..72,400&display=swap";

export const Route = createFileRoute("/learning")({
  // The index (tracks, box counts) is small and changes only on deploy:
  // load it once and reuse it while moving between notes.
  loader: () => getLearningIndex(),
  staleTime: Infinity,
  head: () => ({ links: [{ rel: "stylesheet", href: FONTS }] }),
  component: () => (
    <LearningShell>
      <Outlet />
    </LearningShell>
  ),
});
