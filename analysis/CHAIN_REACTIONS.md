# Chain reactions — four puzzles

Source: the final four recipes in `dist/levels.mjs`. All geometry and artwork are original. Two visible spares per level; no bonus hidden holes. No engine changes. All routes are verified examples, not optimality claims. Preserve existing stable IDs and progress when appending this pack.

- **Cradle (5 screws):** a three-pin U-shaped piece carries an inner paddle. The final U pivot determines whether the opening tips aside. The primary hint opens the cradle before dropping the paddle; an alternate route deliberately drops the paddle into the cup and then empties it. This alternate demonstrates real concave contact, not a painted U over a solid collision rectangle.
- **Pendulum relay (6):** two offset diamond plates and a shared shelf. The shelf is part of both exit paths; clearing one diamond creates useful parking before the other swings. Removing screw 3 then 2 into the two top holes leaves no free hole after settling; Undo recovers.
- **Offset key (7):** a stepped three-pin key, short shelf and side rail. The stepped mass changes the useful pivot; the tested route opens the rail before selecting the key's pivot. A loose piece is genuinely caught along the route.
- **Locksmith (8):** a broad three-pin hexagon, two unequal shelves and a one-pin central gate. The tested route preserves the center until the broad piece's exit and parking choices are established. Four tested two-release prefixes consume both parking holes without exposing another. The route has three caught-piece stages before clearing.

## Validation

Unmodified `test.mjs` plus its shape tests passed with all 16 levels in an isolated checkout: 89 total moves, maximum contact overlap 1.46px. Engine features covered there include live moves, exact hole clearance, occlusion revalidation, compound holes, hinges, plate/screw blockers, exit completion, deterministic snapshots, Undo and restart. New routes also passed explicit initial no-overlap checks and full physical exit, with independent Undo-to-initial route recovery. This is Node physics validation; no new browser/device QA was performed by this worker.

The optional Cradle paddle-first route peaks at 2.57px overlap, above the existing 2.5px **authored-route** regression bound. It is included as alternate interaction evidence, not the default hint. Default routes all meet the existing bound without weakening it.

## Release-order analysis

`chain-reactions-samples.json` enumerates all 120 Cradle release orders and samples 16 each of the others. Search allows at most one extra parked-screw move, settles after every move, tries legal destinations, and caps each order at 150 nodes. It excludes arbitrary real-time timing or unlimited reparking. Every reported winning witness was independently replayed in-place. Unresolved search is **unknown**, never a failure or proof of impossibility.

Initial results: Cradle 94 solved /22 rejected /4 unknown out of120; Relay14/0/2 out of16; Key9/1/6 out of16; Locksmith2/1/13 out of16. Higher-budget Cradle pass (2,500 nodes/order): 94 solved, 26 rejected, 0 unknown out of120. Samples are not estimates of a global solution count or a validated player difficulty metric.

Integer route target IDs are accompanied by `cellCoordinates` and portable `coordinateRoute`, because appending levels in another order changes dynamic cell indices. `pack.json` routes already use coordinates.

## Integrated release checks

All 119 winning witnesses were replayed against the integrated 16-level geometry with `node test-pack.mjs`. Existing IDs and browser progress remain unchanged. Browser checks at 390px and 320px covered the new shapes, screw selection/parking, Undo, menu dismissal, and the fourth pack; 320px had no horizontal overflow. Actual iPhone Safari remains untested.

Reproduce the bounded searches with `node analysis/map-orders.mjs --root dist --recipes analysis/chain-reactions-recipes.json --extra 1 --exactMax 5 --samples 16 --cap 150 --out /tmp/new-pack-orders.json`; for the complete Cradle result add `--only v5-cradle --cap 2500`. The samples are coverage, not population estimates.
