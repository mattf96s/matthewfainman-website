# Amsterdam Explorer — Project Brief

A browser-based 3D exploration game set in a stylised version of Amsterdam.
The player wanders the city on foot while avoiding cyclists and trams. Built
as a personal website / portfolio piece.

---

## Vision

A low-poly, slightly playful interpretation of Amsterdam's centrum — canals,
narrow brick houses, fietspaden, tram lines. The mood is calm exploration
punctuated by near-misses with bicycles and the genuine terror of a tram
coming at you on Damrak.

Not a realistic simulation. Closer in spirit to *A Short Hike* or *Untitled
Goose Game* than to GTA. Aesthetic: flat-shaded geometry, warm colour
palette, soft shadows.

## Goals

- Ships as a personal website (works at the root domain, no install)
- Loads in under 5 seconds on a decent connection
- Runs at 60fps on a 2020+ laptop integrated GPU
- Distinctive enough to be a portfolio piece
- Scoped to be buildable in evenings and weekends (~6–10 weeks)

## Non-goals

- Photo-realistic Amsterdam (use OpenStreetMap as reference, not as ground truth)
- Multiplayer
- Mobile-first (works on mobile, but desktop is the primary target)
- A full city — one neighbourhood done well beats the whole centrum done badly

---

## Tech Stack

**Core:**
- **Vite** — build tool, dev server
- **TypeScript** — strict mode
- **React Three Fiber** (`@react-three/fiber`) — Three.js scene graph in React
- **@react-three/drei** — helpers (camera, environment, shadows, KeyboardControls)
- **@react-three/rapier** — physics (player collider, bike/tram bodies, canal triggers)
- **Zustand** — game state (score, lives, current zone, paused/playing)

**Tooling:**
- **pnpm** — package manager
- **Biome** or **ESLint + Prettier** — formatting/linting
- **Vitest** — for any unit-testable logic (spline math, scoring)

**Assets:**
- **Blender** — for any custom geometry (or use procedural generation)
- **Kenney.nl** low-poly asset packs as placeholders
- **OpenStreetMap** (via Overpass API) to extract real building footprints
  and canal geometry for one neighbourhood, used as a generation seed

**Deployment:**
- **Vercel** or **Cloudflare Pages** — static hosting
- Custom domain pointing at the personal site

---

## Phase 1 — Skeleton (week 1)

**Deliverable:** A browser window showing a flat grey plane, a player capsule,
WASD movement, and a third-person follow camera. No city yet.

