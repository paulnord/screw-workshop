# Screw Workshop

Thirty-two original, touch-friendly physics puzzles. No ads, purchases, timers, energy, streaks, random rewards, or notifications. The game sends no player data; progress and personal bests stay in this browser.

## Play

Serve `dist/` with any static web host. Tap an exposed screw, then a highlighted board hole. You can keep moving screws while pieces swing and slide.

- **Two or more anchors:** the piece is fixed. **One:** it hinges around that screw. **None:** it becomes a free rigid body.
- Bars, triangles, L brackets and T pieces have actual matching collision material—not rectangular invisible boxes. Their square cutouts stay with the moving material.
- Other pieces and screw shafts can catch, tip or deflect falling parts. A loose piece is not cleared until its entire body falls out below the board.
- A round board hole is reusable when the 7.5px screw shaft plus a 0.75px safety margin clears actual material. Its decorative rim may still be partly covered. An aligned material cutout can receive a parked peg, which may catch the piece; this does not create a new hinge.
- Undo restores positions, velocities and the previous move count, and resumes any motion. Restart works mid-swing. Hints are free, follow a tested route after settling, and offer undo guidance when a different timing or route changes the arrangement.

The introductory puzzle has one visible spare; the other thirty-one have two. These are deliberate playability choices, **not claims of mathematical minimum parking counts**. Mounting holes reveal naturally as pieces move. Two puzzles in Hidden in plain sight each add one covered parking hole: the hint explains its role, and the verified route uncovers and uses it. The other thirty puzzles have no extra hidden targets.

On iPhone: Safari → Share → Add to Home Screen. This is a web game, not an App Store download. Internet and site access may be required; offline installation is not promised. Reduced motion skips most visual movement while running the same physical result.

## Move scores

Your score is the screw moves on the completed route; lower is an optional personal challenge. Undo removes an undone move, restart resets the route, and hints do not charge moves. Every completion succeeds regardless of score.

Personal bests are saved locally under stable, versioned level IDs only after actual physical completion. The tested target is a verified working route, **not an assertion of global optimality**. Stars reward efficient routes, never speed: one for any completion, two within two moves of the tested target, and three at or below it. These are achievable thresholds, not claims of optimal play. There are no rankings, streaks or penalties. This redesigned campaign has separate progress storage so replaced puzzles never inherit an unrelated completion or best.

## Develop and test

No package installation or build step. Matter.js is pinned and vendored locally; gameplay has no CDN dependency.

```sh
node test.mjs
node test-progress.mjs
node test-pack.mjs
node test-expansion.mjs
python3 -m http.server 8000 --directory dist
```

Inside managed Sites, use its supported preview instead of the example server.

Tests cover all campaign routes, legal placement, live revalidation, hidden/occupied targets, shaft-versus-rim clearance, collision material/cutouts, fixed pivots, 3→2→1→0 anchors, one-anchor suspension, caught pieces and support removal, sliding, actual exit completion, deterministic snapshots, rapid moves, mid-motion undo/restart and local best scoring. Browser checks cover phone-width layout and interaction. Actual iPhone Safari device testing is separate.

## Design choices

Eight packs contain four puzzles each, with distinct physical mechanics and dependencies. Complete any three puzzles in a pack to open the next; stars never gate progress. The first pack teaches the controls and core physics; later packs introduce combinations rather than repeating the introductory levels. Early levels teach mounting holes and pivot choice; later ones combine supports, concavity, asymmetric mass, parked pegs and exit routes. Larger touch areas resolve to the nearest exposed screw or clear hole; keyboard activation keeps its focused control.

Physics uses Matter.js 0.20.0 at a fixed 120 Hz: gravity 1.2 (20% above the earlier 1.0), air friction .045 (18% lower than .055), contact friction and restitution, and high-iteration pin constraints. This aims for fluid touch play; it does not claim to reproduce UIKit constants. Frame deltas are capped to avoid long-tab-resume jumps. Live screw moves preserve the existing world and momentum.

Legacy bars use five rectangular material parts. Custom outlines are partitioned into convex material polygons around real square cutouts, with center-of-mass and compound rotational inertia accounted for. Validation rejects overlapping components and holes outside material. Rendering and shaft-clearance checks use the same local geometry. A tiny deterministic release impulse breaks perfectly balanced upright equilibria. This is a bounded 2D game, not an engineering simulator.

