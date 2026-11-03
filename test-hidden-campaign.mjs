import assert from 'node:assert/strict';
import Matter from './dist/vendor/matter-0.20.0.min.js';
globalThis.Matter = Matter;

const E = await import('./dist/engine.mjs');
const {levelRecipes} = await import('./dist/levels.mjs');

assert.equal(levelRecipes.length, 100);
assert.equal(new Set(levelRecipes.map(level => level.id)).size, 100);
const reveals = E.levels.filter(level => level.id.startsWith('v8-reveal-'));
assert.equal(reveals.length, 20);

for (const [index, level] of reveals.entries()) {
  assert.equal(level.packIndex, 8 + Math.floor(index / 10));
  assert.equal(level.hidden.length, 1, `${level.id} has one concealed target`);
  assert.ok(level.solution.some(([, hole]) => hole === level.hidden[0]), `${level.id} route uses its concealed target`);

  const sim = E.createWorld(level);
  E.settle(sim, 5000);
  const initial = E.snapshot(sim);
  const hidden = level.hidden[0];
  assert.ok(E.shaftBlocked(sim, E.cells[hidden]), `${level.id} target starts under material`);
  assert.ok(!E.destinations(sim).includes(hidden), `${level.id} target is unavailable initially`);

  assert.ok(E.move(sim, ...level.solution[0]));
  E.step(sim, 20);
  const undone = E.createWorld(level, initial);
  assert.deepEqual(E.snapshot(undone), initial, `${level.id} Undo restores the concealed state`);

  let firstReveal = null;
  for (const [moveIndex, [bolt, hole]] of level.solution.entries()) {
    if (hole === hidden) assert.ok(E.destinations(undone).includes(hidden), `${level.id} hidden hole is revealed before use`);
    assert.ok(E.move(undone, bolt, hole), `${level.id} move ${moveIndex + 1} is legal`);
    E.settle(undone, 5000);
    assert.ok(undone.settled, `${level.id} move ${moveIndex + 1} settles`);
    if (firstReveal === null && !E.shaftBlocked(undone, E.cells[hidden])) firstReveal = moveIndex + 1;
  }
  assert.equal(firstReveal, level.hiddenRevealMove, `${level.id} reveal timing is stable`);
  assert.ok(E.complete(undone), `${level.id} tested route physically clears every plate`);
}

console.log('PASS: 20 concealed-hole levels start covered, reveal on schedule, survive Undo, and physically clear on their tested routes.');