Tasks:
1. Vite + TS + R3F + Drei + Rapier scaffold
2. Player as a kinematic character controller (Rapier's `KinematicCharacterController`)
3. WASD + mouse-look via Drei's `KeyboardControls` and `PointerLockControls`
4. Third-person camera with smooth follow and collision avoidance
5. Simple HUD overlay (HTML, positioned absolute over the canvas) showing FPS

**Acceptance:** You can walk around an empty plane smoothly. Movement feels
good. No physics glitches.

## Phase 2 — Block (week 2)

**Deliverable:** A single hand-modelled Amsterdam block — three or four
canal houses, a stretch of canal with a bridge, a road, and a fietspad.

Tasks:
1. Define a coordinate system. 1 unit = 1 metre. North = +Z.
2. Build the block in Blender (or procedurally generate with simple geometry).
   Canal houses: tall, narrow, gabled. Brick palette.
3. Import as GLTF. Verify it loads, is correctly scaled, casts shadows.
4. Define the road surface, fietspad surface, sidewalk, and canal as separate
   meshes with different friction / step heights / triggers.
5. Canal as a water plane (flat, reflective, blue). Falling in = lose condition
   (just log it for now).
6. Lighting pass: warm directional sun, ambient fill, soft shadows.

**Acceptance:** The block looks recognisably Amsterdam-ish. Walking on the
sidewalk feels different from walking in the canal. Falling in the canal
triggers a console event.

## Phase 3 — Hazards (weeks 3–4)

**Deliverable:** Cyclists on the fietspad, a tram on a rail line.

Tasks:
1. **Bike NPCs**:
   - Spline path along the fietspad (Catmull-Rom curve)
   - Kinematic body following the spline at a configurable speed
   - Low-poly bicycle + rider model (Kenney pack or simple Blender)
   - Bell/bike sound on approach
   - Bikes spawn at one end, despawn at the other, with random gaps
2. **Tram**:
   - Define one tram route along the road
   - Kinematic body, much faster, much bigger
   - Tram bell sound when approaching
   - GVB-blue paint job
3. **Collision response**:
   - Bike hit: player flinches, screen shake, -1 life
   - Tram hit: instant lose
   - Canal fall: instant lose
4. **Scoring**:
   - Score = seconds survived + bonus for "near misses" (player collider
     within 1m of a bike/tram for >100ms without contact)
   - Display in HUD

**Acceptance:** Bikes feel threatening but fair. The tram is genuinely scary.
Near-miss scoring rewards risky play near the fietspad.

## Phase 4 — Neighbourhood (weeks 5–6)

**Deliverable:** Expand the block into a small explorable area — 4–6 blocks
around a recognisable landmark.

Tasks:
1. Pick the area. Suggestions: Jordaan around Westerkerk, Leidseplein,
   Nieuwmarkt, or the Bloemenmarkt stretch of the Singel.
2. Extract building footprints from OSM via Overpass API. Script that
   generates extruded low-poly buildings from footprint polygons.
3. Hand-place landmark buildings (the church, the market, etc.) with more
   detail.
4. Lay out the road network and fietspaden along OSM data.
5. Add multiple tram lines and bike spawn paths.
6. Decorative props: street lamps, bike racks, café terraces with chairs,
   the occasional Albert Heijn.

**Acceptance:** A Dutch person looking at it says "yeah that's Amsterdam."

## Phase 5 — Polish (weeks 7–8)

**Deliverable:** It feels like a finished game, not a tech demo.

Tasks:
1. Title screen, pause menu, game-over screen
2. Sound design: ambient canal/birds, tram bells, bike bells, footsteps
3. Music — light, jazzy, looped (commission or use a CC-BY track)
4. Day/night cycle (optional but very satisfying)
5. Particle effects: water splash on canal fall, dust on hard tram hit
6. Loading screen with progress (model loading is the slow part)
7. Settings menu: volume, mouse sensitivity, graphics quality (toggle shadows)
8. Mobile fallback: detect touch, show "best on desktop" message

**Acceptance:** A friend can open the URL, understand what to do, play for
five minutes, and not encounter anything broken.

## Phase 6 — Ship (week 9–10)

Tasks:
1. Performance pass: profile with Spector.js, reduce draw calls, batch geometry
2. Bundle pass: compress GLTF with Draco, lazy-load assets, audit bundle size
3. Deploy to Vercel
4. Custom domain
5. Lighthouse audit; fix anything below 90
6. Write a short "about this project" page describing the stack and decisions

---

## Architecture Notes

**Folder structure:**
```
src/
  game/
    player/           — player controller, input, animations
    hazards/          — bike, tram, canal
    world/            — terrain, buildings, props
    systems/          — scoring, lives, score, near-miss detection
  scene/              — top-level R3F components
  ui/                 — HUD, menus, screens
  audio/              — sound manager, audio refs
  state/              — Zustand stores
  lib/                — math, splines, OSM importers
  assets/             — GLTFs, audio, textures
```

**State management:**
- All gameplay state in Zustand (`useGameStore`, `useScoreStore`, etc.)
- Per-frame transient state (positions, velocities) stays inside R3F refs
- UI state (menus open, settings) in a separate Zustand store

**Performance principles:**
- Instanced meshes for repeated props (lamps, bike racks, trees)
- Frustum culling on (R3F default)
- One draw call per material where possible
- Shadows only on player and large objects, not every prop
- LOD on buildings far from camera (Drei `<Detailed>`)

**Physics principles:**
- Player: kinematic character controller (not dynamic — avoids weird drift)
- NPCs (bikes, trams): kinematic, following splines, not simulated
- Trigger volumes (canal, hazard zones): sensor colliders, no contact

---

## Open Questions (decide before starting)

1. **Camera**: third-person follow vs first-person? Third-person is safer and
   easier to make pretty. Pick one and don't switch later.
2. **Player model**: stylised tourist (backpack, camera)? Generic capsule?
   Decides how much character art is needed.
3. **Win condition**: time-based survival, or collect items (stroopwafels?
   tulips?) scattered around the map?
4. **Tone**: comedic (Goose Game energy) or chill (Short Hike energy)?
   Decides music, art direction, sound design.
5. **Real Amsterdam locations**: how recognisable should it be? Real
   street names? Real café names? The more specific, the more delightful
   for locals but the more legal/IP grey area.

---

## Stretch ideas (for later, not v1)

- Photo mode (pause, free camera, hide HUD, export PNG)
- A koffie shop minigame
- Seasonal mode: winter Amsterdam with ice on the canals
- A "tourist mode" with markers on real landmarks and short info panels
- Easter egg: find the Anne Frank house, get a small reflective moment
- Leaderboard via a tiny backend (Cloudflare Worker + D1)

---

## Reference / inspiration

- *A Short Hike* — pace and tone
- *Untitled Goose Game* — physical comedy of NPCs
- Monument Valley — stylised architecture
- The PlayCanvas Amsterdam demo (search "playcanvas amsterdam")
- Kenney.nl city packs — placeholder asset visual style
