/**
 * Builds the /learning section from the Obsidian vault.
 *
 * The vault stays untouched: this script only reads it and writes two JSON
 * files under src/server/ that the site imports on the server.
 *
 *   bun run learning                   # vault path from VAULT_DIR (.env.local)
 *   VAULT_REPO=<git url> bun run learning   # or shallow-clone the vault repo
 *
 * Commit the generated JSON, then deploy as usual.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { Marked, type Tokens } from "marked";
import { createCssVariablesTheme, createHighlighter } from "shiki";
import {
  siHibernate,
  siOpenjdk,
  siPostgresql,
  siSpringboot,
  siSpringsecurity,
  type SimpleIcon,
} from "simple-icons";

// Private notes and folders that never reach the site. `publish: false` in a
// note's frontmatter does the same per note.
const EXCLUDE = new Set(["00 - Home"]);
const SKIP_DIRS = new Set([
  ".obsidian",
  ".trash",
  ".git",
  "99 - Templates",
  "06 - Java Data Engineering", // private
]);

const OUT_DIR = "src/server";

// Brand mark per track (drawn as a single SVG path on the site).
const TRACK_LOGO: Record<string, SimpleIcon> = {
  java: siOpenjdk,
  database: siPostgresql,
  "spring-boot": siSpringboot,
  "spring-data-jpa": siHibernate,
  "spring-security": siSpringsecurity,
};

// Card text where the vault's own intro speaks to Amirali rather than a visitor.
// A `description:` in the hub's frontmatter wins over this.
const TRACK_INTRO: Record<string, string> = {
  java: "Core Java concepts, plus a 690-question interview reference with answers, code and traps.",
};

function resolveVault(): string {
  if (process.env.VAULT_DIR) return process.env.VAULT_DIR;
  if (process.env.VAULT_REPO) {
    const dir = ".cache/vault";
    rmSync(dir, { recursive: true, force: true });
    execFileSync("git", ["clone", "--depth", "1", process.env.VAULT_REPO, dir], {
      stdio: "inherit",
    });
    return dir;
  }
  throw new Error("Set VAULT_DIR (path to the vault) or VAULT_REPO (git URL) in .env.local");
}

// ---------- read vault ----------

type Raw = {
  rel: string; // path without .md, forward slashes
  fm: Record<string, string>;
  body: string;
};

function walk(root: string, dir = root, out: Raw[] = []): Raw[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(root, full, out);
      continue;
    }
    if (!name.endsWith(".md")) continue;
    const rel = relative(root, full).split(sep).join("/").replace(/\.md$/, "");
    if (EXCLUDE.has(rel)) continue;
    const text = readFileSync(full, "utf8")
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n");
    const m = text.match(/^---\n([\s\S]*?)\n---\n/);
    const fm: Record<string, string> = {};
    for (const line of m?.[1].split("\n") ?? []) {
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
    }
    if (fm.publish === "false") continue;
    out.push({ rel, fm, body: m ? text.slice(m[0].length) : text });
  }
  return out;
}

// ---------- slugs ----------

const slugSeg = (s: string) =>
  s
    .replace(/^\d+\s*-\s*/, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isOverview = (rel: string) => rel.endsWith("/00 - Overview");
const folderOf = (rel: string) => rel.slice(0, rel.lastIndexOf("/"));

function slugFor(rel: string) {
  const segs = rel.split("/");
  if (isOverview(rel)) segs.pop();
  return segs.map(slugSeg).filter(Boolean).join("/");
}

/** Heading anchor ids. Wiki links to `#Heading` use the same function. */
const anchor = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;|&#\d+;/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

const EMOJI_RE = /^(\p{Extended_Pictographic}|\p{Regional_Indicator})+️?\s*/u;

// ---------- markdown clean-up ----------

// Sections the topic template creates. Dropped while still untouched, so the
// site only shows what was actually written.
const TEMPLATE_SECTIONS: Record<string, string> = {
  "📝 My Notes":
    "> [!note] ✍️ In your own words\n> What is it? Why does it exist? When should you **not** use it?",
  "💻 Code": "```java\n// minimal working example\n```",
  "⚠️ Gotchas & Traps": "-",
  "❓ Self-Test":
    "- [ ] I can explain this out loud in 2 minutes without notes\n- [ ] I wrote working code for it without copying",
  "🔗 Related": "-",
};
const EMPTY_CODE = /^```\w*\n\/\/ minimal working example\n```$/;

