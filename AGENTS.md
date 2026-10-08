# AGENTS.md

This file provides guidance for coding agents when working with the Artcraft monorepo.

## Personal Branch Rules (使用者個人分支規則)

- This checkout is for the user's personal changes. Work on `personal/zh-tw`
  for the Traditional Chinese language-switching feature; keep `main` unchanged.
- 本分支的主要功能是讓 Artcraft 能切換成繁體中文（`zh-TW`），並保留英文選項。
- Do not push to the original author's repository (`storytold/artcraft`), modify
  its branches, or create pull requests, issues, comments, releases, or other
  remote writes there. Do not submit this personal work to the original author.
- Never run `gh pr create` or any equivalent PR-creation action against the
  original author's repository, even as part of a default completion workflow.
- `origin` is the user's fork (`jamesliu69/artcraft`), the destination for
  explicitly requested personal-branch pushes.
- `upstream` is the original author's repository (`storytold/artcraft`),
  available for read-only fetches. Its local push URL is intentionally set to
  `DISABLED`; do not remove or bypass this protection.
- Keep changes and commits local unless the user explicitly requests a push to
  a repository they own. Before any such push, verify that the destination is
  the user's repository and not the original author's repository.
- Preserve existing untracked and ignored files, including the local
  `artcraft/` directory. Do not stage unrelated files.

## Project Overview

Artcraft is a public-facing Tauri desktop app for generating AI images and video.
It uses Rust and TypeScript. Backend services, company tooling, and website builds
live in the separate `artcraft-services` repository.

## Project Structure

```
artcraft/
├── _database/sql/artcraft_migrations/  # Embedded SQLite task database migrations
├── .sqlx/                             # SQLite query metadata for offline builds
├── crates/
│   ├── desktop/artcraft/              # Tauri app, configuration, capabilities, icons
│   ├── api_clients/                  # Desktop provider clients and shared API types
│   ├── lib/                          # Desktop support libraries
│   ├── schema/database/sqlite_tasks/ # Desktop task persistence
│   ├── schema/public/                # Shared wire-format enums and identifiers
│   ├── testing/                      # Shared test helpers
│   └── vendor/tauri-plugin-http/      # HTTP plugin fork with cookie access
├── frontend/
│   ├── apps/artcraft/                # Tauri app frontend and public resources
│   └── libs/                         # Shared frontend libraries
├── script/artcraft/                  # Desktop development and build scripts
├── test_data/                        # Fixtures used by retained crate tests
└── Cargo.toml                        # Desktop dependency workspace
```

Keep `external/` and `secrets/` untouched. Repository pruning must preserve
untracked and ignored local files; delete only Git-tracked paths unless the user
explicitly authorizes a cache cleanup.

## Code Style

- Rust with no minimum supported version
- SQLx for SQLite; prefer `sqlx::query!` / `sqlx::query_as!` compile-time checked macros over runtime `sqlx::query()` whenever possible
- A mix of wreq and reqwest for Rust HTTP clients
- Never use `println!` or `eprintln!` outside of tests; use `log` crate macros instead
- When two crates export the same type name, alias imports with a suffix: `use foo::Bar as BarFoo;`
- Prefer `use` imports over inline fully-qualified paths; only qualify inline for true one-offs or std collisions
- TypeScript with Nx, React, Vite, Zustand, and Three.js
- Use two spaces for indentation
- Each Tauri command belongs in its own file module, named after the command. Keep shared state, types, and helpers in separate support modules; see the [Storyteller command conventions](crates/desktop/artcraft/src/services/storyteller/commands/AGENTS.md).

### File Layout

Organize for top-to-bottom reading. Important things first, details later.

- **Constants** at the top (after imports)
- **Structs/enums** next; outer structs above inner sub-structs
- **API types** in order: Request, Response, Error
- **In impl blocks**: constructors first, then public methods, then private helpers
- Private helpers go *below* the methods that call them
- Among helpers: meatier logic above leaf-level formatters
- **In test modules**: constants first, then test cases (grouped into sub-modules when 2+), then helper functions last

## Markdown

- **Tables must be space-padded so columns align in plain text.** Markdown
  tables are read raw (terminals, diffs, editors) at least as often as
  rendered, and condensed tables are unreadable there. Pad every cell to its
  column width:

  ```markdown
  | Model        | Configuration | Credits    | Speed | Score   |
  |--------------|---------------|--------------------|---------|
  | Meshy 6      | text or image | 104        | 80.0  | +24     |
  | Rodin 2.5    | text or image | 13         | 10.0  | +3      |
  ```

  Not: `| Model | Configuration | Credits | Speed | Score |` packed tight
  with varying widths per row.
