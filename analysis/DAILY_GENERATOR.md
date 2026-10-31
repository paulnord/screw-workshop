# Verified daily generator

## Deliverable

`generated/2026-11-05-queue/` contains 14 new procedural challenges for November 5–18, 2026, plus the deterministic manifest and a separate runtime report. The owner authorized publication on October 31, 2026. The fourteen verified files are now installed in `dist/daily/`; the index and score catalog append their new immutable identities. The owner also authorized scheduled generation: the existing Pages workflow now checks daily at 06:17 UTC. All 80 campaign puzzles, the seven October 29–November 4 daily files, existing historical score entries, engine, account code and security rules are unchanged from public base `d849d2314419624460868192298c222d5ca95b49`.

```sh
# Requires Node; no dependency installation, network, credentials or services.
node scripts/generate-daily.mjs --start 2026-11-19 --days 14 --out /tmp/new-queue
node scripts/install-daily-queue.mjs --verify /tmp/new-queue
node test-daily-novelty.mjs
node test-daily-generator.mjs

# Explicit LOCAL SOURCE change only, after review:
node scripts/install-daily-queue.mjs --install /tmp/new-queue
node test-daily-content.mjs
# Then run the complete existing regression suites before any separately authorized release.
```

Generation refuses an existing output directory. `--seed` defaults to `screw-workshop`; the UTC date and generator version enter each seed. `--days` is 1–31 and `--max-attempts` is 1–80 per date. Dates already present in the published index cannot be generated or overwritten. There is no device-specific randomness and no browser-time solving.

## What is generated

The builder composes fresh assemblies rather than loading/reskinning campaign or daily recipes: tier counts/occupancy, spans, offsets, slopes, asymmetric convex mass profiles, and optional one-anchor corner keepers. Five grammar families cover split bays, offset bridges, weighted rails, mixed pieces and corner foundries. A UTC-derived weekly size profile asks for at least eight pieces once a week; ordinary dates require at least four. Accepted queue boards have 5–9 pieces and 8–14 original screws/moves. They combine one- and two-anchor parts and varied support/release arrangements, but are not a generator for every campaign mechanic (notably no newly generated L/T/triangle mechanisms or hidden parking targets yet).

Novelty compares actual outline/anchor/cutout features, not titles. Exact fingerprints ignore piece order, translation, horizontal reflection and material partition choices. A conservative 12-board-pixel minimax distance rejects near-clones against all 80 campaign recipes, seven published dailies and accepted queue boards; tiny extra outline notches do not evade the gate. The batch also rejects duplicate tier-layout/shape-count structures. This is a geometric diversity check, **not proof that every puzzle demands a unique strategy**. As the library grows, bounded rejection can eventually exhaust the available grammar rather than silently repeat content.

## Physics and scoring acceptance

The bounded planner tries three actual-engine order heuristics and at most 180 legal move trials per candidate, each with at most 2,400 fixed physics steps. It uses engine snapshots for trial branches. A planner result alone is insufficient: accepted content must pass:

1. Data schema and real-engine initial geometry validation; material inside the board safe area and at least 44 board-coordinate pixels between initial holes.
2. An uninterrupted live `E.move`/`E.step` replay, with real accessibility and shaft-clearance rules on every move.
3. An identical second live replay, including exactly reproducible evidence.
4. A separate replay interrupted five physics frames after every move and resumed via the actual snapshot/recreate path.
5. Every stage settling within the 2,400-frame limit; finite positions/velocities; reported contact overlap strictly below 2.5px; original-anchor drift at most 0.02px; every piece physically exiting below the board. Deep-penetration routes are rejected, not accepted through the recovery solver.

Targets equal the fully replayed route length. Accepted routes move each original screw once, reaching the intended anchor-removal lower bound. This does not claim global optimality against all real-time/numerical-physics behavior. Existing stars remain 3 at/below target, 2 within two moves, 1 for any completion—never based on time.

Verified settling behavior is for the documented settle-after-each-move route and snapshot interruptions. Arbitrary player timing can change contacts and cause a legitimate caught piece; hints/undo/restart remain the recovery tools. This is not exhaustive coverage of every order, timing or device.

## Failure and activation safety

All candidate work is in memory until the full requested batch succeeds. Exhausted attempts, unsupported data or illegal physics yield a nonzero exit with explicit failure counts; no partial queue or replacement authored puzzle is written. Runtime statistics are outside puzzle/manifest hashes.

