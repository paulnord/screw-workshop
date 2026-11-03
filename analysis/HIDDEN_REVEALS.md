# Concealed-hole expansion

Packs 9 and 10 extend the campaign from 80 to 100 puzzles. Each added level uses a different assembly selected across the full difficulty curve. One empty board hole begins beneath solid collision material, is absent from the legal destination list while covered, and becomes available only after the relevant piece moves away.

The expansion deliberately preserves the original 80 recipes and IDs. Local saves continue using the existing storage key; `shapes-80` saves migrate to `shapes-100`, retain completed IDs, best moves, the selected level, and permanent pack unlocks. Account sync accepts both `shapes80-v1` and `shapes100-v1` score records. Daily recipes, identities, completion locks, and calendar data are unchanged.

## Levels

| # | Level | Assembly source | Revealed after move | Used on move |
|---:|---|---|---:|---:|
| 81 | Under the first bar | First turn | 1 | 2 |
| 82 | Sailcloth secret | Broad sail | 4 | 5 |
| 83 | Behind the chevron | Broken chevron | 1 | 2 |
| 84 | Kite pocket | Kite and rail | 2 | 3 |
| 85 | Hooked reveal | The hook | 2 | 3 |
| 86 | Crossing curtain | Crossed intentions | 4 | 5 |
| 87 | Cradle hatch | Cradle | 3 | 4 |
| 88 | Chute skylight | Hinged chute | 5 | 6 |
| 89 | Fanlight | Pivot fan | 2 | 3 |
| 90 | Sail shadow | Suspended sail | 2 | 4 |
| 91 | Pocket beneath a pocket | Pocket lid | 2 | 3 |
| 92 | Escapement window | Offset escapement | 5 | 6 |
| 93 | Vault lining | Small vault | 2 | 3 |
| 94 | Cargo trapdoor | Cantilever cargo | 4 | 5 |
| 95 | Fork-lift hatch | Fork lift | 6 | 7 |
| 96 | Chute peephole | Diagonal chute | 1 | 2 |
| 97 | Switchback reveal | Suspended switch | 1 | 2 |
| 98 | Turn after turn | Final turn | 4 | 5 |
| 99 | Double blind crossing | Double crossing | 2 | 3 |
| 100 | Workshop after dark | Last assembly | 7 | 9 |

## Verification

`node test-hidden-campaign.mjs` checks all 20 levels independently. For every level it proves that the concealed target:

- starts physically covered and is not a legal destination;
- returns to that concealed state after Undo;
- becomes clear on the declared move;
- is legal before the tested route uses it; and
- still leads to physical completion after every move settles.

`node test.mjs` replays all 100 campaign routes through the production physics engine. `node test-progress.mjs` checks the 10-pack gates and both old and new save markers. `node test-daily-engine.mjs` verifies that loading daily recipes does not mutate campaign cells or routes.
