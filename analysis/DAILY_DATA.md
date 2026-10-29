# Downloadable daily puzzle contract

The campaign remains bundled and its IDs/progress are unchanged. Daily puzzles are plain JSON, not executable code. No timer, streak, account, notification or purchase is involved.

## API

`createDailyStore({baseURL, fetchImpl, storage, cryptoImpl, validateGeometry, fallbackPuzzle, networkEnabled, expectedOrigin})`

- `refresh({now})`: fetch/validate `index.json`, return `{today, entries, error}`. Dates use UTC. Future entries are not offered.
- `load(date)`: validate date; fetch and SHA-256-check the named puzzle, then use a valid cached copy on failure, otherwise trusted bundled practice. Returns `{date, puzzle, recipe, identity, source, error}`. `source` is `network`, `cache`, or `fallback`. **Fallback is practice, not today's shared challenge**, regardless of requested date.
- `archive()`: sorted available dates from the last accepted index (up to400 entries).
- `readProgress()` / `recordBest(identity,moves)`: separate daily bests; storage failure throws rather than claiming a save. No campaign unlocks change.

Caller must supply real-engine `validateGeometry(recipe)` and cancel the active physics loop before activating another recipe. The loader does not execute a full simulation on the UI thread. Publication CI must replay the witness and check completion, contacts, hinges and initial layout. JSON targets are verified route lengths, not automatically proofs of global optimality.

## Wire format

Index:
```json
{"schemaVersion":1,"rulesetVersion":"matter020-workshop-v1","entries":[{"date":"2026-10-29","id":"daily-2026-10-29","url":"2026-10-29.json","sha256":"<64 lowercase hexadecimal characters>"}]}
```
Puzzle:
```json
{"schemaVersion":1,"rulesetVersion":"matter020-workshop-v1","id":"daily-2026-10-29","name":"Daily workshop","recipe":{"id":"daily-2026-10-29","name":"Daily workshop","tip":"Choose the hinge.","plates":[[[105,180],[245,180]]],"spareCount":1,"hidden":[],"solution":[[0,[175,35]],[1,[105,180]]]},"targetMoves":2,"witnessPolicy":"settle-after-each-move-2400"}
```

Custom `pieces` may use `anchors` plus `outline`/convex `components`, or a two-coordinate `bar`. Coordinates are actual board coordinates, not mutable global cell indexes. `spares` may replace `spareCount`. Recipe and wrapper IDs/names must agree. Strict field allowlists reject arbitrary content. Names/tips remain plain text; UI must use text rendering, never treat them as markup.

## Bounds and integrity

- HTTP(S) same-origin base supplied by the application; puzzle URLs are filenames only, no paths or remote URLs. Browser-origin checking rejects a different host, and fetch uses same-origin credentials so owner-private Sites retain their existing access checks. Cross-origin credentials are never sent; redirects and URL-embedded credentials are rejected. Non-browser tests may supply expectedOrigin explicitly.
- SHA-256 covers exact UTF-8 JSON file bytes. This detects changed content, but is not independent authentication if an attacker controls both index and files.
- Published date ID/hash cannot change across refreshes of a cached index. Known past dates remain in the archive if omitted from a later index; a merge exceeding400 entries is rejected until a future paginated archive format is introduced. Publish corrections with a new date/identity rather than rewriting existing challenges.
-128KiB index and puzzle limits;400 index entries;10 blocks;20 original screws;40 witness moves; bounded vertices/components/holes/text; finite coordinates inside350×430 board.
- Download timeout10seconds. Streaming response size is bounded before JSON parsing. Unknown schema or ruleset fails closed.
- Cache keeps up to24 puzzles within2MiB. Cache is re-hashed and geometry-validated before use. Corrupt data falls back, not executed. Up to500 best scores are retained separately.
- Trusted fallback uses `fallback:<id>@matter020-workshop-v1`, so it remains playable without secure hashing. Never use this identity for downloaded content; change the bundled fallback ID if its geometry changes.

## Native limitation

The current WKWebView shell deliberately blocks network connections and accepts only campaign saves. Set `networkEnabled:false` there and label the bundled fallback honestly. This web feature does not implement native daily downloads or native daily persistence. A later native feature needs a narrowly scoped downloader/cache and separate daily progress bridge; do not broadly relax the current page/navigation restrictions. Browser offline cached data also does not promise a cold offline shell launch without a service-worker/app-shell strategy.

Run `node test-daily-data.mjs` for schema, UTC, identity/hash, network failure, corrupt/oversized cache/download, future-date, hostile URL/text, missing crypto, storage failure and campaign-isolation checks.
