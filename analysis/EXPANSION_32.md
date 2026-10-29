# Expanded workshop:32 levels

Four packs add16 original puzzles without changing the first16 levels, IDs, saved bests or resume. Every pack unlocks after three of four prior puzzles are complete. Stars reward move efficiency, never speed. Each target is a verified route, not a proven minimum.

## Pivot craft

|Puzzle|Tested moves|Physical idea|
|---|---:|---|
|Fan and stop|5|A broad, asymmetric fan pivots above a narrow lower stop. The final pin changes which side sweeps through the exit.|
|Hammer swing|6|A concave hammer has an offset head and handle; a one-pin rail and a two-pin shelf constrain different portions of its swing.|
|Stair turn|7|A stepped plate must rotate between two staggered ledges. A low last pivot inverts the mass, unlike an upper pivot.|
|Crown gate|8|An open crown-shaped three-pin body spans two separately hinged side gates and a lower shelf. Its concavity and the side-gate pivots create competing paths.|

## Hidden in plain sight

|Puzzle|Tested moves|Physical idea|
|---|---:|---|
|Pocket lid|5|A three-pin tapered lid covers a single board target. Choosing the remaining pivot exposes the pocket while the shelf controls the exit.|
|Turnstile|5|Two staggered diagonal arms feed a narrow central gate; the one-pin paddle can catch a falling arm. Choosing the first side opens reusable board space.|
|Secret shelf|6|A stepped shelf bridges two unequal supports. Its covered board target becomes a useful parking pocket as it rotates, while the downturned foot can catch on the right support.|
|Offset escapement|7|An asymmetric shoulder plate and diamond fall toward a shared offset shelf. The three-pin shoulder has two useful pivot heights; its wide foot makes the timing of support removal matter.|

## Support systems

|Puzzle|Tested moves|Physical idea|
|---|---:|---|
|Cantilever cargo|6|An off-center trapezoid lands on a long shelf; a one-pin post blocks one exit while a lower stop can catch the load.|
|Stair descent|6|A compact hexagon falls onto alternating diagonal ramps. Opening the lower landing changes where the upper ramp can slide the load.|
|Split trestle|6|A three-pin broad beam is supported by an angled leg and a single-pin triangular trestle. The last beam pivot and which support remains decide the catch.|
|Fork lift|7|A concave fork turns as one body around a choice of three pins. A loose diagonal beam can nest inside it, while the two-pin gate changes the available exit.|

## Master keys

|Puzzle|Tested moves|Physical idea|
|---|---:|---|
|Suspended switch|7|Two asymmetric pentagonal arms, a one-pin center latch and a lower beam share a landing zone. The latch can catch released arms; removing the beam too early trades useful support for crowded parking.|
|Arrow lock|8|A three-pin arrowhead meets two uneven pivoting stops and a one-pin hanging latch. The stops share its exit, so freeing parking and opening a side are different decisions.|
|Cornerstone|8|A broad right-angle corner carries a weighted foot above a slanted shelf, a short side gate and a one-pin stopper. Its concave opening and three anchor choices determine where it can pass.|
|Final turn|9|A triangle and a broad pentagon have six total anchor choices over one central lower stop. Releasing both into the shared stop can bury useful mounting holes; free a side, preserve parking, then finish the remaining body.|

## Validation

All32 authored routes pass the unchanged physics suite:195 moves,total maximum contact penetration2.32px under the existing2.5px bound. Independent review confirmed initial no-overlap, bounded hinges, actual contacts, full exits and Undo recovery for every new puzzle. Only Pocket lid and Secret shelf add covered targets, one each; both verified routes uncover and use them early. Two visible spares are provided in every new puzzle.

Progression tests cover all eight three-of-four gates and migration from the16-level game. Browser QA at320px checked close screw selection in Arrow lock, parking, Undo, hidden-target and support layouts, eight-pack navigation and no horizontal overflow. Actual iPhone Safari has not been tested.

## Bounded release-order coverage

The search fixes a permutation of original screw releases, settles after moves, tries legal parking targets, and allows at most one additional parked-screw move. Pack5 samples12 permutations with100nodes/order; packs6–8 sample16 with150nodes/order. Unknown means budget-limited, not impossible. Samples are coverage, not global solution counts or validated player difficulty scores. Every reported winning coordinate witness is replayed by `node test-expansion.mjs` against the integrated game.

|Puzzle|Sampled|Solved|Rejected within model|Unknown|
|---|---:|---:|---:|---:|
|Fan and stop|12|11|0|1|
|Hammer swing|12|10|0|2|
|Stair turn|12|9|0|3|
|Crown gate|12|7|0|5|
|Pocket lid|16|15|0|1|
|Turnstile|16|16|0|0|
|Secret shelf|16|14|0|2|
|Offset escapement|16|13|0|3|
|Cantilever cargo|16|16|0|0|
|Stair descent|16|16|0|0|
|Split trestle|16|14|0|2|
|Fork lift|16|11|3|2|
|Suspended switch|16|15|0|1|
|Arrow lock|16|4|0|12|
|Cornerstone|16|2|2|12|
|Final turn|16|2|3|11|

Reproduce with `node analysis/map-orders.mjs --root dist --recipes analysis/expansion-recipes.json --samples 16 --exactMax 0 --cap 150 --extra 1 --out /tmp/expansion-orders.json`. Use `--only <level-id>` for a focused run. The source JSON includes portable coordinates because global target indices depend on recipe order.
