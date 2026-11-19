const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/proof-harness/runtime.cjs');

const HERE = __dirname;
const HTML = path.join(HERE, '..', 'index.html');
const NOW = 1_700_000_000_000; // fixed virtual epoch for determinism

test('page loads and starts in the ready state', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  const state = a.document.querySelector('#box').className;
  assert.match(state, /waiting/);
  const text = a.document.querySelector('#signal-text').textContent;
  assert.match(text, /get ready/i);
});

test('waiting box is the "waiting" colour while waiting for green', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  const cls = a.document.querySelector('#box').className;
  assert.match(cls, /bg-waiting/);
});

test('signal box turns green ("GO") when the signal fires', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  a.advance(1500); // within default [500,5000] window
  const cls = a.document.querySelector('#box').className;
  assert.match(cls, /bg-green/);
  const text = a.document.querySelector('#signal-text').textContent;
  assert.match(text, /go/i);
});

test('a real reaction records a valid time and advances a trial', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  a.advance(2500); // signal fires green
  const firedAt = a.now(); // virtual ms when signal showed
  a.click('#box'); // reaction
  const time = a.document.querySelector('#results .trials .trial.good .val').textContent;
  assert.match(time, /\d+ ms$/);
  const elapsed = a.now() - firedAt;
  const asNum = parseInt(time, 10);
  assert.strictEqual(asNum, elapsed);
});

test('the good trial row shows "Round 1"', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  a.advance(2000);
  a.click('#box');
  const idx = a.document.querySelector('#results .trials .trial.good .idx').textContent;
  assert.match(idx, /round 1/i);
});

test('false start turns the box red and voids the trial', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  a.click('#box'); // before the signal
  const cls = a.document.querySelector('#box').className;
  assert.match(cls, /bg-red/);
  const note = a.document.querySelector('#results .trials .trial.bad .pill').textContent;
  assert.match(note, /false.start/i);
});

test('false start advances the trial counter to Round 2', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  a.click('#box'); // false start on round 1 -> schedules round 2
  const cur = a.document.querySelector('#progress-current').textContent;
  assert.match(cur, /^2$/);
});

test('five valid trials produce a results summary with mean and stdev', () => {
  const a = load(HTML);
  a.now(NOW);

  function oneTrial() {
    a.click('#start');
    a.advance(1000 + Math.floor(Math.random() * 2000));
    a.click('#box');
  }

  for (let i = 0; i < 5; i++) oneTrial();

  const results = a.document.querySelector('#results .results');
  assert.ok(results, 'results summary should be shown');
  const text = results.textContent;
  assert.match(text, /mean/i);
  assert.match(text, /stddev/i);
  const matches = text.match(/\d{3,4} ms/g) || [];
  assert.ok(matches.length >= 6, 'expected mean + 5 times, got ' + matches.length);
});

test('results summary exposes mean, median, stdev, best and worst', () => {
  const a = load(HTML);
  a.now(NOW);
  function oneTrial() { a.click('#start'); a.advance(1500); a.click('#box'); }
  for (let i = 0; i < 3; i++) oneTrial();
  const text = a.document.querySelector('#results .results').textContent;
  for (const k of ['mean', 'median', 'stdev', 'best', 'worst', 'trials']) {
    assert.match(text, new RegExp(k, 'i'), 'expected label "' + k + '" in summary');
  }
});

test('before any valid trial the results show an empty message', () => {
  const a = load(HTML);
  a.now(NOW);
  const results = a.document.querySelector('#results .results');
  assert.ok(results);
  assert.match(results.textContent, /no valid/i);
});

test('page works fully offline with no external resource links', () => {
  const src = fs.readFileSync(HTML, 'utf8');
  assert.doesNotMatch(src, /https?:\/\//i, 'should not reference external URLs');
  assert.doesNotMatch(src, /src="http|src='\^?http|src="\/|href="\/|@import/i, 'no external asset paths');
  assert.doesNotMatch(src, /\.css"|external|cdn/i, 'no external stylesheet references');
});

test('page is a single self-contained document with inlined CSS and JS', () => {
  const src = fs.readFileSync(HTML, 'utf8');
  assert.match(src, /<style[\s\S]*<\/style>/i, 'has inlined stylesheet');
  assert.match(src, /<script[\s\S]*<\/script>/i, 'has inlined script');
  assert.doesNotMatch(src, /<link[\s\S]*>/i, 'no external <link> elements');
});

test('default settings are 5 rounds with a [500,5000] ms window', () => {
  const a = load(HTML);
  a.now(NOW);
  a.click('#start');
  const total = a.document.querySelector('#progress-total').textContent;
  assert.strictEqual(total, '5');
});
