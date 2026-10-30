# Private progress storage

No production project, billing, Auth provider, web app registration or rules deployment is created by these files. Use a Firebase **Spark** project with email/password Auth and Firestore; do not upgrade to Identity Platform or attach billing for this feature.

Each completion is stored at `/users/{uid}/progress/{kind}__{puzzleId}__{revision}`. Fields are exactly `schema: 1`, `kind: campaign|daily`, `puzzleId`, `revision`, `bestMoves`, `completed: true`, and `updatedAt: serverTimestamp()`. IDs are bounded strings; move counts are integers from 1 to 100000. Updates cannot change puzzle identity or worsen the best move count. Use an online transaction to read the current record and write the minimum for the **same revision**. An offline queue is application-owned and UID-scoped; do not send a stale unconditional overwrite.

Only the authenticated UID may get/list/create/update/delete their progress. All other document paths are denied. Export reads the owner's collection; deletion removes those documents before deleting the Auth account. The UI must require recent reauthentication for account deletion. Deleting an Auth account alone does not remove Firestore documents. These rules protect privacy and record shape, not anti-cheat: the client is trusted to report legitimate wins, and a user can delete and recreate their own score.

## Local validation (no account required)

Java 21+ and Node 22+:

```sh
npm ci
npm run test:rules
```

This uses the `demo-screw-workshop` emulator-only project bound to localhost. The test refuses to run without a localhost emulator address. Tests cover unauthenticated/cross-user reads and writes, collection listing, unknown paths, malformed fields, identity changes, worsening scores, online minimum transactions, revision separation and atomic owner deletion. Never substitute a real project ID in the test script.

Official references:
- https://firebase.google.com/docs/rules/unit-tests
- https://firebase.google.com/docs/firestore/security/test-rules-emulator
- https://firebase.google.com/docs/firestore/manage-data/transactions

## Deletion tombstone

After recent reauthentication, write `/users/{uid}/control/account` with exactly `{deleting:true, updatedAt:serverTimestamp()}` before purging progress and deleting the Auth user. The marker is owner-readable and owner-writable but cannot be unset or deleted. Progress create/update checks the post-commit state with `existsAfter`, so stale devices and a same-batch attempt cannot recreate progress after deletion starts. Owner reads and deletes remain available for export/purge retries. A failure after marking deletion must resume deletion, not restore normal syncing.

## Tooling overrides and remaining audit limitation

The pinned development toolchain uses two narrow overrides: Firestore's gRPC client is updated within major1 to1.14.7, and gaxios6.7.1's UUID dependency to11.1.1 (the last CommonJS-compatible major needed here). The complete rules emulator suite passes with these overrides; `node firebase/test-tooling.mjs` additionally exercises gaxios's UUIDv4 multipart path without network. These are development dependencies, not copied into static browser assets.

Audit findings fell from ten (five high/five moderate) to three moderate transitive findings, all one underlying OpenTelemetry baggage-allocation advisory through CLI→Pub/Sub→core1.30.1. No patched1.x release is available; the fix requires core2.8+, outside Pub/Sub's declared1.x compatibility range. A broad major override was not applied solely to silence audit. Pub/Sub is not used by the local Firestore tests; keep development tooling isolated and localhost-only. This is not a clean dependency audit.
