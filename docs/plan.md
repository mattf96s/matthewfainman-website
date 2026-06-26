# Amsterdam — Project Brief

A browser-based 3D toy: a stylised, slightly chaotic low-poly Amsterdam you
run around in. Solo, it's a charming city full of recognisable Amsterdam gags.
With friends, it's a silly free-for-all where you can shoot each other.
Built as a personal website / portfolio piece.

> **Working title:** Amsterdam Explorer. Tone may warrant a punchier name later.

---

## Concept (the north star)

**"Amsterdam, the toy."** A playful, meme-y interpretation of Amsterdam — not
a serious game, not a competitive shooter, not a realistic sim. The *place* is
the star: trams that will flatten you, swarms of bikes, canals to fall in, the
red-light district, Panado health drops, the statiegeld bottle-collector, rats.
Shooting other players is the **chaos bonus** that kicks in when friends join —
it is not the point and is never meant to be balanced or fair.

Tone reference: *Untitled Goose Game* / *Pico Park* energy — comedic,
low-stakes, instantly shareable. Closer to a 90-second "send this to your mates"
toy than to a game you grind. Aesthetic: flat-shaded geometry, warm palette,
soft shadows.

**Every decision serves one question: is this delightful in the first 90
seconds, and do you want to send the link to a friend?**

## Goals

- Ships as a personal website (works at the root domain, no install, no account)
- **Joyful in the first 15 seconds** — drop straight in, no menus, immediately fun
- **Frictionless multiplayer** — one shareable link, one click to join, instant chaos
- **Works on a phone** — memes spread on mobile; touch controls are first-class
- Loads in under 5 seconds; holds 60fps on a 2020+ integrated GPU
- Dense with recognisable Amsterdam gags — flavour over technical depth
- Coherent and *finished*. A small delightful toy beats a sprawling half-thing.

## Non-goals

- **Competitive balance / anti-cheat.** PvP is for laughs. p2p trust is fine.
- **A serious game loop.** No hard game-over, no grind, no progression.
- Photo-realistic Amsterdam (recognisable-funny, not accurate)
- A full city — one dense, characterful neighbourhood beats the whole centrum
- Hostile AI / bots — NPCs are flavour, not enemies

---

## Current state (what's already built)

This is well past a prototype. What works today:

- **World** — one densely-composed Amsterdam block: canal + bridges, canal
  houses, shops (incl. red-light windows), tram tracks, fietspad, parked
  bikes/cars, props, ambient boats & ducks. (`src/game/world/`)
- **Player** — kinematic character controller, third-person follow camera,
  pointer-lock, jump, knockback, randomised respawn points spread over both
  banks. (`src/game/Player.tsx`, `FollowCamera.tsx`, `spawnPoints.ts`)
- **Hazards** — trams, cars, bikes on splines that damage/knock-back the
  player, with near-miss bonus scoring. (`src/game/hazards/`)
- **Combat** — two weapons: hitscan gun (tracers, recoil, camera shake) and
  a melee sword. The sword is short-range (~1.3m, true hugging distance) so
  the overhead chop visibly sweeps through whoever it hits — no crosshair,
  no aiming-from-afar; it hits everyone in a tight frontal arc and lands the
  blow at the strike frame of the swing. Hits harder than the gun because
  you must close distance. Switch with `1`/`2`, Tab or mouse wheel on
  desktop, the weapon chip above FIRE on touch; remote avatars show whichever
  weapon a player holds. Lethality is tuned forgiving — passive regen
  (3 hp/s after 5 s without damage) means only sustained bad luck kills.
  (`src/game/Gun.tsx`, `Sword.tsx`, `src/game/systems/HealthRegen.tsx`)
