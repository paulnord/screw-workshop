# Alternate-order contact audit — 2026-10-30

## Result and scope

The user's observation was reproducible: particular legal screw/parking orders can
leave hinged pieces jiggling against each other indefinitely rather than settling.
This was not hinge-anchor drift. The baseline is public commit
`cd247fb76f8da64b242bc2baca262568515347e7`.

The faithful animation-loop sweep runs **1,044 deterministic trials: 12 on each of
80 campaign and seven daily boards**, including the six/eight/ten-piece dailies.
It tries alternate accessible screws and clear parking targets, with 0, 5, 30,
120, or 600 fixed steps between moves. A frame is 1/120 second. It stops advancing
when `sim.settled`, as the real animation loop does. Each final arrangement gets
up to 2,400 further steps (20 seconds) to settle.

- Baseline: four trials still moving at that limit, on **Two Sails, Locksmith,
  and Side Door**.
- Corrected solver: zero unresolved-motion trials in the same bounded sweep.
- 223/1,044 trials physically complete both before and after. The others normally
  remain caught or run out of parking. Those are **not automatically physics bugs**.
- All 80 authored campaign routes (497 moves) and seven immutable daily witnesses
  (76 moves) remain valid. Level geometry, IDs, hint routes, scores and unlocks
  are unchanged.

This is a sampled audit, **not exhaustive enumeration** of all orders, placements,
or continuous input timings, nor a proof that every possible contact is stable.
The script uses seed 99173. It samples legal moves from the current state, so after
physics diverges the exact later sampled actions can diverge too. The short known
failures below are separately replayed with identical actions.

## Short visible reproductions

Screws are zero-indexed in recipe order; targets are board coordinates. Waits are
fixed physics frames, stopping early if the real UI would settle.

| Level | Actions `(screw → target; wait)` |
|---|---|
| Two Sails | `3 → (245,35); 30`, `0 → (105,35); 30` |
| Locksmith | `3 → (245,35); 120`, `2 → (105,35); 120`, `1 → (175,175); 120` |
| Locksmith, rapid variant | `0 → (245,35); 5`, `3 → (105,35); 5`, `1 → (100,125); 5` |
| Side Door | `2 → (245,35); 30`, `0 → (245,150); 30`, `1 → (105,35); 30` |

These are short reproducible sequences, not formally minimal sequences.
`test-contact-orders.mjs` exercises them with the animation-loop stop rule. It also
runs three contact stress arrangements for 60 seconds without the UI cutoff.
The corrected stress cases have late reported contact depths below 0.11px and
maximum hinge error below 0.001px. Removing the recovered Two Sails supports still
releases both pieces and physically completes the level.

## Fix

Matter's translational contact correction can fight the exact zero-length pin
constraint: the contact moves a body out, then the pin moves it back. Merely raising
iterations did not fix the reproduced cases. Increasing damping or forcing sleep
would hide the symptom rather than resolve the contact.

The normal 120Hz solver, gravity, air friction, friction/restitution, and settle
threshold are unchanged. A recovery pass activates for implicated plates when
Matter reports >2.5px contact depth, or after ten seconds of unresolved motion
with continuing contact. It:

1. Uses all real compound material contacts, recalculating each contact before
   resolving it (not the decorative outline or stale manifold geometry).
2. Uses free-body inverse mass/inertia and hinged-body inertia about the actual
   fixed pivot, including the parallel-axis term.
3. Projects stored hinge velocity onto its permitted rotational degree of freedom
   using angular momentum, then resolves approaching normal velocity. Actual COM
   translational plus rotational kinetic energy is measured before/after; the
   projection/normal impulse must not add kinetic energy.
4. Separates overlapping bodies in those permitted coordinates. The cumulative
   correction budget is **4px of conservative material-point travel per body per
   outer frame**, not 4px per contact or iteration. This is a positional repair,
   not a claim of total energy conservation.
5. Removes radial zero-length-pin damping only on implicated plates. Unrelated
   hinges and global air friction retain their prior behavior.
6. Wakes a sleeping body only when it receives a nontrivial correction/impulse.
   It does not freeze pieces, remove material, or declare blocked pieces complete.

Recovery state is snapshot/Undo-compatible, including old snapshots without the
new optional fields. Tests cover fixed pivots, finite state, correction budgets,
actual kinetic-energy nonincrease, mid-motion Undo, live momentum-preserving
release, asleep supports, and continued physical completion after recovery.

## Historical alternate-route changes (explicitly tested)

Correcting contacts changes ten of 175 historical expansion winning witnesses:
three Stair Turn, five Crown assembly, one Suspended Switch, and one Arrow Lock.
The other 165 remain winning. Of 119 separate chain-reaction pack witnesses,
115 still win and four now have explicitly tested blocked outcomes (three in Cradle,
one in Offset Key). There are 14 changed historical routes in total.
The original historical route records are retained verbatim.

`contact-route-changes.json` records every changed trial, its exact old route,
baseline contact measurements, and its new first blocked target (or final caught
arrangement). `test-expansion.mjs` asserts those specific outcomes; it does not
silently skip failures or relax legality. The authored route for every affected
level still succeeds unchanged.

Example: Stair Turn's order `0,1,2,3,4,5,6` previously reported up to 7.32px contact
depth after the fourth move, and up to 1.62px at a settled intermediate state.
The corrected contact leaves its final `(140,290)` parking target covered. This
is evidence of a contact-sensitive old witness, not proof that every alternative
route or target must be impossible. Across the 14 changed trials the baseline
maximum reported contact depth was 2.57–7.32px.

Contact-depth figures are Matter's collision reports (sampled at the engine's
normal reporting stage), not a continuous-time geometric penetration proof.

## Continuous stress mode and limits

An additional 1,044-trial mode keeps stepping after `settled`; this deliberately
exceeds what the actual UI does. Baseline has six unresolved-motion endpoints;
the correction leaves one (Top-heavy lever). The faithful UI replay of that
arrangement has already stopped at the settled cutoff. This stress-only residual
is recorded, not relabeled as a visible endless-animation bug or hidden by a
forced-sleep change.

The audit is headless execution of the same vendored Matter engine used by the
web game. No touch/UI code changed. Existing progression, daily UI/data, undo,
rapid-input and live-revalidation tests pass. Actual iPhone Safari rendering and
on-device performance have not been measured by this audit. No claim of exhaustive
mobile/browser validation is made.

## Run

From the repository root, without dependencies or a build:

```sh
node test-contact-orders.mjs
node test.mjs
node test-progress.mjs
node test-pack.mjs
node test-expansion.mjs
node test-campaign80.mjs
node test-daily-data.mjs
node test-daily-engine.mjs
node test-daily-content.mjs
node test-daily-ui.mjs
AUDIT_OUTPUT=/tmp/order-audit.json node scripts/audit-physics-orders.mjs
AUDIT_CONTINUOUS=1 AUDIT_OUTPUT=/tmp/order-stress.json node scripts/audit-physics-orders.mjs
```

`physics-order-audit.json` contains before/after summaries and unresolved case
sequences. The audit generator preserves full per-trial output when run. The
regressions run in Pages CI. Publication is coordinated separately; this report
alone is not a claim that a public deployment has changed.
