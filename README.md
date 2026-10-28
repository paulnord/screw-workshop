# Screw Workshop

An original, calm, touch-friendly screw puzzle web game. Ten finite, authored puzzles. No ads, purchases, random rewards, timers, energy systems, streaks, or notifications. Nothing runs a server or sends player data. Completed-puzzle progress is stored locally in the browser.

## Play

Serve `dist/` with any static web host. Tap a silver screw, then an empty highlighted hole. Both screws must leave a plate before it falls. Higher plates can cover lower screws and holes. Parked screws stay on the board. Clear every plate to finish. Undo, restart, level selection, and solver-backed hints are included; all ten puzzles are available immediately.

On iPhone: open in Safari, then Share → Add to Home Screen. This is a web game, not an App Store application. Internet/site sign-in may be needed to open it; offline installation is not promised. Progress is local to each browser.

## Develop and test

No dependencies or build step. Use any static file server rooted at `dist/`, e.g. `python3 -m http.server 8000 --directory dist` (outside managed Sites preview environments).

```
node test.mjs
```

The tests solve every authored level using the same legal-move engine, and check completion, covered/occupied destinations, hidden screws, dead ends, undo-state restoration and restart. The solver explores removed-screw states; because plates only disappear and never move back, parked screws occupy permanently uncovered holes, so their exact positions do not alter solution feasibility.

## Files

- `dist/index.html`, `dist/style.css`: accessible, responsive interface, safe-area support and reduced-motion styling.
- `dist/engine.mjs`: puzzle data, pure rules, move validation and solver.
- `dist/app.mjs`: UI, local progress and controls.
- `dist/icon.svg`: original vector screw icon.
- `test.mjs`: dependency-free model tests.

All source, CSS/SVG artwork and level layouts were newly created for this project. No third-party game artwork, branding, audio, code or level data is included. It uses generic screw-and-plate puzzle mechanics, not a clone of a named game's expressive assets. This is an implementation statement, not legal clearance or a trademark search.