## Attribution

Game code, CSS/SVG artwork and level designs are original to this project. No commercial game's assets, audio, branding, levels or source were copied.

`dist/vendor/matter-0.20.0.min.js` is Matter.js 0.20.0, Copyright (c) 2014 Liam Brummitt, MIT license; the full notice is in `dist/vendor/MATTER-LICENSE.txt`. Upstream: https://github.com/liabru/matter-js. This attribution is not legal clearance or a trademark search.

## Campaign rationale and verified routes

Tested routes live alongside the geometry in `dist/levels.mjs`. These example routes prove completion, not the number of all possible timing/parking strategies.

| Puzzle | Anchors by piece | Visible spares | Tested moves | Design rationale |
|---|---|---:|---:|---|
| First turn | 2 | 1 | 2 | A short, fully visible lesson in fixed board holes versus holes in moving material. |
| Choose the hinge | 3 | 2 | 3 | Three anchors demonstrate that two pins fix a body, while the chosen final pin becomes the hinge. |
| Hanging keystone | 2, 1 | 2 | 3 | A single centered screw suspends a triangular support; removing it releases both the support and the loose beam resting on it. |
| Catch and release | 2, 2, 2 | 2 | 6 | The upper beam is caught between two angled supports; first tip one support to open a route rather than removing screws from the top blindly. |
| Broken chevron | 2, 2, 2 | 2 | 6 | Two inward-pointing arms rotate apart to release space over a lower beam; a readable balance puzzle. |
| Swing gate | 2, 2, 2 | 2 | 6 | Open the side gate before choosing where the lower bar can swing; the vertical plate changes the exit path. |
| Three-point balance | 3, 2 | 2 | 5 | Three anchors make the last remaining pivot a real choice: the low anchor produces an inverted balance, while an upper anchor lets the triangle hang beside the shelf. |
| Switchback | 2, 2, 2 | 2 | 6 | Opposing slopes deflect a loose beam sideways; park screws outside its predicted path. |
| The hook | 3, 2 | 2 | 5 | An asymmetric L can hook around the neighboring vertical gate; choose a pivot and clear a path for the long foot. |
| Open basket | 2, 2, 2, 2 | 2 | 8 | An angled basket catches the upper beam, and a lower shelf creates a second support stage. |
| Crossbar gate | 2, 2, 2, 2 | 2 | 8 | Two hinged vertical gates flank a central bar; choose which gate to swing clear before letting the center drop. |
| Top-heavy lever | 3, 2 | 2 | 5 | The wide T crossbar changes the center of mass and sweeps a much larger arc than its narrow stem; a diagonal prop can catch one arm. |

## Removal-order analysis

[Read the per-level solution-order map](analysis/SOLUTION_ORDER_MAP.md). Ten puzzles have exhaustive permutation counts under a settle-after-each-move policy with zero or at most one reparking move; the two eight-screw puzzles have explicitly labeled 32-order coverage samples. Full machine-readable witnesses and the reproducible search script are in `analysis/`. These are not claims about all continuous-time strategies.

## Chain reactions

The fourth pack adds Cradle, Pendulum relay, Offset key and Locksmith: a U-shaped cup, swinging diamonds, a stepped key and a broad hexagon over shelves. All four use two visible spares and tested 5/6/7/8-move targets. Existing progress is preserved; completing any three of the prior four puzzles unlocks the next pack. [Mechanics and bounded order analysis](analysis/CHAIN_REACTIONS.md).

## GitHub Pages

The `Test and deploy game` workflow validates physics and progression before publishing `dist/` on each push to `main`. The repository owner must enable Settings → Pages → Source: GitHub Actions once. `workflow_dispatch` allows a manual rerun. The private Sites deployment is managed separately.

## Expanded workshop

Packs5–8 add16 puzzles: **Pivot craft**, **Hidden in plain sight**, **Support systems**, and **Master keys**. Original levels, IDs and browser progress remain intact. Targets range from5 to9 tested moves, and only two new puzzles use a covered parking target. [Per-level mechanics and validation](analysis/EXPANSION_32.md).
