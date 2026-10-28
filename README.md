# Screw Workshop

An original, calm, touch-friendly screw puzzle web game. Ten finite physical assemblies. No ads, purchases, random rewards, timers, energy systems, streaks, or notifications. The game sends no player data; completed-puzzle progress stays in browser local storage.

## Play

Serve `dist/` with any static web host. Tap an exposed screw, then a glowing hole in bare wood. There is one spare hole above each assembly. Additional round wood holes are hidden beneath the plates and appear as pieces move.

- One remaining screw is a fixed hinge: the plate rotates under gravity.
- Both square cutouts remain in the plate and move with it. Round wood holes stay fixed.
- With both screws removed, the plate becomes a loose rigid body. Other plates and screw shafts can catch it. Plates can tip, collide, and slide.
- A loose plate is **not** cleared until the entire body has actually fallen below the board.
- Moves stay responsive while pieces swing and slide. Screw accessibility and target clearance are checked against live geometry when the move commits. A board hole is reusable when the 7.5px screw shaft plus a 0.75px safety margin is clear of actual plate material. Its decorative rim may still be partly covered. An aligned plate cutout can receive a parked peg; it does not create a new hinge. Newly parked screws are solid pegs and can block falling pieces.
- Undo restores the previous complete assembly, including geometry and velocity; restart works during animation. Hints follow a verified route after pieces settle; if you diverge or timing changes the arrangement, they suggest a recoverable undo rather than promising a universal solution. Gameplay itself remains available during motion.

All ten levels are available immediately. Their layouts were redesigned for a coherent single physical plane rather than overlapping visual layers. The current campaign uses tighter spacing, hidden holes and parked-screw relocation to make order and space matter. Completion progress uses a new storage key for these redesigned limited-space puzzles.

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

Matter.js 0.20.0 runs at a fixed 120 Hz with gravity 1.2 (20% above the previous 1.0), air friction .045 (18% below the previous .055), contact friction, restitution, high-iteration pin constraints, and compound-body collision geometry. Each plate is five rectangular material pieces surrounding two genuine square holes; the rendered SVG matches those openings. Screw shafts are static circles. Plates and screws share one collision plane; none are silently removed merely because their constraints were removed. Perfectly upright, unstable plates receive a small deterministic release impulse to avoid an artificial exact-balance equilibrium. This is a bounded 2D game simulation, not an engineering simulator.

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

## Spare-count verification

Each authored layout has exactly one legal initial empty target. With its above-board spare removed, the same initially static assembly has no legal first move: all other holes are occupied or covered. Every stored solution route completes using one spare, so **one is necessary and sufficient for these fixed layouts and rules**. This is not a claim about arbitrary layouts or globally optimal move counts.

The target sequences are stored with the original geometry in `dist/levels.mjs`. The tests replay them through continuous rigid-body simulation, checking legal moves, hidden-hole coverage, recovery traps and actual exit completion. Targets are verified examples, not proven shortest solutions.
