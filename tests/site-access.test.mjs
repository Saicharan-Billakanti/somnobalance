import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSiteAccess } from '../src/lib/siteAccess.ts';

const env = { SITE_ACCESS_ENABLED: 'true', SITE_ACCESS_PASSWORD: 'test-preview-password' };
const request = (path = '/', options = {}) => new Request(`https://somnobalance.com${path}`, options);
const authorization = (password) => `Basic ${Buffer.from(`somnobalance:${password}`).toString('base64')}`;

test('site access protects pages, APIs and static assets on every hostname', () => {
  for (const host of ['somnobalance.com', 'www.somnobalance.com', 'somnobalance.somnobalance.workers.dev']) {
    for (const path of ['/', '/de/shop', '/api/auth/me', '/brand/logo.webp', '/_next/static/app.js']) {
      const response = checkSiteAccess(new Request(`https://${host}${path}`), env);
      assert.equal(response.status, 401);
      assert.match(response.headers.get('www-authenticate'), /^Basic /);
      assert.match(response.headers.get('cache-control'), /no-store/);
    }
  }
});

test('site access accepts the shared credential and rejects incorrect or malformed credentials', () => {
  assert.equal(checkSiteAccess(request('/', { headers: { authorization: authorization(env.SITE_ACCESS_PASSWORD) } }), env), null);
  for (const value of [authorization('wrong'), 'Basic invalid', 'Bearer token']) {
    assert.equal(checkSiteAccess(request('/', { headers: { authorization: value } }), env).status, 401);
  }
});

test('enabled protection fails closed when the secret is missing', () => {
  assert.equal(checkSiteAccess(request(), { SITE_ACCESS_ENABLED: 'true' }).status, 503);
  assert.equal(checkSiteAccess(request(), {}), null);
});

test('only the exact Stripe POST webhook bypasses the site gate', () => {
  assert.equal(checkSiteAccess(request('/api/webhooks/stripe', { method: 'POST' }), env), null);
  assert.equal(checkSiteAccess(request('/api/webhooks/stripe'), env).status, 401);
  assert.equal(checkSiteAccess(request('/api/webhooks/stripe/other', { method: 'POST' }), env).status, 401);
});