- **Multiplayer** — Playroom Kit, up to 8 players, position/health sync at
  ~20Hz, p2p shot RPCs, kill/death tracking, kill-feed,
  custom player names (localStorage-persisted). You're always the
  terracotta hotdog on your own screen; other players get id-derived
  colours from a palette that excludes it. Players whose snapshot stream stalls
  (backgrounded tab) hide after 5s instead of freezing as shootable
  statues; deaths/respawns push event-driven snapshots that work while
  hidden. (`src/multiplayer/`, `src/game/multiplayer/`)
- **Mobile** — virtual joystick (move), touch-look, drag-to-aim FIRE
  button (hold to shoot, drag the same thumb to aim — the standard
  mobile-shooter scheme), tap-to-swap weapon chip above FIRE, fatter
  touch hitboxes. The phone HUD is kept deliberately sparse so a small
  screen isn't overwhelming: no FPS readout, no social credit under the
  thumbs, the "online" pill hidden until someone else joins, and health
  moved out of the joystick's corner up to a slim top-left bar.
  (`src/game/mobileInput.ts`, `src/ui/HUD.tsx`)
- **Pickups** — Panado bottle = health. (`src/game/pickups/`)
- **Minimap** — top-right HUD map: street layout, peers, active health drop. (`src/ui/Minimap.tsx`)
- **Ambient NPCs** — rats, tourists, statiegeld collector. (`src/game/npcs/`)
- **Audio** — procedural sfx engine + looping Leidsestraat street ambience
  (CC0 field recording, gapless Web Audio loop), one shared mute toggle.
  (`src/lib/sfx.ts`, `public/audio/`)
- **Perf** — shadow casters limited to large/identity objects; the
  directional sun is static so its 512² shadow map is re-rendered on a
  ~30 Hz timer rather than every frame (skips the whole shadow pass on
  most frames). Touch devices skip the shadow pass and MSAA entirely and
  render at lower dpr (phones were running hot). The render loop
  hard-stops while the tab is hidden (`frameloop="never"`, driven from
  Game; the audio engine suspends on the same event) so a backgrounded
  tab costs ~0 CPU instead of pinning a core. Budgets enforced in CI.
  (`src/game/Game.tsx`, `src/game/FrameloopGovernor.tsx`,
  `src/game/ShadowThrottle.tsx`)
- **Tests** — vitest for pure logic (`src/lib/*.test.ts`); Playwright
  E2E + perf budgets against the production build via a `?e2e` test API.
  Deterministic metrics, not fps: draw calls / triangles / geometry
  plateaus (GPU) plus a per-frame `useFrame`-callback cap and an
  idle-tab render-stop assertion (CPU). `?room=` isolates test rooms
  from real visitors.
  (`e2e/`, `src/game/TestApiBridge.tsx`, `.github/workflows/ci.yml`)
- **Shell** — TanStack Start app, game is the homepage, HUD, PostHog wired.

## What to absolutely nail (in priority order)

1. **The first 15 seconds.** Drop the player straight into a living Amsterdam —
   no title gate, controls obvious instantly, something funny happening on
   screen (a tram, a bike swarm) within seconds.
2. **The join flow.** "Send link → friend clicks → they're in your world
   shooting at you" must be one frictionless path. This is the viral loop.
   Shareable room URL, no accounts.
3. **Density of Amsterdam gags.** The "I see what they did there" hits: tram
   terror, bike swarms, falling in the canal, red-light neon, Panado drops,
   the statiegeld guy, coffeeshop signage, Amsterdammertje bollards. More
   recognisable detail = more meme.
4. **Toy-like forgiveness.** No punishing game-over. Die → respawn instantly →
   keep messing around. It's a playground.
5. **Polish where it's seen; cut everything else.** One coherent vibe, no
   leftover scaffolding, no dead weight in the bundle.
6. **The "about this build" page.** Where you articulate the stack and the
   decisions (incl. *why p2p netcode is fine for a meme*). This is where the
   portfolio piece demonstrates product + systems judgment, not just output.

## Keep / cut / repurpose (from the systems audit)

