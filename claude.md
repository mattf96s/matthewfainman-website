# CLAUDE.md

Project context for Claude Code. Read this before making changes.

## What this is

Amsterdam Explorer — a browser-based 3D exploration game set in a stylised
low-poly Amsterdam. Player walks on foot; hazards are cyclists and trams.
Personal website / portfolio piece. Shipped as a static site.

## Status

In active development. Built in phases.

- Phase 1 (movement skeleton) — see `docs/phase-1.md`
- Full plan — see `docs/plan.md`

When unsure what to work on, ask. Don't jump ahead to later phases without
being told.

## Stack

| Layer       | Tool                         | Notes                                  |
| ----------- | ---------------------------- | -------------------------------------- |
| Language    | TypeScript (strict)          | No `any` without justification         |
| Framework   | React 19                     | Function components only               |
| Build       | Vite                         | Already configured                     |
| Package mgr | pnpm                         | Not npm, not yarn                      |
| 3D          | three + @react-three/fiber 9 | R3F is the source of truth for scene   |
| 3D helpers  | @react-three/drei            | Use over hand-rolling where possible   |
| Physics     | @react-three/rapier 2        | Kinematic, not dynamic, for the player |
| State       | Zustand                      | Gameplay state only — see below        |

Versions pinned in `package.json`. If a version mismatch comes up,
flag it before installing.

## Folder conventions

```
src/
  game/         — anything that lives inside the <Canvas>
    player/     — player controller, input
    hazards/    — bike, tram, canal logic
    world/      — terrain, buildings, props
    systems/    — scoring, lives, near-miss detection
    Game.tsx    — top-level R3F scene
  scene/        — composition of game components
  ui/           — HUD, menus, screens (regular React, NOT inside Canvas)
  state/        — Zustand stores
  hooks/        — shared React hooks
  lib/          — pure utilities (math, splines, OSM parsers)
  assets/       — GLTFs, textures, audio (small things; large via public/)
public/
  models/       — large GLTF files (Draco-compressed)
  audio/        — sound effects, music
docs/
  plan.md
  phase-N.md
```

When creating a new file, match this layout. Don't dump components in `src/`
root or invent new top-level folders without asking.

## Coding conventions

- **TypeScript strict mode.** Treat `any` as a smell; use `unknown` + narrowing.
- **Named exports** over default exports, except for lazy-loaded route entries.
- **One component per file**, named the same as the file.
- **Props interfaces** at the top of the file, named `${Component}Props`.
- **No prop drilling deeper than 2 levels** — reach for Zustand or context.
- **Vectors and math objects**: reuse refs inside `useFrame` to avoid GC pressure.
  Don't allocate `new THREE.Vector3()` per frame.
- **Comments** explain *why*, not *what*. The code already says what.

## R3F / Three.js principles

- **Scene state vs UI state are separate.**
  - Per-frame state (positions, velocities, animation time) lives in refs
    inside R3F components. Never in Zustand. Zustand updates trigger React
    re-renders and will kill frame rate.
  - Gameplay state (score, lives, current zone, paused) lives in Zustand.
  - UI state (menus open, settings) lives in Zustand.

- **Physics**:
  - Player: `type="kinematicPosition"` + character controller. Never dynamic.
  - NPCs (bikes, trams): kinematic, following splines. Not simulated.
  - Triggers (canal, hazard zones): sensor colliders, no contact response.

- **Performance**:
  - Use `<Instances>` / `<Merged>` from Drei for repeated geometry.
  - Shadows only on player and large objects, not every prop.
  - LOD on distant buildings via Drei `<Detailed>`.
  - Frustum culling is on by default — don't disable it.

- **Loading**:
  - All asset-loading components inside `<Suspense>`.
  - Use Drei's `useGLTF` with Draco-compressed models.
  - Preload critical models with `useGLTF.preload(url)`.

## Commands

```bash
pnpm dev         # start dev server
pnpm build       # production build
pnpm preview     # preview the production build locally
pnpm typecheck   # tsc --noEmit
pnpm lint        # if configured
pnpm test        # vitest, if configured
```

Before committing, run `pnpm typecheck` and `pnpm build` and confirm both pass.

## What to ask about, not assume

- **Adding a new dependency.** Check `package.json` first; if it's not there,
  ask before installing.
- **Changing the folder structure.** It's intentional. Propose, don't refactor.
- **Switching from kinematic to dynamic physics for the player.** Don't.
  If something is broken, it's almost certainly fixable inside kinematic.
- **Putting per-frame state in Zustand.** Don't. Use refs.
- **Inlining large GLTFs into the bundle.** Put them in `public/models/`.

## What to do without asking

- Fixing typos and obvious bugs.
- Writing tests for pure functions in `src/lib/`.
- Adding JSDoc to exported functions.
- Renaming local variables for clarity.

## Pointers

- Project plan: `docs/plan.md`
- Current phase: `docs/phase-1.md`
- This file: keep it short. If it grows past 200 lines, split.
