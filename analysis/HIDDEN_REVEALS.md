# Concealed-hole redesign — November 4, 2026

## What changed

The prior expansion copied 20 earlier assemblies and replaced one destination in each solution. Its tests proved that a hole was covered and could be used, but not that the hole was useful. That was an inadequate design check.

Puzzles 81–100 now use 20 newly authored assemblies with new `v9-discovery-*` identities. None is a copied/reskinned first 80 assembly. Material and anchor geometry are compared against all first 80 and every other new board with the existing 12 px near-clone gate, ignoring spare/hidden-hole differences so adding a hole cannot fake novelty.

- Exactly one exposed top spare and one discovery hole per new board.
- Only 81 and 82 show a small rim crescent as a teaching clue.
- Puzzles 83–100 completely conceal the entire rendered hole rim, at varied positions. Tips do not disclose its location.
- Weighted panels swing across the vacated mounting hole. The discovery is therefore needed before the next settled move, rather than merely appearing in a suggested route.
- The progression grows from one to six pieces and 2 to 12 screw moves. Later stacks include loose pieces caught on other pieces or parked shafts; those supports must be released in a workable order. Shape families include broad panels, triangles, tapered and skewed panels, T heads, staggered arrangements and two angled assemblies. These share a deliberate concealed-opening mechanic; this is not a claim of 20 wholly unrelated mechanics or strictly monotonic subjective difficulty.

## Evidence

`node test-hidden-campaign.mjs` performs 60 actual-engine routes: fresh uninterrupted, identical repeat and recreation from a snapshot five physics frames after every move. All 20 physically clear; solution moves total 162. Maximum contact overlap is 2.251028 px; maximum hinge drift is 0.000360 px. Every move settles within 2400 fixed steps. All initial holes are at least 44 board pixels apart; actual minimum is 46 px. Every initial piece is non-overlapping and inside the playable bounds.

For each board the test removes the discovery hole and tries every possible first screw into the only spare. All 162 first-move branches settle with no legal destination. On every accepted route the discovery is the sole next destination at least once. This proves necessity in the normal settle-after-each-move model. It does **not** claim impossibility for every real-time timing: the unchanged game intentionally allows moves while pieces swing, and a player may find a mid-motion shortcut. No artificial freeze or new engine rule was added to force the design.

The first two teaching rims are partially visible. Every later radius 8.6 px rim is covered at 360 sampled angles (the rendered rim radius is 8.5 px including stroke). Undo restores the concealed initial state. A fresh run repeats identical verification metrics. Per-board evidence is in `analysis/discovery-validation.json`.

## Progress and compatibility

The original 80 recipes are unchanged, with an exact serialized SHA-256 guard in the regression test. Daily JSON files, hashes, targets, completion locks, calendar, generator, account backend, authentication and analytics configuration are unchanged.

Old `v8-reveal-*` scores/completions remain in an explicit retired archive in local saves and exports, and old cloud records remain retained. They do not become scores or stars for different new puzzles. Earned pack unlocks survive; an old selected puzzle resumes at the corresponding replacement. New scores use `shapes100-v2`; earlier revisions still apply to the unchanged first 80. `test-progress-replacement.mjs` verifies this boundary, guest import, account switching and export.

Only source is prepared locally. Public publication requires the owner's approval. Browser and final regression results are recorded below after verification.

## Final local checks

- All 23 non-emulator JavaScript suites passed against the final source, including all 100 campaign solutions, the 21 immutable daily challenges, daily generator/replenishment, progress/account/analytics UI and the replacement migration. Logs: `analysis/final-validation/all-js-final.log`.
- The new hidden-hole and migration tests are now explicit CI gates in the existing Pages workflow. No workflow permission, cadence, backend or account setting changed.
- Browser testing used the production app modules with an isolated local preview fixture that unlocks and selects the test level. No real account was used and diagnostics were declined. Desktop puzzle 81 completed in 2 moves after an Undo check. In a 390 px phone-width container, puzzle 100 was played in real time through all 12 moves to three stars; a caught-plate state was observed, closing the Restart dialog preserved the attempt, and confirming Restart reset the board while retaining its earned best.
- Phone-width layouts at 390 and 320 px had no horizontal overflow; the six-piece initial board and completion state were visually checked. Screenshots are retained in `analysis/final-validation/`.
- Fresh Firebase emulator suites were not rerun locally; rules, adapter and backend are unchanged. Hosted emulator/Pages results remain required when publication is approved. This is cloud Chromium testing, not physical iPhone/Safari acceptance.