**Keep — these ARE the meme:**
- Trams, bikes, cars as hazards (the comedy of Amsterdam traffic)
- Near-miss scoring ("you survived a tram")
- Ambient NPCs — rats, tourists, statiegeld collector, ducks, boats
- Red-light district windows (stylised neon gag, kept light/tasteful)
- Mobile controls (first-class now — memes spread on phones)
- Combat, multiplayer, kill-feed (the chaos bonus)

**Soften:**
- Hard single-player game-over on death → always instant respawn
- The two divergent tram behaviours (`Tram` knockback vs `PathTram`
  instant-kill) → unify so nothing insta-gibs you

**Cut — orphaned boilerplate / dead weight (true under any concept):**
- `/demo/posthog` route and the "Demos" nav dropdown
- "TanStack Docs" nav link, TanStack devtools in production
- `src/components/amsterdan-illustration.tsx` (~5k-line SVG, unused in game) —
  delete or lazy-load off the game bundle

**Repurpose (optional, later):**
- Panado pickup → add ammo / fun power-up variants
- PostHog → instrument the fun (joins, kills, falls-in-canal, session length)

---

## Tech Stack (as built)

**Core:**
- **Vite** — build tool, dev server
- **TypeScript** — strict mode
- **React 19** (+ React Compiler) — function components only
- **TanStack Start / Router** — app shell, routing, SSR
- **React Three Fiber** + **drei** — Three.js scene graph & helpers
- **@react-three/rapier** — physics (kinematic player, kinematic NPCs)
- **Zustand** — gameplay & UI state (never per-frame state)
- **Tailwind CSS 4** — HUD / shell styling

**Multiplayer & data:**
- **Playroom Kit** — lobby, presence, state sync, RPC (p2p, no server auth)
- **PostHog** — product analytics

**Deploy:**
- **Vercel** — static/SSR hosting. pnpm 11 pinned via `packageManager`;
  some deps need explicit build-script allow-listing or install fails.

---

## Architecture Notes (still true)

**State management:**
- Gameplay state (score, health, kills, paused) in Zustand
- Per-frame transient state (positions, velocities, animation time) in R3F
  refs — never Zustand (re-renders kill frame rate)
- UI state (menus, settings) in Zustand

**Physics:**
- Player: kinematic character controller (never dynamic)
- NPCs (bikes, trams, cars): kinematic, following splines, not simulated
- Hazard/trigger detection: **manual AABB checks** against player position.
  Rapier kinematic-vs-sensor intersection events do *not* fire reliably here.

**Performance principles:**
- Instanced meshes for repeated props (lamps, bike racks, trees, bollards)
- Shadows only on player and large objects, not every prop. The sun is
  static, so don't re-render its shadow map every frame — throttle it
  (`autoUpdate = false` + a timed `needsUpdate`); the whole shadow pass is
  pure heat otherwise.
- LOD on distant buildings (drei `<Detailed>`); frustum culling on (default)
- Watch frame budget with 8 players + ambient NPCs on screen
- Budget CPU, not just GPU: cap the number of per-frame `useFrame` loops,
  and never let an idle/backgrounded tab keep rendering — pause the loop
  on `visibilitychange`. The toy runs `frameloop="always"` (the world is
  always in motion), so on-demand rendering isn't an option *while
  visible*; the lever is stopping work when no one's looking.

---

## Stretch ideas (later, not now)

- Photo mode (free camera, hide HUD, export PNG)
- Emotes / silly cosmetics for multiplayer
- Seasonal mode: winter Amsterdam, ice on the canals
- More gags: King's Day crowds, a runaway beer crate, herring stand
- Easter egg landmarks
- Tiny leaderboard for "longest tram survival"

## Reference / inspiration

- *Untitled Goose Game* — physical comedy, low-stakes chaos
- *Pico Park* — "send the link" co-op silliness
- Monument Valley / low-poly city packs — stylised architecture
