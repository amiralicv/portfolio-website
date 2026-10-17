# Data contracts

Static JSON the site reads at build time. Hand-edit, or generate it from a script/service.

## `projects.json`

Array of `{ section, title, description, tags[], repo }`.
`section` is a tab id on /projects (`data-engineering`, `backend`, `rust`, `ai`).

## `github.json`

`{ updated: ISO string, repos, stars, followers, languages: [{ name, percent }] }`.
`{}` hides the stats row. Anything with `updated` shows it.