The separate installer rechecks every hash, geometry/novelty/physics witness, original baseline and target before writing. An exclusive local lock prevents competing installers. It appends complete immutable files, stages the score catalog, and atomically replaces the index **last**, so the last verified index remains active until the full queue is ready. Injected failures roll back only installer-owned changes and preserve concurrent external edits. A process crash can leave unreferenced files, extra future catalog metadata and a stale lock, never a partial JSON index; inspect those before manually clearing the lock. Do not run noncooperating edits of the same source concurrently. No command performs Git push, deployment, account operations, or remote publication.

### Scheduled publication policy

The same `.github/workflows/pages.yml` handles pushes to main, manual runs from main, and `17 6 * * *` (06:17 UTC daily). `scripts/replenish-daily.mjs` maintains coverage through today +14 UTC days. It is a no-op while that coverage already exists; missing historical days are not silently backfilled, gaps inside the existing future queue fail explicitly, and the 400-entry archive cap remains a maintenance stop rather than deleting history.

The workflow checks out current main after obtaining the shared publication concurrency slot, generates locally, and runs all 19 JS suites plus the existing localhost Firebase emulator tests before any automatic Git commit. It commits only new immutable daily files/index and score metadata, checks main has not moved, and uses a normal non-force push. It uses the native, short-lived repository `GITHUB_TOKEN` with contents write and existing Pages/id-token permissions. No custom credential, account, secret or repository security setting is introduced. Manual runs on other branches are skipped.

Because native-token pushes do not trigger another Pages build, the same validated workflow deploys directly. No-op runs also deploy current verified main, allowing recovery after a previous successful content push followed by deployment failure. A remote-head check rejects detected stale publication. The artifact-only `build-info.json` records the exact published commit, coverage and schedule. Candidate evidence is retained as a workflow artifact for 30 days.

GitHub schedules can be delayed; this is an advance content buffer, not a promise of execution at an exact second. Bounds, archive capacity, permissions or physics rejection can fail a run without replacing the last good deployment. Existing GitHub workflow status/failure reporting is the monitoring surface; no new notification service was configured. Current coverage reaches November18, so the first initial release run should correctly report no replenishment needed. The first expected new date is November19 on the November5 check, subject to successful validation.

Official behavior reference: https://docs.github.com/en/actions/concepts/security/github_token


## Pre-publication results (Node 24.22.1, this cloud workspace)

- 14 accepted from 95 attempted candidates (14.7% overall, including 42 cheap size-profile rejections); 1,195 planner move trials; 215,500 planner steps.
- 7.834 seconds generation runtime; 42 accepted-route live/repeat/interrupted replays totaling 102,051 verification steps. Timings are environment-specific, not mobile performance promises.
- Separate full regeneration reproduced all 14 puzzle files and manifest **byte-for-byte**. `statistics.json` runtime intentionally differs.
- Maximum observed accepted-route overlap was 2.4347px; maximum anchor drift 0.000616px; minimum initial hole spacing 48.01 board pixels. Longest live settling stage was 647 steps (about 5.39 simulated seconds).
- `--verify` and the existing production publisher’s `checkWitness` independently replayed all 14 queue boards. Novelty suite, generator/failure suite, all 16 existing JS suites and the offline tooling-override check passed. See `generator-validation/` logs.
- Browser: 390px phone-width iframe, actual unchanged app/engine with only a QA-copy clock fixed to Nov18, reduced-motion preference and Firebase disabled. Eight-piece Nov7 route completed in 14 moves/3 stars; Undo restores move/state; Restart Cancel keeps the attempt and Confirm resets it; completed Undo/Restart/Hint are disabled; calendar shows one completion/3 stars and reopening shows read-only results. No production accounts were created. Initial board screenshot: `generator-validation/mobile-eight.png`.
- This was cloud Chromium responsive-layout testing, not physical iPhone/Safari testing. UI completion used reduced motion (same physics), not a fresh exhaustive real-time touch study. Feed unavailability during the resumed local preview also left the cached completed result locked and readable.
- The fresh Firebase emulator rerun was **blocked by auto-review** after the Firebase CLI attempted external HTTPS. It was not retried or bypassed, and is not counted as passed. The login/calendar base worker previously passed 66 rules and 59 real-SDK emulator assertions; those are inherited baseline evidence, not a fresh generator-run result. No Firebase/security/runtime files changed here.

## October 31 release checks

The publication update installs exactly the reviewed November 5–18 files, with identical hashes and witnesses. It adds the two generator suites and one replenishment suite to the existing Pages validation and enables the daily schedule under the owner’s subsequent authorization. The full 16 existing JS suites and three new suites are rerun on the installed source. The GitHub Pages run remains the authoritative deployment and hosted emulator-validation result; the earlier locally denied emulator run is still not counted as passed.
