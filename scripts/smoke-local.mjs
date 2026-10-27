import assert from 'node:assert/strict';

// Local Worker only. No valid email submission or provider contact is created.
const origin = 'http://127.0.0.1:8787';
for (const path of ['/', '/de', '/de/shop', '/de/concept', '/de/for-business', '/de/contact', '/de/partner']) {
  const response = await fetch(origin + path, { redirect: 'manual' });
  const html = await response.text();
  if (path === '/') {
    assert.ok([307, 308].includes(response.status));
    assert.match(new URL(response.headers.get('location'), origin).pathname, /^\/de\/?$/);
  } else {
    assert.equal(response.status, 200, path);
    assert.ok(/<!doctype html>/i.test(html), path);
    if (path === '/de/concept') assert.ok(html.includes('id="methode"'));
  }
  console.log(`${response.status} ${path}${path === '/de/concept' ? ' (#methode present)' : ''}`);
}

for (const path of ['/api/contact', '/api/partner/register', '/api/newsletter']) {
  const response = await fetch(origin + path, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'invalid' }),
  });
  assert.equal(response.status, 400, path);
  console.log(`400 ${path} (invalid submission)`);
}
const response = await fetch(origin + '/api/regeneration-check/evaluate', {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ answers: Array(20).fill(2), newsletterConsent: false }),
});
assert.equal(response.status, 200);
const evaluation = await response.json();
assert.equal(evaluation.success, true);
assert.equal(evaluation.newsletter.status, 'not_requested');
assert.equal(evaluation.resultEmail, 'not_requested');
console.log('200 /api/regeneration-check/evaluate (no optional email requests)');
