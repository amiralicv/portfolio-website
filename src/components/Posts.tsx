import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Clock, FileText, Sprout } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import ThemeToggle from "@/components/ThemeToggle";
import {
  WRITING,
  formatDate,
  getMeta,
  listPosts,
  renderPost,
  type Meta,
  type Toc,
} from "@/lib/content";

const FOCUS = "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-300">
      {children}
      <footer className="border-t border-border">
        <div
          className={`mx-auto flex ${wide ? "max-w-5xl" : "max-w-3xl"} items-center justify-between px-5 py-6 text-xs text-muted-foreground sm:px-8`}
        >
          <span>© {new Date().getFullYear()} Amirali Abbasi</span>
          <a href="#top" className="transition-colors hover:text-foreground">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

/** Frosted sticky bar: back link on the left, theme switch on the right. Article pages add the reading-progress hairline on its lower edge. */
function StickyBar({
  to,
  label,
  wide = false,
  progress = false,
}: {
  to: "/" | "/writing";
  label: string;
  wide?: boolean;
  progress?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-background/95">
      <div
        className={`mx-auto flex h-14 items-center justify-between gap-4 px-5 sm:px-8 ${wide ? "max-w-5xl" : "max-w-3xl"}`}
      >
        <Link
          to={to}
          className={`group inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card/60 pr-4 pl-3 text-sm text-muted-foreground shadow-[0_1px_0_oklch(1_0_0/6%)_inset] transition-colors duration-200 hover:border-foreground/30 hover:text-foreground ${FOCUS}`}
        >
          <ArrowLeft
            className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
          {label}
        </Link>
        <ThemeToggle />
      </div>
      {progress && <ReadingProgress />}
    </header>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5 sm:gap-2">
      {tags.map((t) => (
        <li
          key={t}
          className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground sm:text-[11px]"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function Meta_({ post }: { post: Meta }) {
  return (
    <>
      {formatDate(post.date)}
      <span aria-hidden className="mx-2 text-primary">
        ·
      </span>
      <Clock aria-hidden className="mb-0.5 inline size-3" /> {post.minutes} min read
    </>
  );
}

function PostCard({ post }: { post: Meta }) {
  // Phone: icon, date and arrow share the top row, text runs full width below.
  // sm and up: icon in its own left column, arrow pinned top-right.
  const col2 = "col-span-3 sm:col-span-1 sm:col-start-2";
  return (
    <Link
      to="/writing/$slug"
      params={{ slug: post.slug }}
      className={`group lux relative mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-x-3 overflow-hidden rounded-xl border border-border bg-card p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 motion-reduce:transform-none max-sm:active:!transform-none sm:grid-cols-[auto_1fr] sm:items-start sm:gap-x-6 sm:p-7 ${FOCUS}`}
    >
      <div
        aria-hidden
        className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-primary/25 to-primary/5 text-primary ring-1 ring-primary/20 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none sm:row-span-4 sm:size-14 sm:rounded-xl"
      >
        <FileText className="size-[18px] sm:size-6" strokeWidth={1.5} />
      </div>
      <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase sm:self-center">
        <Meta_ post={post} />
      </p>
      <ArrowUpRight
        aria-hidden
        strokeWidth={1.25}
        className="size-5 text-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:absolute sm:top-7 sm:right-7 sm:size-7"
      />
      <h2
        className={`${col2} mt-4 font-display text-[1.6rem] leading-tight tracking-tight sm:mt-2 sm:pr-10 sm:text-3xl`}
      >
        {post.title}
      </h2>
      <p
        className={`${col2} mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base`}
      >
        {post.description}
      </p>
      <div className={`${col2} mt-4`}>
        <Tags tags={post.tags} />
      </div>
    </Link>
  );
}

export function PostsPage() {
  const posts = listPosts();
  return (
    <Shell>
      <StickyBar to="/" label="Home" />
      <main id="top" className="relative mx-auto max-w-3xl px-5 pt-10 pb-16 sm:px-8 sm:pt-16">
        <Reveal delay={80}>
          <h1 className="text-6xl leading-[0.95] font-normal tracking-tight sm:text-8xl">
            {WRITING.label}
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/80">
            {WRITING.blurb}
          </p>
        </Reveal>
        <div className="reveal-in animate-in fade-in mt-10 duration-500">
          {posts.length ? (
            posts.map((p) => <PostCard key={p.slug} post={p} />)
          ) : (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Sprout aria-hidden className="size-5" strokeWidth={1.5} />
              </span>
              <p className="font-display text-2xl">Nothing here yet.</p>
              <p className="text-sm text-muted-foreground">The first one is still growing.</p>
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}

/** Thin bar under the top edge that fills as the article scrolls. Writes the style directly: no re-render per scroll. */
function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      ref.current!.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);
  return (
    <div aria-hidden className="absolute inset-x-0 -bottom-px h-px">
      <div
        ref={ref}
        className="h-full origin-left scale-x-0 bg-primary shadow-[0_0_10px_var(--primary)]"
      />
    </div>
  );
}

function TocList({ items }: { items: Toc }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const onScroll = () => {
      let cur = "";
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (el && el.getBoundingClientRect().top < 140) cur = i.id;
      }
      setActive(cur);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [items]);
  return (
    <ol className="space-y-0.5 border-l border-border text-sm">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            aria-current={i.id === active ? "location" : undefined}
            className={`-ml-px block border-l-2 py-1 pr-2 pl-3 leading-snug transition-colors duration-200 ${FOCUS} ${
              i.id === active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {i.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function PostPage({ slug }: { slug: string }) {
  const meta = getMeta(slug);
  const post = renderPost(slug);
  if (!meta || !post) return null; // the route loader already 404s unknown slugs
  return (
    <Shell wide>
      <StickyBar to="/writing" label={WRITING.label} wide progress />
      <main id="top" className="relative mx-auto max-w-5xl px-5 pt-10 pb-16 sm:px-8 sm:pt-14">
        <header className="max-w-3xl">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
              <span className="grid size-7 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <FileText aria-hidden className="size-3.5" strokeWidth={1.75} />
              </span>
              {WRITING.label}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="mt-5 text-[2.5rem] leading-[1] font-normal tracking-tight text-balance sm:text-7xl">
              {meta.title}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
              {meta.description}
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full bg-primary/10 font-mono text-[11px] text-primary ring-1 ring-primary/20"
                >
                  AA
                </span>
                <span className="text-foreground">Amirali Abbasi</span>
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase">
                <Meta_ post={meta} />
              </span>
            </div>
            <div className="mt-5">
              <Tags tags={meta.tags} />
            </div>
          </Reveal>
        </header>

        <div className="mt-12 grid gap-12 border-t border-border pt-10 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="min-w-0">
            <details className="mb-8 rounded-xl border border-border bg-card p-4 lg:hidden">
              <summary
                className={`cursor-pointer font-mono text-[11px] tracking-[0.2em] uppercase ${FOCUS}`}
              >
                On this page
              </summary>
              <div className="mt-3">
                <TocList items={post.toc} />
              </div>
            </details>
            <article
              className="prose-article"
              // Own markdown, rendered by renderPost: trusted.
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                On this page
              </p>
              <TocList items={post.toc} />
            </div>
          </aside>
        </div>
      </main>
    </Shell>
  );
}
