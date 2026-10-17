import raw from "@/data/github.json";

type Stats = {
  updated?: string;
  repos?: number;
  stars?: number;
  followers?: number;
  languages?: { name: string; percent: number }[];
};
const stats = raw as Stats;

/** Renders only when src/data/github.json has been filled (by hand or by the Rust service). */
export default function GithubStats() {
  if (!stats.updated) return null;
  const items = [
    ["Repos", stats.repos],
    ["Stars", stats.stars],
    ["Followers", stats.followers],
  ].filter(([, v]) => v != null);
  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-4 sm:p-6">
      <dl className="flex gap-8">
        {items.map(([k, v]) => (
          <div key={k as string}>
            <dd className="font-display text-3xl">{v}</dd>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {k}
            </dt>
          </div>
        ))}
      </dl>
      {stats.languages?.length ? (
        <>
          <div className="mt-5 flex h-1.5 overflow-hidden rounded-full bg-muted">
            {stats.languages.map((l, i) => (
              <span
                key={l.name}
                title={`${l.name} ${l.percent}%`}
                style={{ width: `${l.percent}%`, opacity: 1 - i * 0.18 }}
                className="bg-primary"
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[10px] tracking-wide text-muted-foreground">
            {stats.languages.map((l) => `${l.name} ${l.percent}%`).join(" · ")}
          </p>
        </>
      ) : null}
    </div>
  );
}
