# Screw Workshop

An original, calm, touch-friendly screw puzzle web game. Ten finite physical assemblies. No ads, purchases, random rewards, timers, energy systems, streaks, or notifications. The game sends no player data; completed-puzzle progress stays in browser local storage.

## Play

Serve `dist/` with any static web host. Tap an exposed screw, then a glowing hole in bare wood. There are six spare holes above the assembly.

- One remaining screw is a fixed hinge: the plate rotates under gravity.
- Both square cutouts remain in the plate and move with it. Round wood holes stay fixed.
- With both screws removed, the plate becomes a loose rigid body. Other plates and screw shafts can catch it. Plates can tip, collide, and slide.
- A loose plate is **not** cleared until the entire body has actually fallen below the board.
- Moves stay responsive while pieces swing and slide. Screw accessibility and target clearance are checked against live geometry when the move commits. A moving material cutout is not a parking target, and screws do not automatically reattach to moving plates. Newly parked screws are solid pegs and can block falling pieces.
- Undo restores the previous complete assembly, including geometry and velocity; restart works during animation. Hints offer contextual suggestions, not a guaranteed solution from every arbitrary position.

All ten levels are available immediately. Their layouts were redesigned for a coherent single physical plane rather than overlapping visual layers. Completion progress uses a new storage key because these are different puzzles from the first version.

On iPhone: open in Safari, then Share → Add to Home Screen. This is a web game, not an App Store application. Internet/site sign-in may be needed to open it; offline installation is not promised. Reduced-motion preference skips animation but runs the same physical outcome.

## Develop and test

No package installation or build step. The pinned engine is vendored locally, so gameplay does not depend on a CDN.

```
node test.mjs
python3 -m http.server 8000 --directory dist
```

Use the supported Sites preview instead of the example HTTP server inside managed Sites environments.

Tests replay an actual legal solution for every level through the same rigid-body engine. Additional assertions cover hinge-anchor drift, persistent collision cutouts, transformed occlusion, covered/occupied targets, loose plates caught by other plates and screw-sized blockers, removing supports, contact-driven sliding, off-board completion, deterministic snapshot reconstruction, mid-motion undo, restart, rapid consecutive releases, preserved momentum/world identity, live rejection of newly covered targets, and late completion clicks. They do not prove every possible user position is solvable. Browser QA covers interaction and narrow responsive layouts; testing in an actual iPhone Safari session remains separate.

## Physics implementation

Matter.js 0.20.0 runs at a fixed 120 Hz with gravity, friction, restitution, high-iteration pin constraints, and compound-body collision geometry. Each plate is five rectangular material pieces surrounding two genuine square holes; the rendered SVG matches those openings. Screw shafts are static circles. Plates and screws share one collision plane; none are silently removed merely because their constraints were removed. Perfectly upright, unstable plates receive a small deterministic release impulse to avoid an artificial exact-balance equilibrium. This is a bounded 2D game simulation, not an engineering simulator.

Interaction is available during motion; the animation loop pauses only after sustained low motion, without blocking input. Frame deltas are capped so a hidden tab returning cannot teleport the simulation through a long elapsed interval. Screw moves mutate the existing physical world in place, preserving bodies, velocities and ongoing contacts. Undo reconstructs a full snapshot including positions, velocities and motion state, and resumes any motion that was in progress. Restart cancels the animation loop and constructs a fresh world.

## Files and attribution

- `dist/index.html`, `dist/style.css`: responsive interface, safe-area and reduced-motion support.
- `dist/engine.mjs`: original level layouts, rigid-body setup, rules and snapshot helpers.
- `dist/app.mjs`: original SVG rendering, animation, controls and local progress.
- `dist/icon.svg`: original vector screw icon.
- `test.mjs`: dependency-free regression runner (uses the vendored physics library).
- `dist/vendor/matter-0.20.0.min.js`: Matter.js 0.20.0, Copyright (c) 2014 Liam Brummitt, MIT license.
- `dist/vendor/MATTER-LICENSE.txt`: full required third-party license notice.

Matter.js upstream: https://github.com/liabru/matter-js (version 0.20.0). The game code, CSS/SVG artwork and level layouts were newly created for this project. No third-party game artwork, branding, audio or level data is included. Matter.js is a general-purpose open-source physics engine, not copied code from a commercial screw game. This attribution is not legal clearance or a trademark search.
