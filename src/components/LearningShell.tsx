import { Link } from "@tanstack/react-router";
import {
  Archive,
  ArrowLeft,
  Bean,
  Blocks,
  BookOpen,
  Bot,
  Brain,
  Calculator,
  ChartColumn,
  Coffee,
  Compass,
  Cookie,
  Database,
  Dna,
  FileLock,
  FlaskConical,
  Globe,
  Hammer,
  HardDrive,
  IdCard,
  KeyRound,
  Library,
  Link as LinkIcon,
  ListTree,
  Lock,
  Map as MapIcon,
  Microscope,
  Package,
  Plug,
  Puzzle,
  Radio,
  RefreshCw,
  Repeat,
  Rocket,
  Satellite,
  Settings2,
  Shield,
  Search,
  Sprout,
  Target,
  Ticket,
  TrafficCone,
  TreeDeciduous,
  WandSparkles,
  Waves,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Progress, TrackLogo } from "@/lib/learning";

/** Calm page frame for /learning. The `learning` class scopes its warmer palette. */
export function LearningShell({ children }: { children: ReactNode }) {
  return (
    <div className="learning min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft
              aria-hidden
              className="size-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
            />
            Amirali Abbasi
          </Link>
          <Link
            to="/learning"
            activeOptions={{ exact: true }}
            className="rounded-md text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary"
          >
            Learning
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-5 pt-12 pb-28 sm:px-8 sm:pt-16">{children}</main>
    </div>
  );
}

/** Thin, quiet progress bar. */
export function ProgressBar({
  progress,
  label,
  className = "",
}: {
  progress: Progress;
  label: string;
  className?: string;
}) {
  const value = progress.total ? (progress.done / progress.total) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={progress.total}
      aria-valuenow={progress.done}
      className={`h-1 overflow-hidden rounded-full bg-secondary ${className}`}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function TrackMark({
  logo,
  className = "size-5",
}: {
  logo: TrackLogo | null;
  className?: string;
}) {
  if (!logo) return <BookOpen aria-hidden className={className} />;
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={logo.title}
      className={`${className} fill-current`}
    >
      {/* A hairline stroke brings detailed marks (OpenJDK, PostgreSQL) up to the optical
          weight of the solid Spring marks; paint-order keeps solid shapes unchanged. */}
      <path
        d={logo.path}
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinejoin="round"
        paintOrder="stroke"
      />
    </svg>
  );
}

// Vault notes title themselves with an emoji; the site draws a line icon instead.
const TOPIC_ICONS: Record<string, LucideIcon> = {
  "🔐": Lock,
  "🔏": FileLock,
  "🔑": KeyRound,
  "💾": Database,
  "🗄️": Database,
  "🐘": Database,
  "🌱": Sprout,
  "🧪": FlaskConical,
  "🧩": Puzzle,
  "⚙️": Settings2,
  "🌐": Globe,
  "⚡": Zap,
  "🔍": Search,
  "🫘": Bean,
  "🗃️": Archive,
  "📊": ChartColumn,
  "🪄": WandSparkles,
  "🎟️": Ticket,
  "🔄": RefreshCw,
  "📚": Library,
  "🤖": Bot,
  "🧮": Calculator,
  "🌀": Waves,
  "🛡️": Shield,
  "🏗️": Hammer,
  "🪪": IdCard,
  "📦": Package,
  "🎯": Target,
  "📇": ListTree,
  "🛰️": Satellite,
  "🚦": TrafficCone,
  "🔬": Microscope,
  "🧭": Compass,
  "🍪": Cookie,
  "☕": Coffee,
  "🧠": Brain,
  "🔌": Plug,
  "🧱": Blocks,
  "🔗": LinkIcon,
  "🔁": Repeat,
  "🧬": Dna,
  "🌳": TreeDeciduous,
  "🧵": Workflow,
  "🚀": Rocket,
  "💽": HardDrive,
  "🗺️": MapIcon,
  "📡": Radio,
};

export function TopicIcon({ emoji, className = "size-5" }: { emoji: string; className?: string }) {
  const Icon = TOPIC_ICONS[emoji] ?? TOPIC_ICONS[emoji.replace(/\uFE0F/g, "")] ?? BookOpen;
  return <Icon aria-hidden className={className} strokeWidth={1.75} />;
}