/** Splits a body into "## " sections so whole sections can be dropped or kept. */
function sections(body: string) {
  const parts: { heading: string | null; text: string }[] = [{ heading: null, text: "" }];
  let fence = false;
  for (const line of body.split("\n")) {
    if (line.startsWith("```")) fence = !fence;
    const m = !fence && line.match(/^## (.*)$/);
    if (m) parts.push({ heading: m[1].trim(), text: "" });
    else parts[parts.length - 1].text += line + "\n";
  }
  return parts;
}

const countBoxes = (text: string) => ({
  total: (text.match(/^\s*- \[[ xX]\]/gm) ?? []).length,
  done: (text.match(/^\s*- \[[xX]\]/gm) ?? []).length,
});

function cleanBody(body: string) {
  const kept = sections(body).filter(({ heading, text }) => {
    if (heading === "📊 Progress") return false;
    if (heading && heading in TEMPLATE_SECTIONS) {
      const t = text.trim();
      return t !== TEMPLATE_SECTIONS[heading] && !EMPTY_CODE.test(t);
    }
    return true;
  });
  let md = kept.map((p) => (p.heading ? `## ${p.heading}\n${p.text}` : p.text)).join("");
  // Obsidian-only blocks: navigation callouts and Bases queries.
  md = md.replace(/^> \[!abstract\] 🧭 Navigation\n(>.*\n?)*/gm, "");
  md = md.replace(/^> \[!tip\] 🎯 Rule\n(>.*\n?)*/gm, ""); // vault workflow note, meaningless to visitors
  // Obsidian tag lines ("Tags: #java #interview", or a bare "#java #moc") mean nothing on the site
  md = md.replace(/^(>[ \t]*)?(Tags:[ \t]*)?#[a-z][\w-]*([ \t]+#[a-z][\w-]*)*[ \t]*\n/gim, "");
  // "Create a note in `01 - Java/Core/` from the template" is an Obsidian chore, not content
  md = md.replace(/^Create a note in `[^`]+` from the .*\n/gm, "");
  // zero-padded numbers are Obsidian's file sorting; the site counts 1, 2, 3
  // (the concept map's "00" row is a companion, not a step, so it gets no number)
  md = md.replace(/^\|\s*0(\d)\s*\|/gm, (_all, d: string) => (d === "0" ? "| |" : `| ${d} |`));
  // The concept map's colour key is headed "Legend:", which on the site reads like the
  // Database "Legend" tier. It is a priority key, so call it that.
  md = md.replace(
    /^Legend: (?=🔴)(.*)$/m,
    (_all, key: string) =>
      `Priority: ${key
        .replace(/ = /g, " — ")
        .replace("important, learn after the basics", "learn after the basics")
        .replace("specialist / optional", "specialist")}`,
  );
  md = md.replace(/^```base\n[\s\S]*?^```\n?/gm, "");
  md = md.replace(/^```mermaid\n[\s\S]*?^```\n?/gm, "");
  return md;
}

// ---------- build ----------

const vault = resolveVault();
const raws = walk(vault);
const byRel = new Map(raws.map((r) => [r.rel, r]));
const byBase = new Map<string, string>();
for (const r of raws) byBase.set(r.rel.split("/").pop()!, r.rel);

const slugs = new Map<string, string>();
const taken = new Set<string>();
for (const r of raws) {
  let s = slugFor(r.rel);
  while (taken.has(s)) s += "-2";
  taken.add(s);
  slugs.set(r.rel, s);
}

const titles = new Map<string, string>();
for (const r of raws) {
  const h1 = r.body.match(/^# (.+)$/m)?.[1].trim();
  titles.set(
    r.rel,
    h1 ??
      r.rel
        .split("/")
        .pop()!
        .replace(/^\d+\s*-\s*/, ""),
  );
}

// Tickable items per note as the site shows them, rolled up into folder overviews.
// Amirali's own ticks are deliberately never read: the site shows only the reader's progress.
const ownItems = new Map(
  raws.map((r) => [r.rel, isOverview(r.rel) ? 0 : countBoxes(cleanBody(r.body)).total]),
);
function itemCount(rel: string) {
  if (!isOverview(rel)) return ownItems.get(rel)!;
  const folder = folderOf(rel) + "/";
  let total = 0;
  for (const r of raws) if (r.rel.startsWith(folder)) total += ownItems.get(r.rel)!;
  return total;
}

function resolveLink(target: string) {
  const t = target.trim();
  return byRel.has(t) ? t : byBase.get(t);
}

const href = (rel: string) => `/learning/${slugs.get(rel)}`;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Drawn icons for the few emoji that carry meaning (Lucide paths). Every other
// emoji is decoration and is dropped: the site uses real icons, not emoji.
const svg = (cls: string, label: string, paths: string) =>
  `<svg class="i ${cls}" viewBox="0 0 24 24" role="img" aria-label="${label}">${paths}</svg>`;
const MEANINGFUL: [RegExp, string][] = [
  [/✅|✔️?|☑️?/g, svg("i-yes", "Yes", '<path d="M20 6 9 17l-5-5"/>')],
  [/❌|✖️?/g, svg("i-no", "No", '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>')],
  [
    /⚠️?/g,
    svg(
      "i-warn",
      "Warning",
      '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    ),
  ],
  [
    /⭐️?/g,
    svg(
      "i-star",
      "Star",
      '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    ),
  ],
  // the concept map's priority legend
  [/🔴/g, '<span class="pri pri-core">Core</span>'],
  [/🟡/g, '<span class="pri pri-important">Important</span>'],
  [/🟢/g, '<span class="pri pri-optional">Optional</span>'],
];
const DECORATIVE_EMOJI =
  /(\p{Extended_Pictographic}|\p{Regional_Indicator})(️|‍\p{Extended_Pictographic})*\s?/gu;

// Inside tables the circles rank tiers (the Database overview: green Must Know,
// yellow Professional, red Legend), not the concept map's Core/Optional legend.
const TIER_LEVEL: Record<string, string> = { "🟢": "1", "🟡": "2", "🔴": "3" };

function replaceEmoji(text: string) {
  text = text.replace(/^\|.*$/gm, (row) => row.replace(/🟢|🟡|🔴/g, (c) => TIER_LEVEL[c]));
  for (const [re, html] of MEANINGFUL) text = text.replace(re, html);
  // keep the icon SVGs just inserted; strip everything else pictographic
  return text.replace(DECORATIVE_EMOJI, "");
}

const TOPIC_LINE = /^- (?:\S+ )?\[\[([^\]|#\\]+)[^\]|\\]*(?:\\?\|([^\]]*))?\]\] · `\d+\/\d+`\s*$/;

/** Overview link lists become one ordered topic list with live progress counts. */
function topicLists(md: string) {
  const out: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) out.push("", `<ol class="topic-list">\n${list.join("\n")}\n</ol>`, "");
    list = [];
  };
  for (const line of md.split("\n")) {
    const m = line.match(TOPIC_LINE);
    const rel = m && resolveLink(m[1]);
    if (!m || !rel) {
      flush();
      out.push(line);
      continue;
    }
    const total = itemCount(rel);
    const label = escapeHtml(replaceEmoji(m[2] ?? titles.get(rel)!).trim()).replace(
      /`([^`]+)`/g,
      "<code>$1</code>",
    );
    list.push(
      `<li><a href="${href(rel)}" data-slug="${slugs.get(rel)}"><span class="topic-title">${label}</span>` +
        `<span class="topic-count" data-total="${total}">0/${total}</span></a></li>`,
    );
  }
  flush();
  return out.join("\n");
}

function transformMarkdown(md: string) {
  // keep fenced code as-is; rewrite everything else
  return md
    .split(/(^```[\s\S]*?^```$)/m)
    .map((part, i) => {
      if (i % 2 === 1) return part;
      return replaceEmoji(
        topicLists(part)
          // wiki links -> markdown links
          .replace(
            /!?\[\[([^\]|#\\]*)(#[^\]|\\]*)?(?:\\?\|([^\]]*))?\]\]/g,
            (_all, target: string, hash = "", alias?: string) => {
              const label = (
                alias ??
                (target || hash.slice(1))
                  .split("/")
                  .pop()!
                  .replace(/^\d+\s*-\s*/, "")
              ).trim();
              if (!target) return `[${label}](#${anchor(hash.slice(1))})`;
              const rel = resolveLink(target);
              if (!rel) return label; // excluded or missing note: plain text
              return `[${label}](${href(rel)}${hash ? "#" + anchor(hash.slice(1)) : ""})`;
            },
          )
          // ==highlight==
          .replace(/==(\S(?:[^=\n]*\S)?)==/g, "<mark>$1</mark>"),
      );
    })
    .join("");
}

// Code colours come from CSS variables, so the theme lives with the site's
// palette in styles.css instead of in a bundled theme file.
const highlighter = await createHighlighter({
  themes: [createCssVariablesTheme({ name: "css-variables", variablePrefix: "--shiki-" })],
  langs: ["java", "sql", "bash", "json", "yaml", "xml", "properties", "python", "kotlin"],
});
const LANG_ALIAS: Record<string, string> = { sh: "bash", shell: "bash", yml: "yaml", py: "python" };

// Each checkbox gets its index so a visitor's ticks can be stored per note.
let boxIndex = 0;

// breaks: a single newline is a line break, as in Obsidian's default reading view
const marked = new Marked({ gfm: true, breaks: true });
marked.use({
  renderer: {
    // Every box starts unticked for every reader; the vault's own ticks are not published.
    // Disabled until the page hydrates, so an early tick is never silently lost. Attributes
    // are written the way the browser serializes them, so hydration compares equal.
    checkbox() {
      return `<input type="checkbox" disabled="" data-box="${boxIndex++}"> `;
    },
    code({ text, lang }: Tokens.Code) {
      const raw = (lang ?? "").split(/\s/)[0].toLowerCase();
      const name = LANG_ALIAS[raw] ?? raw;
      const known = highlighter.getLoadedLanguages().includes(name);
      // emoji in code comments ("— ✅ preferred") read fine without them
      const html = highlighter.codeToHtml(text.replace(DECORATIVE_EMOJI, ""), {
        lang: known ? name : "text",
        theme: "css-variables",
      });
      const label = known ? `<figcaption>${name}</figcaption>` : "";
      return `<figure class="code">${label}${html}</figure>\n`;
    },
    heading({ tokens, depth }: Tokens.Heading) {
      const html = this.parser.parseInline(tokens);
      return `<h${depth} id="${anchor(html)}">${html}</h${depth}>\n`;
    },
    // Obsidian callouts: > [!type]± Title  ->  styled box, or <details> when foldable
    blockquote({ tokens }: Tokens.Blockquote) {
      const body = this.parser.parse(tokens);
      const m = body.match(/^<p>\[!(\w+)\]([+-]?)[ \t]*([^\n]*?)(\n|<\/p>\n?)/);
      if (!m) return `<blockquote>${body}</blockquote>\n`;
      const [head, type, fold, title, end] = m;
      const rest = (end.startsWith("\n") ? "<p>" : "") + body.slice(head.length);
      const label = title.trim() || type.charAt(0).toUpperCase() + type.slice(1);
      const cls = `callout callout-${type.toLowerCase()}`;
      if (fold) {
        return `<details class="${cls}"${fold === "+" ? " open" : ""}><summary class="callout-title">${label}</summary><div class="callout-body">${rest}</div></details>\n`;
      }
      return `<div class="${cls}"><div class="callout-title">${label}</div><div class="callout-body">${rest}</div></div>\n`;
    },
  },
});

type Ref = { slug: string; title: string; emoji: string };
const ref = (rel: string): Ref => {
  const t = titles.get(rel)!;
  return {
    slug: slugs.get(rel)!,
    title: t.replace(EMOJI_RE, ""),
    emoji: t.match(EMOJI_RE)?.[0].trim() ?? "",
  };
};

function siblingsOf(rel: string): string[] {
  const numeric = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });
  if (isOverview(rel)) {
    const parent = folderOf(folderOf(rel));
    return raws
      .map((r) => r.rel)
      .filter(
        (x) =>
          isOverview(x) &&
          folderOf(folderOf(x)) === parent &&
          x.split("/").length === rel.split("/").length,
      )
      .sort(numeric);
  }
  const folder = folderOf(rel);
  return raws
    .map((r) => r.rel)
    .filter((x) => !isOverview(x) && x.includes("/") && folderOf(x) === folder)
    .sort(numeric);
}

function parentOf(rel: string): string | undefined {
  let folder = isOverview(rel) ? folderOf(folderOf(rel)) : folderOf(rel);
  while (folder) {
    if (byRel.has(`${folder}/00 - Overview`)) return `${folder}/00 - Overview`;
    if (!folder.includes("/")) break;
    folder = folderOf(folder);
  }
  return undefined;
}

const notes: Record<string, unknown> = {};
const boxes: Record<string, number> = {}; // tickable boxes per note, for visitor progress
for (const r of raws) {
  const title = titles.get(r.rel)!;
  const md = cleanBody(r.body).replace(/^# .+\n/m, "");
  boxIndex = 0;
  const html = marked.parse(transformMarkdown(md), { async: false }) as string;
  if (boxIndex) boxes[slugs.get(r.rel)!] = boxIndex;
  const sibs = siblingsOf(r.rel);
  const i = sibs.indexOf(r.rel);
  const crumbs: Ref[] = [];
  for (let p = parentOf(r.rel); p; p = parentOf(p)) crumbs.unshift(ref(p));
  notes[slugs.get(r.rel)!] = {
    slug: slugs.get(r.rel),
    title: title.replace(EMOJI_RE, ""),
    emoji: title.match(EMOJI_RE)?.[0].trim() ?? "",
    type: r.fm.type ?? "note",
    crumbs,
    prev: i > 0 ? ref(sibs[i - 1]) : null,
    next: i >= 0 && i < sibs.length - 1 ? ref(sibs[i + 1]) : null,
    html,
  };
}

// index: one card per top-level folder that has an overview
const tracks = raws
  .filter((r) => isOverview(r.rel) && r.rel.split("/").length === 2)
  .sort((a, b) => a.rel.localeCompare(b.rel, undefined, { numeric: true }))
  .map((r) => {
    const title = titles.get(r.rel)!;
    const clean = cleanBody(r.body);
    const intro =
      r.fm.description ||
      TRACK_INTRO[slugs.get(r.rel)!] ||
      clean.match(/> \[!info\][^\n]*\n> (.+)/)?.[1] ||
      clean.match(/^> (?!\[!)(.+)/m)?.[1] ||
      "";
    const children = siblingsOfFolder(folderOf(r.rel));
    return {
      slug: slugs.get(r.rel)!,
      title: title.replace(EMOJI_RE, ""),
      emoji: title.match(EMOJI_RE)?.[0].trim() ?? "",
      intro: replaceEmoji(
        intro.replace(/\*\*/g, "").replace(/\[\[[^\]|]*\|?([^\]]*)\]\]/g, "$1"),
      ).trim(),
      logo: logoFor(slugs.get(r.rel)!),
      stages: children.length,
    };
  });

function logoFor(trackSlug: string) {
  const icon = TRACK_LOGO[trackSlug];
  return icon ? { title: icon.title, path: icon.path } : null;
}

function siblingsOfFolder(folder: string) {
  return raws.filter((r) => isOverview(r.rel) && folderOf(folderOf(r.rel)) === folder);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, "learning-index.json"),
  JSON.stringify({
    tracks,
    boxes,
    slugs: Object.keys(notes),
    builtAt: new Date().toISOString(),
  }),
);
writeFileSync(join(OUT_DIR, "learning-notes.json"), JSON.stringify(notes));

const kb = (f: string) => Math.round(statSync(join(OUT_DIR, f)).size / 1024);
const items = Object.values(boxes).reduce((a, b) => a + b, 0);
console.log(`learning: ${raws.length} notes, ${tracks.length} tracks, ${items} tickable items`);
console.log(
  `  learning-index.json ${kb("learning-index.json")} KB, learning-notes.json ${kb("learning-notes.json")} KB`,
);
