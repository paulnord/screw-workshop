# Screw Workshop

Eighty original, touch-friendly physics puzzles. No ads, purchases, timers, energy, streaks, random rewards, or notifications. Guest progress and personal bests stay in this browser. Optional account sync is available on the public web game; when chosen, it saves completed scores to the game’s Firebase project. Guest play needs no account.

## Play

Serve `dist/` with any static web host. Tap an exposed screw, then a highlighted board hole. You can keep moving screws while pieces swing and slide.

- **Two or more anchors:** the piece is fixed. **One:** it hinges around that screw. **None:** it becomes a free rigid body.
- Bars, triangles, L brackets and T pieces have actual matching collision material—not rectangular invisible boxes. Their square cutouts stay with the moving material.
- Other pieces and screw shafts can catch, tip or deflect falling parts. A loose piece is not cleared until its entire body falls out below the board.
- A round board hole is reusable when the 7.5px screw shaft plus a 0.75px safety margin clears actual material. Its decorative rim may still be partly covered. An aligned material cutout can receive a parked peg, which may catch the piece; this does not create a new hinge.
- Undo restores positions, velocities and the previous move count, and resumes any motion. Restart works mid-swing. Hints are free, follow a tested route after settling, and offer undo guidance when a different timing or route changes the arrangement.

Parking is deliberately limited: the introductory puzzle has one visible spare, and most assemblies have two. Mounting holes reveal naturally as pieces move. A small subset of the Hidden in plain sight pack adds a purposeful covered parking target; these are not scattered throughout the campaign. Spare counts are design choices, not mathematical minimum parking claims.

On iPhone: Safari → Share → Add to Home Screen. This is a web game, not an App Store download. Internet and site access may be required; offline installation is not promised. Reduced motion skips most visual movement while running the same physical result.

## Move scores

Your score is the screw moves on the completed route; lower is an optional personal challenge. Undo removes an undone move, restart resets the route, and hints do not charge moves. Every completion succeeds regardless of score.

Personal bests are saved locally under stable, versioned level IDs only after actual physical completion. The tested target is a verified working route, **not an assertion of global optimality**. Stars reward efficient routes, never speed: one for any completion, two within two moves of the tested target, and three at or below it. These are achievable thresholds, not claims of optimal play. There are no rankings, streaks or penalties. All original32 puzzle IDs, layouts and best scores are preserved. The80-puzzle campaign uses the same browser storage and migrates old resumes and pack unlocks.

## Develop and test

No package installation or build step is needed for guest gameplay. Matter.js is pinned and vendored locally; gameplay has no CDN dependency. Account rules validation uses the development-only npm toolchain described in `firebase/README.md`.

```sh
node test.mjs
node test-contact-orders.mjs
node test-progress.mjs
node test-pack.mjs
node test-expansion.mjs
node test-campaign80.mjs
python3 -m http.server 8000 --directory dist
```

Inside managed Sites, use its supported preview instead of the example server.

Tests cover all campaign routes, legal placement, live revalidation, hidden/occupied targets, shaft-versus-rim clearance, collision material/cutouts, fixed pivots, 3→2→1→0 anchors, one-anchor suspension, caught pieces and support removal, sliding, actual exit completion, deterministic snapshots, rapid moves, mid-motion undo/restart and local best scoring. Browser checks cover phone-width layout and interaction. Actual iPhone Safari device testing is separate.

## Design choices

Eight packs contain ten puzzles each, with distinct physical mechanics and dependencies. Complete any seven puzzles in an unlocked pack to open the next; stars never gate progress. Packs earned under the previous three-of-four rule stay open permanently, without requiring replay of earlier expanded packs. The first pack teaches the controls and core physics; later packs introduce combinations rather than repeating the introductory levels. Early levels teach mounting holes and pivot choice; later ones combine supports, concavity, asymmetric mass, parked pegs and exit routes. Larger touch areas resolve to the nearest exposed screw or clear hole; keyboard activation keeps its focused control.

Physics uses Matter.js 0.20.0 at a fixed 120 Hz: gravity 1.2 (20% above the earlier 1.0), air friction .045 (18% lower than .055), contact friction and restitution, and high-iteration pin constraints. This aims for fluid touch play; it does not claim to reproduce UIKit constants. Frame deltas are capped to avoid long-tab-resume jumps. Live screw moves preserve the existing world and momentum.

Legacy bars use five rectangular material parts. Custom outlines are partitioned into convex material polygons around real square cutouts, with center-of-mass and compound rotational inertia accounted for. Validation rejects overlapping components and holes outside material. Rendering and shaft-clearance checks use the same local geometry. A tiny deterministic release impulse breaks perfectly balanced upright equilibria. This is a bounded 2D game, not an engineering simulator.

## Attribution

Game code, CSS/SVG artwork and level designs are original to this project. No commercial game's assets, audio, branding, levels or source were copied.

`dist/vendor/matter-0.20.0.min.js` is Matter.js 0.20.0, Copyright (c) 2014 Liam Brummitt, MIT license; the full notice is in `dist/vendor/MATTER-LICENSE.txt`. Upstream: https://github.com/liabru/matter-js. This attribution is not legal clearance or a trademark search.

## Campaign rationale and verified routes

Tested routes live alongside the geometry in `dist/levels.mjs`. [The80-puzzle campaign report](analysis/CAMPAIGN_80.md) lists mechanics, targets and verification. Each target is a physically replayed working route. When it equals the number of original screws, it reaches the lower bound under the intended anchor rules; this is not a formal proof against numerical-physics exploits or every real-time strategy.

