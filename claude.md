# CLAUDE.md

Project context for Claude Code. Read this before making changes.

## What this is

Amsterdam Explorer — a browser-based 3D "meme toy": a playful low-poly
Amsterdam you run around in, full of classic Amsterdam gags (trams, bike
swarms, canals, red-light district). When friends join over multiplayer you
can shoot each other — chaos bonus, never serious or balanced. Works on
desktop and mobile. Personal website / portfolio piece, shipped as a static
site.

Tone: comedic and low-stakes (*Untitled Goose Game* / *Pico Park*), not a
calm exploration sim and not a competitive shooter.

## Status

In active development. The concept, current systems, and the keep/cut list
live in `docs/plan.md` — read that before adding features.

When unsure what to work on, ask. Cut features that fight the meme-toy
concept rather than piling more on.

## Stack

| Layer        | Tool                         | Notes                                  |
| ------------ | ---------------------------- | -------------------------------------- |
| Language     | TypeScript (strict)          | No `any` without justification         |
| UI framework | React 19 (+ React Compiler)  | Function components only               |
| App / router | TanStack Start + Router      | SSR + file-based routes; Nitro build   |
| Build        | Vite 8                       | Already configured                     |
| Package mgr  | pnpm                         | Not npm, not yarn                      |
| Styling      | Tailwind CSS 4               | Site shell + HUD                       |
| 3D           | three + @react-three/fiber 9 | R3F is the source of truth for scene   |
| 3D helpers   | @react-three/drei            | Use over hand-rolling where possible   |
| Physics      | @react-three/rapier 2        | Kinematic, not dynamic, for the player |
| Multiplayer  | Playroom Kit                 | Lobby, presence, state sync, RPC (p2p) |
| State        | Zustand                      | Gameplay + UI state — see below        |
| Analytics    | PostHog                      | Product analytics                      |

Versions pinned in `package.json`. If a version mismatch comes up,
flag it before installing.

## Folder conventions

```
src/
  game/           — anything that lives inside the <Canvas>
    Game.tsx      — top-level R3F scene
    Player.tsx, Gun.tsx, FollowCamera.tsx, *State.ts — player, camera, input
    hazards/      — bikes, trams, cars (spline-driven, damage the player)
    world/        — canal, houses, streets, bridges, props
    npcs/         — ambient life (rats, tourists, statiegeld collector)
    pickups/      — stroopwafel (health) pickups
    systems/      — scoring, canal damage, auto-respawn
    multiplayer/  — in-Canvas remote players, tracers, state sync
  multiplayer/    — Playroom provider, lobby, shared netcode state (NON-Canvas)
  routes/         — TanStack Start routes; the game mounts at `/`
  ui/             — HUD, overlays (regular React, NOT inside Canvas)
  components/     — site shell (Header, Footer, ThemeToggle)
  state/          — Zustand stores (useGameStore)
  hooks/          — shared React hooks (input, pointer lock, keybinds)
  lib/            — pure utilities (seo, profile)
  integrations/   — third-party providers (PostHog)
public/           — static assets (favicons, og-image, manifest)
docs/
  plan.md         — concept, current systems, keep/cut list
```

When creating a new file, match this layout. Don't dump components in `src/`
root or invent new top-level folders without asking. Note: all 3D geometry is
**procedural** (hand-built meshes in JSX) — there are no GLTF model files.

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
  - Gameplay state (score, health, kills/deaths, paused, multiplayer-joined)
    lives in Zustand. Death is never terminal — see `docs/plan.md`.
  - UI state (menus open, settings) lives in Zustand.

- **Physics**:
  - Player: `type="kinematicPosition"` + character controller. Never dynamic.
  - NPCs (bikes, trams, cars): kinematic, following splines. Not simulated.
  - Hazard hit detection: **manual AABB checks** against the shared
    `playerPosition` each frame — NOT Rapier sensor/intersection events.
    Kinematic-character-vs-sensor events don't fire reliably here.

- **Performance**:
  - Use `<Instances>` / `<Merged>` from Drei for repeated geometry.
  - Shadows only on player and large objects, not every prop.
  - LOD on distant buildings via Drei `<Detailed>`.
  - Frustum culling is on by default — don't disable it.

- **Loading**:
  - Geometry is procedural today, so there's little to load — the scene is
    already wrapped in `<Suspense>` in `Game.tsx`.
  - *If* you add a GLTF: Draco-compress it, put it under `public/`, load it
    with Drei's `useGLTF` inside `<Suspense>`, and `useGLTF.preload(url)` if
    it's critical.

## Commands

```bash
pnpm dev         # start dev server (port 3000)
pnpm build       # production build
pnpm preview     # preview the production build locally
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest (no test files yet)
```

Before committing, run `pnpm typecheck` and `pnpm build` and confirm both pass.

## What to ask about, not assume

- **Adding a new dependency.** Check `package.json` first; if it's not there,
  ask before installing.
- **Changing the folder structure.** It's intentional. Propose, don't refactor.
- **Switching from kinematic to dynamic physics for the player.** Don't.
  If something is broken, it's almost certainly fixable inside kinematic.
- **Putting per-frame state in Zustand.** Don't. Use refs.
- **Inlining large assets into the bundle.** If you add a GLTF, texture, or
  audio file, put it under `public/` — don't inline it.

## What to do without asking

- Fixing typos and obvious bugs.
- Writing tests for pure functions in `src/lib/`.
- Adding JSDoc to exported functions.
- Renaming local variables for clarity.

## Pointers

- Concept, current systems, keep/cut list: `docs/plan.md`
- This file: keep it short. If it grows past 200 lines, split.
