# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Amirali (owner):** a Java backend engineer in Tehran. He studies from his own Obsidian vault and uses `/learning` as a calm place to read his roadmaps on any device.
- **Visitors:** anyone who wants to follow the same roadmaps. Each visitor tracks only their own progress, privately, per browser.
- **Portfolio visitors:** recruiters and engineers who land on the home page (`/`) to judge his experience and projects.

## Product Purpose

A personal portfolio (`/`) plus a learning section (`/learning`) published from Amirali's Obsidian vault. The learning section turns roadmaps into readable notes with checklists. Success: reading feels relaxed rather than overwhelming, and any reader can see what to read next and how far they have come.

## Positioning

The roadmaps are Amirali's real study vault, published as he goes, and not a course written for an audience. His own ticks stay in Obsidian and are never shown on the site.

## Operating Context

- Amirali writes and ticks items in Obsidian, pushes the vault to git, then runs `bun run learning` in this repo to regenerate `src/server/learning-*.json`, commits and deploys.
- Tracks, in learning order: Java, Database (SQL & PostgreSQL), Spring Boot, Spring Data JPA, Spring Security.
- Visitors' progress is stored per browser, in localStorage. There are no accounts and no server-side storage yet.

## Capabilities and Constraints

- Stack: TanStack Start (React 19), Vite, Tailwind v4, Bun, deployed to Cloudflare Workers through Nitro.
- Note HTML is prerendered at build time. Only the requested note is sent to the browser.
- The folder `06 - Java Data Engineering` and `00 - Home` are private and must never be published.
- The Obsidian vault is read-only for the site. Its ticks and `status` fields are not published.
- Open decision: accounts or cross-device sync for visitor progress (not built).

## Brand Commitments

- The home page's world is a black ground with a Spring-leaf green accent, Space Grotesk / DM Sans / JetBrains Mono.
- `/learning` stays in the same family but calmer. Requested by the owner: warm, relaxing reading fonts; technology logos instead of emoji; code highlighting that matches the theme; ordered, tidy track list; nothing overwhelming.

## Evidence on Hand

- 384 published notes across 5 tracks, from the vault at `C:\Users\amirali\Documents\obsidian\Softwre Engineer`.
- No testimonials, learner counts or metrics exist. Do not invent any.

## Product Principles

1. Calm over clever: one idea per screen region, generous space, no noise.
2. Always show where you are and what comes next.
3. Progress belongs to the reader alone: only the visitor's own ticks appear, and Amirali's are never published.
4. Publish only what is real; private folders never leak.
