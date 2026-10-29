# Daily workshop validation — October 29, 2026

The 80 campaign IDs, geometry and save keys remain unchanged. Daily identities include content hashes; campaign unlocks and daily bests are separate. Seven dated challenges are seeded through November 4. Additional dates require the documented publisher and CI, not a recurring autonomous process.

All seven JSON witnesses replay to actual physical completion (76 moves total). The first three density prototypes use 6/8/10 blocks and 12/14/16 screws respectively, compared with the campaign's maximum four blocks. Their targets equal their original screw counts, reaching the lower bound under intended anchor rules. This is not a formal proof against numerical-engine exploits or all continuous-time strategies.

The density series is a controlled scaling family, not three unrelated mechanic designs. Initial material does not overlap; the engine remains single-plane, with collisions between all blocks. Six- and ten-block winning routes exercise physical catches; the eight-block winning route avoids contact, but top-first probes catch the upper beam. All three support undo and clear in the replay policy. See dense-qa-report.json and dense-top-first-probe.json for evidence.

Minimum screw-center spacing on the 8/10-block boards is 55.9 world pixels (44.4 screen pixels for a 278-pixel board). These are geometry bounds, not device usability certification. Cloud physics-step timings are recorded separately and are not phone rendering/frame-rate benchmarks.

Browser checks: 320- and 390-pixel frames show the daily controls, board, move count and target without horizontal clipping. Today downloads with a saved-cache status. With the feed removed, its cached puzzle loads and completes for three stars in 12 moves; returning to campaign preserves progress. Unit tests cover future-date exclusion, archive loading, corrupt/oversized data, unsafe URLs/text, missing crypto, failed storage, canceled fetch races, and daily/campaign score separation. Actual iPhone Safari and WKWebView device testing remains separate.

The browser cache retains at most 24 puzzles within 2 MiB; the archive index supports 400 entries. The index must eventually gain pagination before exceeding that bound. No service worker is supplied: caching puzzle data does not imply cold offline web-shell launch. Native networking and daily-save bridging are deliberately not enabled by this web release.
