import { Marked } from "marked";

export type Toc = { id: string; text: string }[];
export type Meta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  minutes: number;
};

export const WRITING = {
  label: "Writing",
  blurb: "Notes and longer write-ups on data engineering, with sources.",
};

// Posts are markdown files in src/content with a small `key: value` header (title,
// description, date, tags). Drop a file in, rebuild, done.
// ponytail: all posts ship in the client bundle; move to server-only loading if the folder gets big.
const files = import.meta.glob("/src/content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const posts = Object.entries(files)
  .map(([path, src]) => {
    const [, head, body] = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)!;
    const f = Object.fromEntries(
      head
        .split("\n")
        .map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim()]),
    );
    const meta: Meta = {
      slug: path.split("/").pop()!.replace(/\.md$/, ""),
      title: f.title,
      description: f.description,
      date: f.date,
      tags: f.tags ? f.tags.split(",").map((t) => t.trim()) : [],
      minutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
    };
    return { meta, body };
  })
  .sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export const listPosts = () => posts.map((p) => p.meta);

export const getMeta = (slug: string) => posts.find((p) => p.meta.slug === slug)?.meta;

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

const decode = (s: string) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const cache = new Map<string, { html: string; toc: Toc }>();

// Markdown to HTML (own content, so trusted). Adds heading ids, a table-of-contents of the h2s,
// scrollable table wrappers, and hooks for the Evidence / Sources paragraphs.
export function renderPost(slug: string) {
  const hit = cache.get(slug);
  if (hit) return hit;
  const post = posts.find((p) => p.meta.slug === slug);
  if (!post) return undefined;

  const toc: Toc = [];
  const seen = new Map<string, number>();
  const html = (new Marked().parse(post.body, { async: false }) as string)
    .replace(/<h([2-4])>(.*?)<\/h\1>/g, (_, d: string, inner: string) => {
      const text = decode(inner.replace(/<[^>]+>/g, ""));
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const n = seen.get(id) ?? 0;
      seen.set(id, n + 1);
      if (n) id += `-${n}`;
      if (d === "2") toc.push({ id, text });
      return `<h${d} id="${id}">${inner}</h${d}>`;
    })
    .replace(/<table>/g, '<div class="tbl"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<p>(?=<strong>Evidence:)/g, '<p class="evidence">')
    .replace(/<p>(?=Sources?:)/g, '<p class="src">')
    .replace(/<a href="http/g, '<a target="_blank" rel="noreferrer noopener" href="http');

  const out = { html, toc };
  cache.set(slug, out);
  return out;
}
