import Matter from '../dist/vendor/matter-0.20.0.min.js';
globalThis.Matter = Matter;

const E = await import('../dist/engine.mjs');
const {levelRecipes} = await import('../dist/levels.mjs');

const candidates = [];
for (let y = 75; y <= 385; y += 10) {
  for (let x = 55; x <= 295; x += 10) candidates.push([x, y]);
}

function samePoint(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a[0] === b[0] && a[1] === b[1];
}

function recipePoints(recipe) {
  return [
    ...(recipe.pieces ?? []).flatMap(piece => piece.anchors ?? piece.bar ?? []),
    ...(recipe.plates ?? []).flat(),
    ...(recipe.spares ?? []),
    ...(recipe.hidden ?? []),
  ];
}

function replay(recipe) {
  const level = E.compileRecipe(recipe);
  const sim = E.createWorld(level);
  E.settle(sim, 5000);
  const hidden = level.hidden[0];
  if (!E.shaftBlocked(sim, E.cells[hidden])) return null;
  let revealedAt = null;
  for (const [moveIndex, [bolt, hole]] of level.solution.entries()) {
    if (hole === hidden && E.shaftBlocked(sim, E.cells[hidden])) return null;
    if (!E.move(sim, bolt, hole)) return null;
    E.settle(sim, 5000);
    if (!sim.settled) return null;
    if (revealedAt === null && !E.shaftBlocked(sim, E.cells[hidden])) revealedAt = moveIndex;
  }
  return E.complete(sim) && revealedAt !== null ? {revealedAt} : null;
}

const sourceIndices = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 53, 56, 60, 63, 66, 70, 73, 76, 79];
const chosen = [];
for (const baseIndex of sourceIndices) {
  const base = levelRecipes[baseIndex];
  if (chosen.length >= 20) break;
  const occupied = recipePoints(base);
  let found = null;
  for (const point of candidates) {
    if (occupied.some(p => samePoint(p, point))) continue;
    for (let replaceAt = 1; replaceAt < base.solution.length; replaceAt++) {
      const recipe = structuredClone(base);
      recipe.id = `v8-reveal-${String(chosen.length + 1).padStart(2, '0')}`;
      recipe.name = `Reveal study ${chosen.length + 1}`;
      recipe.hidden = [point];
      recipe.solution[replaceAt][1] = point;
      const result = replay(recipe);
      if (result && result.revealedAt < replaceAt) {
        found = {baseIndex, baseId: base.id, replaceAt, point, revealedAt: result.revealedAt, recipe};
        break;
      }
    }
    if (found) break;
  }
  if (found) {
    chosen.push(found);
    console.error(`found ${chosen.length}/20 from ${base.id}: ${found.point} revealed after move ${found.revealedAt + 1}, used on move ${found.replaceAt + 1}`);
  }
}

console.log(JSON.stringify(chosen, null, 2));
if (chosen.length !== 20) process.exitCode = 1;