Historical bounded removal-order studies remain available: [original12](analysis/SOLUTION_ORDER_MAP.md), [Chain reactions](analysis/CHAIN_REACTIONS.md), and [packs5–8 original puzzles](analysis/EXPANSION_32.md). Exhaustive counts apply only to their stated finite settle/parking model; capped searches are labeled unresolved, not impossible.

## GitHub Pages

The `Test and deploy game` workflow validates physics and progression before publishing `dist/` on each push to `main`. The repository owner must enable Settings → Pages → Source: GitHub Actions once. `workflow_dispatch` allows a manual rerun from `main`. The same workflow also runs daily at 06:17 UTC to replenish the verified daily queue; it does not rely on workflow-token pushes triggering another deployment. Other hosted deployments are managed separately.

## Daily workshop

The Daily button loads the shared puzzle for the current **UTC date** from small, versioned JSON files. A monthly calendar shows completed dates with earned stars, completed-day counts and total stars for that month and all time. Only unfinished published dates can be played. Completed daily challenges are final and show read-only results; all 80 campaign puzzles remain replayable. Daily stars reward moves, not speed; daily scores never change campaign progress or pack unlocks. There are no streak penalties.

The shared queue covers October 29–November 18, 2026. The original seven dates remain unchanged; fourteen new procedural challenges for November 5–18 have been generated offline, checked against the live physics engine, and added to the daily feed. They unlock on their UTC dates. The generator is included in the repository. Every day at **06:17 UTC**, GitHub Actions checks the queue and generates enough verified challenges to maintain at least **14 future UTC days**, then validates and publishes the update. Existing dates never change; failed checks leave the last good deployment intact. See [generator commands, guarantees and limits](analysis/DAILY_GENERATOR.md). When today's data is unavailable, the game uses a verified cached copy if available, otherwise clearly labeled bundled practice. Cached puzzle data is available offline once the web game is open; cold offline page launch is not promised. The separate native wrapper does not yet enable daily downloads.

To append a challenge, provide a recipe with geometry and a working solution:

```sh
node scripts/publish-daily.mjs YYYY-MM-DD recipe.json
node test-daily-content.mjs
```

The publisher validates and physically replays the route, then appends an immutable dated JSON file and SHA-256 index entry. Commit both files; Pages CI validates every published puzzle before deploying. Do not rewrite a published date. See [data format and safety bounds](analysis/DAILY_DATA.md) and [release validation](analysis/DAILY_RELEASE.md).

## Alternate-order physics audit

The contact solver includes a bounded hinge-aware recovery pass for deep or prolonged
contacts. It does not increase air friction, change the global timestep, freeze pieces,
or mark caught material as complete. All 80 authored campaign routes and seven daily
witnesses remain valid. Fourteen historical alternate witnesses that involved excessive
penetration now have explicitly tested blocked outcomes; their original records are
preserved. See [audit, exact reproductions, coverage and limitations](analysis/PHYSICS_ORDER_AUDIT.md).

`node scripts/audit-physics-orders.mjs` runs 1,044 seeded legal order/parking/timing
trials, respecting the animation loop's settled cutoff. Set `AUDIT_CONTINUOUS=1` to
stress the solver beyond that cutoff; this is deliberately not an exact UI replay.

## Optional account sync

The account implementation is enabled in `dist/firebase-config.mjs` for this web release. The Firebase web identifiers are public client configuration, not Admin credentials or secret keys. Guest play, local campaign saves and daily puzzle downloads continue without an account.

When configured, Email/Password accounts sync completed puzzle scores. Campaigns keep the best move count per revision. New daily completions close that UTC date; the first server-accepted completion wins if two devices finish the same revision together. Historical bests and explicitly imported guest scores are retained, never retroactively erased. The UI checks cloud progress before opening a daily and on returning to the tab; offline devices reconcile when connected. This is client/adapter game policy, not a tamperproof backend restriction. Guest scores are imported only after explicit confirmation. Accounts use separate local caches and pending offline queues; signing out restores guest play. Current attempts, resume position and historical pack-unlock entitlements remain local. This is not a competitive or cheat-proof leaderboard.

See [Firestore storage and local validation](firebase/README.md). Use the no-cost Spark plan only; this project requires neither paid billing nor an Identity Platform upgrade. The owner approved this public web release on October 30, 2026. Automated integration tests use localhost emulators only; they do not create or modify production accounts. Native iPhone account support is separate.

## Daily score calendar validation

`node test-daily-summary.mjs` covers UTC month/year/leap-day boundaries, revision/date deduplication and historical scoring metadata. `node test-daily-sync.mjs` covers final completion locks, competing devices, stale snapshots, offline caches and explicit historical imports. Daily UI/account suites cover readonly calendar entry, no post-completion undo/restart/hint/replay, unfinished retries, closing during loads and UID switching.

`dist/daily-score-catalog.mjs` retains original revision-specific target metadata. The publisher regenerates it from hash-verified immutable puzzle data; never remove historical revisions or reinterpret old scores against a changed target. Unknown historical revisions still count as completed and stay locked, but their stars are labeled unavailable rather than guessed. Fallback practice is excluded from calendar totals and remains replayable. Existing best-score save keys and account records are not rewritten by opening the calendar.
