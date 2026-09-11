import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { transformSync } from 'esbuild';

function events() {
  const listeners = new Map();
  return {
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    emit(name, value = {}) { for (const fn of listeners.get(name) || []) fn(value); },
    count(name) { return listeners.get(name)?.size || 0; }
  };
}

function load(relative, react, globals) {
  const source = fs.readFileSync(new URL(relative, import.meta.url), 'utf8');
  const { code } = transformSync(source, { loader: 'jsx', format: 'cjs', jsx: 'automatic' });
  const exports = {};
  const module = { exports };
  vm.runInNewContext(code, {
    exports, module,
    require: name => name === 'react' ? react : { jsx: () => null },
    ...globals
  });
  return module.exports.default;
}

test('cursor batches movement and removes work on touch, tab hiding and unmount', () => {
  const win = events(), doc = events(), root = events(), media = { ...events(), matches: true };
  const element = { style: {} }, frames = new Map();
  let effect, id = 0;
  win.matchMedia = () => media;
  doc.documentElement = root;
  doc.hidden = false;
  const Cursor = load('../src/common/CustomCursor.jsx', {
    useRef: () => ({ current: element }), useEffect: fn => { effect = fn; }
  }, { window: win, document: doc,
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: key => frames.delete(key)
  });
  Cursor(); const cleanup = effect();
  for (let i = 0; i < 100; i++) win.emit('pointermove', { pointerType: 'mouse', clientX: i, clientY: i });
  assert.equal(frames.size, 1);
  const paint = [...frames.values()][0]; frames.clear(); paint();
  assert.match(element.style.transform, /99px, 99px/);
  win.emit('pointermove', { pointerType: 'touch', clientX: 2, clientY: 2 });
  assert.equal(frames.size, 0);
  win.emit('pointermove', { pointerType: 'mouse', clientX: 3, clientY: 3 });
  doc.hidden = true; doc.emit('visibilitychange');
  assert.equal(frames.size, 0);
  assert.equal(element.style.opacity, '0');
  media.matches = false; media.emit('change');
  assert.equal(win.count('pointermove'), 0);
  cleanup();
  assert.equal(media.count('change'), 0);
  assert.equal(doc.count('visibilitychange'), 0);
});

test('3D loads only near viewport and pauses outside viewport or hidden tab', () => {
  const doc = { ...events(), hidden: false }, observers = [], states = [];
  let effect;
  class Observer {
    constructor(fn, options) { this.fn = fn; this.options = options; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const useVisibility = load('../src/common/useSceneVisibility.js', {
    useState: initial => { const i = states.length; states.push(initial); return [initial, value => { states[i] = value; }]; },
    useEffect: fn => { effect = fn; }
  }, { window: { IntersectionObserver: Observer }, IntersectionObserver: Observer, document: doc });
  useVisibility({ current: {} }); const cleanup = effect();
  assert.deepEqual(states, [false, false]);
  observers[0].fn([{ isIntersecting: true }]);
  assert.deepEqual(states, [true, false]);
  observers[1].fn([{ isIntersecting: true }]);
  assert.deepEqual(states, [true, true]);
  doc.hidden = true; doc.emit('visibilitychange');
  assert.deepEqual(states, [true, false]);
  doc.hidden = false; doc.emit('visibilitychange');
  assert.deepEqual(states, [true, true]);
  observers[1].fn([{ isIntersecting: false }]);
  assert.deepEqual(states, [true, false]);
  cleanup();
  assert.ok(observers.every(o => o.disconnected));
  assert.equal(doc.count('visibilitychange'), 0);
});

test('optimized model keeps geometry bytes and accessors identical', () => {
  const parse = name => {
    const data = fs.readFileSync(new URL(`../src/assets/lanyard/${name}`, import.meta.url));
    const size = data.readUInt32LE(12);
    return { json: JSON.parse(data.subarray(20, 20 + size)), binary: data.subarray(28 + size) };
  };
  const before = parse('card.glb'), after = parse('card-optimized.glb');
  assert.deepEqual(after.json.meshes, before.json.meshes);
  assert.deepEqual(after.json.accessors, before.json.accessors);
  assert.deepEqual(after.json.nodes, before.json.nodes);
  assert.deepEqual(after.binary, before.binary.subarray(0, after.binary.length));
  assert.equal(after.json.images, undefined);
  assert.ok(after.binary.length < before.binary.length * 0.1);
});

test('Duo Fold remaps sensors for every screen orientation', async () => {
  const { remapOrientation } = await import('../src/common/DuoFold/motion.js');
  assert.deepEqual(remapOrientation(10, 20, 0), { x: 20, y: 10 });
  assert.deepEqual(remapOrientation(10, 20, 90), { x: 10, y: -20 });
  assert.deepEqual(remapOrientation(10, 20, 180), { x: -20, y: -10 });
  assert.deepEqual(remapOrientation(10, 20, 270), { x: -10, y: 20 });
});

test('Duo Fold pointer and presentation values stay bounded', async () => {
  const {
    MAX_TILT,
    foldPresentation,
    pointerTilt,
    predictTilt,
    renderingQuality,
    shortestAngleDelta
  } = await import('../src/common/DuoFold/motion.js');
  const tilt = pointerTilt(390, 0, 390, 844);
  assert.equal(tilt.x, 24);
  assert.equal(tilt.y, 18);
  assert.equal(pointerTilt(10_000, -10_000, 390, 844).x, MAX_TILT);
  const folded = foldPresentation(MAX_TILT, MAX_TILT);
  assert.equal(folded.amount, 1);
  assert.equal(folded.soft, 1);
  assert.equal(folded.medium, 1);
  assert.equal(folded.strong, 1);
  assert.deepEqual(foldPresentation(0, 0), {
    amount: 0,
    direction: -90,
    soft: 0,
    medium: 0,
    strong: 0
  });
  assert.equal(shortestAngleDelta(-179, 179), 2);
  assert.equal(shortestAngleDelta(179, -179), -2);
  assert.equal(predictTilt(44, 100), MAX_TILT);
  assert.equal(renderingQuality({ deviceMemory: 2, hardwareConcurrency: 8 }), 'balanced');
  assert.equal(renderingQuality({ deviceMemory: 8, hardwareConcurrency: 8 }), 'high');
});
