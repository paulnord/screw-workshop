# Screw Workshop: solution-order map

## What is counted

A **release order** is the order in which the original screws are first removed. The solver tries every legal parking destination for that order. Reparking an already removed screw does not change the order. We count an order as successful if **at least one** permitted parking route clears the board. This does not mean every parking choice works.

Two tiers: **straight clear** (no reparking; one move per original screw), and **one correction allowed** (at most one extra screw move). The engine settles before the first action and after every move. These are finite-model counts, not claims about all possible live-timed play.

## Counts

| Puzzle | Original screws | Possible orders (N!) | Orders tested | Straight clear | One correction allowed | Coverage |
|---|---:|---:|---:|---:|---:|---|
| First turn | 2 | 2 | 2 | 2 | 2 | All permutations |
| Choose the hinge | 3 | 6 | 6 | 6 | 6 | All permutations |
| Hanging keystone | 3 | 6 | 6 | 6 | 6 | All permutations |
| Catch and release | 6 | 720 | 720 | 361 | 480 | All permutations |
| Broken chevron | 6 | 720 | 720 | 720 | 720 | All permutations |
| Swing gate | 6 | 720 | 720 | 633 | 701 | All permutations |
| Three-point balance | 5 | 120 | 120 | 70 | 118 | All permutations |
| Switchback | 6 | 720 | 720 | 682 | 720 | All permutations |
| The hook | 5 | 120 | 120 | 72 | 112 | All permutations |
| Open basket | 8 | 40,320 | 32 | 8 confirmed | 12 confirmed | 32-order coverage sample |
| Crossbar gate | 8 | 40,320 | 32 | 22 confirmed | 30 confirmed | 32-order coverage sample |
| Top-heavy lever | 5 | 120 | 120 | 80 | 112 | All permutations |

For a fully enumerated row with no unknowns, the displayed count is exact **within that tier and settle policy**. For sampled rows, the successful counts are verified lower bounds; do not extrapolate a percentage or a total. A rejected order can still succeed with more corrections or different live timing.

## What this says about playability

- The opening hinge and keystone puzzles permit every release order: suitable for learning visible physics without a first-move trap.
- Three-point balance admits 70 straight-clear orders and 118 with one correction. The hook rises from 72 to 112; Top-heavy lever from 80 to 112. These create efficient-route choices while allowing recovery, rather than forcing an arbitrary secret-hole sequence.
- Broken chevron permits all 720 orders without reparking. It is a forgiving change of shape, not an order-lock challenge. Its challenge, if any, lies in choosing parking positions; do not market it as a uniquely ordered puzzle.
- Every tested legal first move in this campaign leaves a free parking hole after settling. There are no immediate no-hole first-move traps under this policy. Later parking/support interactions still matter.
- The number of winning orders is only one design measure. Visible cause/effect, readable supports, recoverability, and differences between level mechanics still need human playtesting.

## First-choice map (one correction allowed)

Screw numbers below are **1-based** in original anchor order. JSON uses 0-based IDs. Numbers are successful tested orders beginning with that screw; they do not count parking variants. A sampled zero is not proof that a first screw cannot work.

- **First turn** (all orders): S1: 1; S2: 1.
- **Choose the hinge** (all orders): S1: 2; S2: 2; S3: 2.
- **Hanging keystone** (all orders): S1: 2; S2: 2; S3: 2.
- **Catch and release** (all orders): S1: 40; S2: 40; S3: 110; S4: 90; S5: 110; S6: 90.
- **Broken chevron** (all orders): S1: 120; S2: 120; S3: 120; S4: 120; S5: 120; S6: 120.
- **Swing gate** (all orders): S1: 117; S2: 117; S3: 120; S4: 113; S5: 117; S6: 117.
- **Three-point balance** (all orders): S1: 23; S2: 23; S3: 24; S4: 24; S5: 24.
- **Switchback** (all orders): S1: 120; S2: 120; S3: 120; S4: 120; S5: 120; S6: 120.
- **The hook** (all orders): S1: 24; S2: 21; S3: 22; S4: 23; S5: 22.
- **Open basket** (sample): S1: 1; S2: 2; S3: 2; S4: 3; S5: 2; S6: 1; S7: 0; S8: 1.
- **Crossbar gate** (sample): S1: 2; S2: 5; S3: 5; S4: 1; S5: 5; S6: 6; S7: 3; S8: 3.
- **Top-heavy lever** (all orders): S1: 21; S2: 24; S3: 20; S4: 23; S5: 24.

## Reproducibility and limits

- Sources are SHA-256 fingerprinted in the JSON. Geometry and physics must match these files for these counts to apply.
- All successful witnesses were replayed from the initial world through the uninterrupted game engine. The JSON contains each tested order, status, and a witness route for every success.
- Each settle is capped at 5,000 fixed steps; a cap is unknown, never impossible. Search caps are 1,000 nodes/order, with two Crossbar orders and one Swing gate order retried at 10,000.
- Branches clone the entire live simulation graph, preserving contact-cache relationships. No approximate state hashing or physics-coordinate rounding is used.
- The script supports `--project-root=/path/to/screw-workshop`. Example: `node map-orders.mjs --project-root=. extra=1 exactMax=6 samples=32 cap=1000 out=orders.json`. Run again with `extra=0` for the straight-clear tier. `exactMax=6` enumerates at most 720 permutations per level; 8-pin levels use the stated 32-order sample.
- Samples deliberately cover first screws and include the authored route; they are not statistically unbiased. No success probability is inferred.
- No claim is made about optimal human strategy, arbitrary real-time tapping, or unlimited reparking.

Final reordered-build verification: **3,833 distinct successful routes**, comprising **23,751 legal moves**, replayed to completion. All cell-ID and coordinate bindings matched.

### Source fingerprints

- engine.mjs: `6907ca4033799638110a4309f9370abe801a121812fd2978ca48a60b0f28793a`
- levels.mjs: `200b1bf51e3ecae4b96b5537e1b32cd53962b74605e48b509b96e6d3d52b27db`
