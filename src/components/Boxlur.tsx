import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * "Boxlur": click a tool icon, a box introduces the tool and the page behind it blurs.
 * To remove the feature: delete this file and unwrap <Boxlur> in routes/index.tsx.
 */
const INFO: Record<string, { title: string; text: string }> = {
  python: {
    title: "Python",
    text: "General-purpose language and my main tool for data work: pipelines, scripts, automation and analysis.",
  },
  postgresql: {
    title: "PostgreSQL",
    text: "Open-source relational database. Where I model star schemas and run analytical SQL.",
  },
  apacheairflow: {
    title: "Apache Airflow",
    text: "Workflow orchestrator. Pipelines are defined as Python DAGs, scheduled, retried and monitored.",
  },
  docker: {
    title: "Docker",
    text: "Containers that package an app with its dependencies, so it runs the same everywhere.",
  },
  git: {
    title: "Git",
    text: "Distributed version control. History, branches and review for every project.",
  },
  pandas: {
    title: "pandas",
    text: "Python library for tabular data: cleaning, joining, reshaping and exploring datasets.",
  },
  numpy: {
    title: "NumPy",
    text: "Fast n-dimensional arrays for Python, the base layer under most of the scientific stack.",
  },
  jupyter: {
    title: "Jupyter",
    text: "Interactive notebooks that mix code, output and notes. Good for exploration and sharing.",
  },
  scikitlearn: {
    title: "scikit-learn",
    text: "Classic machine learning in Python: preprocessing, models and evaluation in one consistent API.",
  },
  rust: {
    title: "Rust",
    text: "Fast, memory-safe systems language. Something I'm exploring for data tooling.",
  },
};

export function Boxlur({
  file,
  disabled,
  children,
}: {
  file: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const info = INFO[file];
  if (!info) return <>{children}</>;
  return (
    <Dialog>
      <DialogTrigger
        tabIndex={disabled ? -1 : undefined}
        aria-label={`About ${info.title}`}
        className="cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {children}
      </DialogTrigger>
      <DialogContent
        overlayClassName="bg-background/40 backdrop-blur-md"
        className="w-[calc(100%-2.5rem)] max-w-sm gap-3 rounded-2xl border-border bg-card p-6 text-center shadow-2xl sm:rounded-2xl sm:p-8"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-border bg-card dark:bg-[oklch(0.27_0.008_75)]">
          <img
            src={`/icons/${file}.svg`}
            data-icon={file}
            alt=""
            width={40}
            height={40}
            className="size-10"
          />
        </div>
        <DialogTitle className="font-display text-2xl font-normal tracking-tight">
          {info.title}
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
          {info.text}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
