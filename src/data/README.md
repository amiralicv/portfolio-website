# Data contracts

Static data the site reads at build time. Hand-edit, or generate it from a script/service.

## `projects.ts`

Typed array of `{ topic, title, description, tech[], url, status?, date }`. `topic` is free text.
The /projects page lists them newest first by `date`.

## `github.json`

`{ updated: ISO string, repos, stars, followers, languages: [{ name, percent }] }`.
`{}` hides the stats row. Anything with `updated` shows it.
