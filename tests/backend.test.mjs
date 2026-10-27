import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { env } from './worker-env.mjs';
import { POST as contact } from '../src/app/api/contact/route.ts';
import { POST as partner } from '../src/app/api/partner/register/route.ts';
import { POST as newsletter } from '../src/app/api/newsletter/route.ts';
import { POST as evaluate } from '../src/app/api/regeneration-check/evaluate/route.ts';
import { requestNewsletter, CONSENT_VERSION } from '../src/lib/newsletter.ts';
import { sendNotification, sendOtpEmail } from '../src/lib/mailer.ts';
import { consumeLimit } from '../src/lib/submission.ts';
import { POST as register } from '../src/app/api/auth/register/route.ts';
import { POST as login } from '../src/app/api/auth/login/route.ts';
import { POST as changePassword } from '../src/app/api/auth/password/change/route.ts';
import { hashPassword, verifyPassword } from '../src/lib/auth.ts';
import { POST as returnOrder } from '../src/app/api/orders/return/route.ts';
import { POST as createOrder } from '../src/app/api/orders/route.ts';
import { sendPhoneOtp, verifyPhoneOtp, validatePhoneVerificationToken } from '../src/lib/otpService.ts';
import { submitBusinessApplication, getBusinessApplicationByEmail } from '../src/lib/businessService.ts';
import { registerAffiliate, createAffiliateCoupon, validateCoupon, processOrderCommission, requestAffiliatePayout, processAffiliatePayout } from '../src/lib/affiliateService.ts';
import { createCustomProduct, getCombinedProducts } from '../src/lib/storeService.ts';

let sql;
let calls;
let responder;
const originalFetch = globalThis.fetch;
function d1(database) {
  return { async batch(statements) { return Promise.all(statements.map(statement => statement.run())); }, prepare(query) {
    let values = [];
    return {
      bind(...args) { values = args; return this; },
      async first() { return database.prepare(query).get(...values) ?? null; },
      async all() { return { results: database.prepare(query).all(...values) }; },
      async run() { const result = database.prepare(query).run(...values); return { success: true, results: [], meta: { changes: result.changes } }; },
    };
  } };
}
function request(body, path = '/api/contact', headers = {}) {
  return new Request(`https://site.example${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.1', ...headers }, body: JSON.stringify(body),
  });
}
const valid = { name: 'Ada <script>', email: 'ada@example.com', topic: 'general', message: '<img src=x> & "hello"' };
beforeEach(() => {
  sql = new DatabaseSync(':memory:');
  for (const name of ['0001_init.sql', '0002_otp_verification.sql', '0003_newsletter_and_submission_limits.sql', '0004_app_data_in_d1.sql', '0005_order_returns.sql', '0006_stripe_checkout.sql']) sql.exec(readFileSync(new URL(`../migrations/${name}`, import.meta.url), 'utf8'));
  process.env.SESSION_SECRET = 'test-session-secret';
  delete process.env.TURNSTILE_SECRET_KEY;
  globalThis.testCurrentUser = null;
  for (const key of Object.keys(env)) delete env[key];
  Object.assign(env, { DB: d1(sql), RESEND_API_KEY: 'test-key', MAIL_FROM: 'SomnoBalance <sender@example.com>', MAIL_TO: 'recipient@example.com',
    ABUSE_HMAC_KEY: 'test-only-key-at-least-32-characters-long', BREVO_API_KEY: 'test-brevo', BREVO_LIST_ID: '12', BREVO_DOI_TEMPLATE_ID: '34', BREVO_DOI_REDIRECT_URL: 'https://site.example/de' });
  calls = [];
  responder = (url, body) => url.includes('resend.com') ? Response.json({ id: 'mail-test' })
    : url.includes('brevo.com') ? Response.json({}, { status: 201 })
    : Response.json({ ...body, id: 'affiliate-test' }, { status: 201 });
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.ok(url.startsWith('https://api.resend.com/') || url.startsWith('https://api.brevo.com/') || url.startsWith('https://database.example/'), `Unexpected external request: ${url}`);
    const body = JSON.parse(init.body);
    calls.push({ url, body, headers: init.headers, signal: init.signal });
    return responder(url, body);
  };
});
afterEach(() => { globalThis.fetch = originalFetch; sql.close(); });

for (const topic of ['general', 'business', 'partner']) {
  test(`valid ${topic} enquiry preserves fields, Reply-To and escaped HTML`, async () => {
    const response = await contact(request({ ...valid, topic }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).notification, 'accepted');
    const mail = calls[0].body;
    assert.equal(mail.reply_to, valid.email);
    assert.ok(mail.text.includes(valid.message));
    assert.ok(!mail.html.includes('<img'));
    assert.ok(mail.html.includes('&lt;img'));
    assert.ok(mail.subject.includes(topic === 'business' ? 'Unternehmen' : topic === 'partner' ? 'Partner' : 'Kontakt'));
    assert.ok(calls[0].signal);
  });
}
test('invalid enquiries never reach providers', async () => {
  for (const body of [{ ...valid, email: 'bad' }, { ...valid, name: '  ' }, { ...valid, message: '' }, { ...valid, topic: 'invalid' }]) {
    assert.equal((await contact(request(body))).status, 400);
  }
  assert.equal(calls.length, 0);
});
test('business page enquiries are saved to the B2B application list and emailed', async () => {
  const response = await contact(request({
    ...valid,
    topic: 'business',
    companyName: 'Ada Wellness Hotel',
    phone: '+49 30 123456',
    businessType: 'Hotel',
    message: 'Please send wholesale information.',
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).notification, 'accepted');
  const application = sql.prepare('SELECT * FROM "BusinessApplication" WHERE email = ?').get(valid.email);
  assert.equal(application.companyName, 'Ada Wellness Hotel');
  assert.equal(application.contactName, valid.name);
  assert.equal(application.businessType, 'Hotel');
  assert.equal(application.phone, '+49 30 123456');
  assert.equal(application.status, 'pending');
  const message = sql.prepare('SELECT * FROM "BusinessMessage" WHERE applicationId = ?').get(application.id);
  assert.equal(message.senderRole, 'business');
  assert.equal(message.message, 'Please send wholesale information.');
  assert.equal(calls.length, 1);
});
test('partner application retains service storage and sends description, not banking details', async () => {
  const response = await partner(request({ ...valid, businessType: 'Professional', description: 'Please call me', iban: 'PRIVATE-BANK-DATA' }));
  assert.equal(response.status, 200);
  const mail = calls.find(c => c.url.includes('resend')).body;
  assert.ok(mail.text.includes('Please call me'));
  assert.ok(mail.subject.includes('Bewerbung'));
  assert.ok(!mail.text.includes('PRIVATE-BANK-DATA'));
});
test('invalid partner email is rejected', async () => {
  assert.equal((await partner(request({ name: 'Ada', email: 'not-email' }))).status, 400);
  assert.equal(calls.length, 0);
});
test('missing mail config saves enquiries and reports missing notification without provider calls', async () => {
  delete env.MAIL_TO;
  const response = await contact(request(valid));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, persisted: true, notification: 'failed' });
  assert.equal((await partner(request(valid))).status, 503);
  assert.equal(calls.length, 0);
});
test('provider rejection reports persisted but not accepted', async () => {
  responder = () => Response.json({ message: 'private provider error' }, { status: 403 });
  const response = await contact(request(valid));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, persisted: true, notification: 'failed' });
});
test('network failure and missing config never report OTP success', async () => {
  responder = () => { throw new Error('timeout'); };
  assert.equal((await sendNotification('Subject', 'Body')).status, 'failed');
  delete env.RESEND_API_KEY;
  assert.equal((await sendOtpEmail('ada@example.com', '123456')).success, false);
});
test('password change requires the current password and stores only a new bcrypt hash', async () => {
  const email = 'admin@somnobalance.com';
  const oldHash = await hashPassword('old-password-123');
  sql.prepare(`INSERT INTO "User" (id, email, passwordHash, firstName, lastName, emailVerifiedAt, country, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run('admin-test', email, oldHash, 'SomnoBalance', 'Admin', new Date().toISOString(), 'Germany', 'admin');
  globalThis.testCurrentUser = { id: 'admin-test', email, role: 'admin' };
  const makeRequest = (currentPassword, newPassword) => new Request('https://site.example/api/auth/password/change', {
    method: 'POST', headers: { 'content-type': 'application/json', 'origin': 'https://site.example', 'cf-connecting-ip': '192.0.2.9' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const rejected = await changePassword(makeRequest('incorrect-password', 'new-password-456'));
  assert.equal(rejected.status, 400);
  assert.equal(await verifyPassword('old-password-123', sql.prepare('SELECT passwordHash FROM "User" WHERE id = ?').get('admin-test').passwordHash), true);

  const accepted = await changePassword(makeRequest('old-password-123', 'new-password-456'));
  assert.equal(accepted.status, 200);
  const updatedHash = sql.prepare('SELECT passwordHash FROM "User" WHERE id = ?').get('admin-test').passwordHash;
  assert.notEqual(updatedHash, oldHash);
  assert.equal(await verifyPassword('new-password-456', updatedHash), true);
  assert.equal(await verifyPassword('old-password-123', updatedHash), false);
});
test('admin login returns the database role for the client session', async () => {
  const email = 'admin@somnobalance.com';
  const passwordHash = await hashPassword('admin-password-123');
  sql.prepare(`INSERT INTO "User" (id, email, passwordHash, firstName, lastName, emailVerifiedAt, country, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run('admin-login-test', email, passwordHash, 'Site', 'Admin', new Date().toISOString(), 'Germany', 'admin');
  const response = await login(new Request('https://site.example/api/auth/login', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'admin-password-123' }),
  }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.user.role, 'admin');
  assert.equal(body.user.isAdmin, true);
  assert.ok(response.headers.get('set-cookie')?.includes('sb_session='));
});
test('newsletter uses DOI, stores UTC evidence, ignores client source/time and excludes health data', async () => {
  const before = Date.now();
  const response = await newsletter(request({ email: ' ADA@example.com ', consent: true, source: 'invented', submittedAt: '1900', answers: [4] }, '/api/newsletter'));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).newsletter.status, 'pending_confirmation');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
  assert.deepEqual(calls[0].body, { email: 'ada@example.com', includeListIds: [12], templateId: 34, redirectionUrl: 'https://site.example/de', contactPixelTrackingConsent: false });
  const row = sql.prepare('SELECT * FROM NewsletterConsentRequest').get();
  assert.equal(row.source, 'footer');
  assert.equal(row.consentVersion, CONSENT_VERSION);
  assert.equal(row.status, 'provider_accepted');
  assert.ok(row.submittedAt.endsWith('Z') && Date.parse(row.submittedAt) >= before);
  assert.ok(!('confirmedAt' in row));
});
test('newsletter requires explicit consent and a valid email', async () => {
  for (const body of [{ email: 'bad', consent: true }, { email: 'ada@example.com', consent: false }, { email: 'ada@example.com' }, { email: 'ada@example.com', consent: 'true' }]) {
    assert.equal((await newsletter(request(body))).status, 400);
  }
  assert.equal(calls.length, 0);
});
test('concurrent duplicates across sources produce at most one DOI call', async () => {
  const results = await Promise.all(Array.from({ length: 6 }, (_, index) => requestNewsletter({ email: 'ada@example.com', consent: true }, index % 2 ? 'footer' : 'regeneration-check')));
  assert.ok(results.every(r => r.status === 'pending_confirmation'));
  assert.equal(calls.length, 1);
});
test('provider duplicate returns same public response without claiming subscription', async () => {
  responder = () => Response.json({ code: 'duplicate_parameter' }, { status: 400 });
  const response = await newsletter(request({ email: 'ada@example.com', consent: true }));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).newsletter.status, 'pending_confirmation');
  assert.equal(sql.prepare('SELECT status FROM NewsletterConsentRequest').get().status, 'duplicate');
});
test('provider duplicate_request is also neutral', async () => {
  responder = () => Response.json({ code: 'duplicate_request' }, { status: 400 });
  const response = await newsletter(request({ email: 'ada@example.com', consent: true }));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).newsletter.status, 'pending_confirmation');
});
test('partner provider failure preserves application without reporting mail acceptance', async () => {
  responder = (url, body) => url.includes('resend.com')
    ? Response.json({}, { status: 500 }) : Response.json({ ...body, id: 'saved' }, { status: 201 });
  const response = await partner(request({ name: 'Ada', email: 'ada@example.com' }));
  assert.equal(response.status, 502);
  const result = await response.json();
  assert.equal(result.persisted, true);
  assert.equal(result.notification, 'failed');
});
test('invalid newsletter configuration never starts a provider request', async () => {
  for (const [name, value] of [['BREVO_LIST_ID', '0'], ['BREVO_DOI_TEMPLATE_ID', '1.5'], ['BREVO_DOI_REDIRECT_URL', 'http://insecure.example']]) {
    const saved = env[name];
    env[name] = value;
    assert.equal((await requestNewsletter({ email: 'ada@example.com', consent: true }, 'footer')).status, 'failed');
    env[name] = saved;
  }
  assert.equal(calls.length, 0);
});
test('missing abuse secret blocks sends and malformed JSON returns 400', async () => {
  delete env.ABUSE_HMAC_KEY;
  assert.equal((await contact(request(valid))).status, 503);
  assert.equal(calls.length, 0);
  const malformed = new Request('https://site.example/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
  assert.equal((await contact(malformed)).status, 400);
});
test('daily DOI cap survives expired cooldowns', async () => {
  for (let i = 0; i < 4; i++) {
    assert.equal((await requestNewsletter({ email: 'ada@example.com', consent: true }, 'footer')).status, 'pending_confirmation');
    // Expire only the 15-minute bucket; keep the daily bucket.
    sql.exec('UPDATE SubmissionLimit SET expiresAt = 0 WHERE expiresAt < unixepoch() + 1800');
  }
  assert.equal(calls.length, 3);
});
for (const status of [400, 401, 429, 500]) {
  test(`Brevo ${status} is an explicit failure`, async () => {
    responder = () => Response.json({ code: 'other' }, { status });
    assert.equal((await newsletter(request({ email: 'ada@example.com', consent: true }))).status, 503);
    assert.equal(sql.prepare('SELECT status FROM NewsletterConsentRequest').get().status, 'provider_rejected');
  });
}
test('missing config/storage and invalid source do not call Brevo', async () => {
  assert.equal((await requestNewsletter({ email: 'ada@example.com', consent: true }, 'forged')).status, 'failed');
  delete env.DB;
  assert.equal((await requestNewsletter({ email: 'ada@example.com', consent: true }, 'footer')).status, 'failed');
  delete env.BREVO_API_KEY;
  assert.equal((await newsletter(request({ email: 'ada@example.com', consent: true }))).status, 503);
  assert.equal(calls.length, 0);
});
test('newsletter timeout records uncertain outcome without invented confirmation', async () => {
  responder = () => { throw new Error('timeout'); };
  assert.equal((await requestNewsletter({ email: 'ada@example.com', consent: true }, 'footer')).status, 'failed');
  assert.equal(sql.prepare('SELECT status FROM NewsletterConsentRequest').get().status, 'provider_unknown');
});
for (const consent of [false, true]) {
  test(`quiz consent ${consent} controls only DOI`, async () => {
    const response = await evaluate(request({ answers: Array(20).fill(2), email: 'ada@example.com', newsletterConsent: consent }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.newsletter.status, consent ? 'pending_confirmation' : 'not_requested');
    assert.equal(body.resultEmail, 'not_requested');
    assert.equal(calls.length, consent ? 1 : 0);
    if (consent) assert.equal(sql.prepare('SELECT source FROM NewsletterConsentRequest').get().source, 'regeneration-check');
  });
}
test('quiz evaluation succeeds independently of newsletter failure', async () => {
  responder = () => new Response('', { status: 500 });
  const response = await evaluate(request({ answers: Array(20).fill(2), email: 'ada@example.com', newsletterConsent: true }));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.ok(body.result.title);
  assert.equal(body.newsletter.status, 'failed');
});
test('requested quiz results go to participant, not admin; no implicit newsletter signup', async () => {
  const response = await evaluate(request({ answers: Array(20).fill(2), email: 'ada@example.com', sendResultsByEmail: true }));
  assert.equal((await response.json()).resultEmail, 'accepted');
  assert.deepEqual(calls[0].body.to, ['ada@example.com']);
  assert.equal(calls.length, 1);
  assert.ok(!calls[0].body.text.includes('Subscribed'));
});
test('quiz rejects missing/partial/fractional answers and consent without email', async () => {
  for (const body of [{}, { answers: { q01: 1 } }, { answers: Array(20).fill(1.5) }, { answers: Array(20).fill(2), newsletterConsent: true }]) {
    assert.equal((await evaluate(request(body))).status, 400);
  }
});
test('origin, honeypot and actual body size are checked', async () => {
  assert.equal((await contact(request(valid, '/api/contact', { origin: 'https://evil.example' }))).status, 403);
  assert.equal((await contact(request({ ...valid, honeypot: 'bot' }))).status, 400);
  assert.equal((await contact(request({ ...valid, message: 'a'.repeat(33000) }))).status, 413);
  assert.equal(calls.length, 0);
});
test('shared atomic limit stores no raw IP and expires', async () => {
  const results = await Promise.all(Array.from({ length: 12 }, () => consumeLimit('ip', '192.0.2.5', 600, 10)));
  assert.equal(results.filter(Boolean).length, 10);
  const row = sql.prepare('SELECT * FROM SubmissionLimit').get();
  assert.ok(!JSON.stringify(row).includes('192.0.2.5'));
  sql.exec('UPDATE SubmissionLimit SET expiresAt = 0');
  assert.equal(await consumeLimit('ip', '192.0.2.5', 600, 10), true);
});

for (const outcome of ['accepted', 'rejected', 'missing', 'network']) {
  test(`registration OTP ${outcome} reports actual delivery outcome`, async () => {
    if (outcome === 'missing') delete env.RESEND_API_KEY;
    if (outcome === 'rejected') responder = () => Response.json({}, { status: 403 });
    if (outcome === 'network') responder = () => { throw new Error('offline'); };
    const response = await register(request({ firstName: 'Ada', lastName: 'Test', email: 'ada@example.com', password: 'test-password-123' }));
    assert.equal(response.status, outcome === 'accepted' ? 200 : 502);
    const body = await response.json();
    assert.equal(body.requiresVerification, true);
    if (outcome !== 'accepted') { assert.equal(body.ok, false); assert.equal(body.persisted, true); assert.equal(body.emailDelivery, 'failed'); }
    assert.equal(sql.prepare('SELECT count(*) AS n FROM User').get().n, 1);
  });
}
test('phone OTP cannot simulate dispatch or accept arbitrary codes without provider', async () => {
  assert.equal((await sendPhoneOtp('+491701234567')).success, false);
  assert.equal((await verifyPhoneOtp('+491701234567', '123456')).success, false);
  delete process.env.SESSION_SECRET;
  delete process.env.JWT_SECRET;
  assert.equal((await verifyPhoneOtp('+491701234567', '654321')).success, false);
  assert.equal(validatePhoneVerificationToken('forged.signature', '+491701234567').isValid, false);
});
test('return requires authentication and hides another customer order', async () => {
  assert.equal((await returnOrder(request({ orderId: 'unknown' }))).status, 401);
  globalThis.testCurrentUser = { email: 'owner@example.com' };
  // No D1 order exists for this account.
  responder = () => Response.json({ id: 'other-order', email: 'other@example.com' });
  globalThis.fetch = async () => Response.json({ id: 'other-order', email: 'other@example.com' });
  assert.equal((await returnOrder(request({ orderId: 'other-order' }))).status, 404);
});
test('owner can request return through existing order service', async () => {
  globalThis.testCurrentUser = { email: 'owner@example.com' };
  sql.prepare('INSERT INTO "Order" (id,firstName,lastName,email,street,postalCode,city,country,subtotal,shipping,total) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run('owned-order','A','B','owner@example.com','Road 1','12345','Berlin','DE',10,0,10);
  const response = await returnOrder(request({ orderId: 'owned-order' }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(sql.prepare('SELECT returnStatus FROM "Order" WHERE id=?').get('owned-order').returnStatus, 'REQUESTED');
});
test('business applications, store records, and affiliate commissions persist in D1', async () => {
  const application = await submitBusinessApplication({ userId: 'user-1', companyName: 'Hotel Berlin', contactName: 'Ada', email: 'ada@hotel.example', businessType: 'hotel', notes: 'Interested' });
  assert.equal((await getBusinessApplicationByEmail('ADA@HOTEL.EXAMPLE')).id, application.id);
  assert.equal(application.messages[0].message, 'Interested');

  const custom = await createCustomProduct({ name: 'Night Kit', category: 'Ritual', price: 19.5, tagline: 'Rest', description: 'A test product' });
  assert.ok((await getCombinedProducts()).some((p) => p.id === custom.id && p.isCustom));

  const affiliate = await registerAffiliate({ name: 'Partner Ada', email: 'partner@example.com' });
  sql.prepare('UPDATE Affiliate SET status=? WHERE id=?').run('active', affiliate.id);
  await createAffiliateCoupon({ affiliateId: affiliate.id, couponCode: 'REST10', discountRate: 10, commissionRate: 20 });
  const validation = await validateCoupon('rest10', 100, 'buyer@example.com');
  assert.equal(validation.valid, true);
  sql.prepare('INSERT INTO "Order" (id,firstName,lastName,email,street,postalCode,city,country,subtotal,shipping,total) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run('commission-order','Buyer','One','buyer@example.com','Road 1','12345','Berlin','DE',90,0,90);
  const commission = await processOrderCommission({ orderId: 'commission-order', orderTotal: 90, subtotal: 100, customerEmail: 'buyer@example.com', couponCode: 'REST10' });
  assert.equal(commission.commissionAmount, 18);
  assert.equal(sql.prepare('SELECT count(*) n FROM CommissionRecord WHERE orderId=?').get('commission-order').n, 1);
});

test('Stripe Connect payout requests reserve the exact balance and transfers are idempotent', async () => {
  const affiliate = await registerAffiliate({ name: 'Partner Ada', email: 'partner@example.com' });
  sql.prepare('UPDATE Affiliate SET status=?,paymentMethod=?,stripeAccountId=? WHERE id=?').run('active','stripe_connect','acct_test',affiliate.id);
  sql.prepare('INSERT INTO "Order" (id,firstName,lastName,email,street,postalCode,city,country,subtotal,shipping,total) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run('payout-order','Buyer','One','buyer@example.com','Road 1','12345','Berlin','DE',80,0,80);
  sql.prepare('INSERT INTO CommissionRecord (id,affiliateId,orderId,commissionBase,commissionRate,commissionAmount,status) VALUES (?,?,?,?,?,?,?)').run('commission-payout',affiliate.id,'payout-order',80,10,80,'approved');
  let transferCalls = 0;
  process.env.STRIPE_SECRET_KEY = 'sk_test_only';
  globalThis.stripe = {
    accounts: { retrieve: async (id) => ({ id, details_submitted: true, payouts_enabled: true }) },
    transfers: { create: async (params, options) => { transferCalls++; assert.equal(params.amount, 8000); assert.equal(options.idempotencyKey.startsWith('somnobalance-'), true); return { id: 'tr_test' }; } },
  };
  try {
    const requested = await requestAffiliatePayout('partner@example.com');
    assert.equal(requested.status, 'pending');
    await assert.rejects(() => requestAffiliatePayout('partner@example.com'), /already pending/);
    const processed = await processAffiliatePayout(requested.id);
    assert.equal(processed.status, 'paid');
    assert.equal(processed.stripeTransferId, 'tr_test');
    assert.equal(sql.prepare('SELECT payoutId,status FROM CommissionRecord WHERE id=?').get('commission-payout').status, 'paid');
    await processAffiliatePayout(requested.id);
    assert.equal(transferCalls, 1);
  } finally {
    delete process.env.STRIPE_SECRET_KEY;
    delete globalThis.stripe;
  }
});

test('customer checkout applies the validated affiliate discount to Stripe and D1 totals', async () => {
  const affiliate = await registerAffiliate({ name: 'Partner Ada', email: 'partner@example.com' });
  sql.prepare('UPDATE Affiliate SET status=? WHERE id=?').run('active',affiliate.id);
  await createAffiliateCoupon({ affiliateId: affiliate.id, couponCode: 'REST10', discountRate: 10, commissionRate: 15 });
  let sessionParams;
  process.env.STRIPE_SECRET_KEY = 'sk_test_only';
  globalThis.stripe = {
    coupons: { create: async (params) => ({ id: 'coupon_test', params }) },
    checkout: { sessions: { create: async (params) => { sessionParams = params; return { id: 'cs_test', url: 'https://checkout.stripe.test/session' }; } } },
  };
  try {
    const outsideGermany = await createOrder(request({
      firstName: 'Buyer', lastName: 'One', email: 'buyer@example.com', street: 'Road 1', postalCode: '12345', city: 'Berlin', country: 'India', lang: 'en',
      items: [{ slug: 'somnobalance-roll-on', qty: 1 }],
    }, '/api/orders'));
    assert.equal(outsideGermany.status, 400);
    assert.deepEqual(await outsideGermany.json(), { error: 'We currently deliver within Germany only.' });
    assert.equal(sql.prepare('SELECT COUNT(*) AS count FROM "Order"').get().count, 0);

    const response = await createOrder(request({
      firstName: 'Buyer', lastName: 'One', email: 'buyer@example.com', street: 'Road 1', postalCode: '12345', city: 'Berlin', country: 'DE', lang: 'de',
      couponCode: 'rest10', items: [{ slug: 'somnobalance-roll-on', qty: 1 }],
    }, '/api/orders'));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.discountAmount, 1.9);
    assert.equal(body.total, 22);
    assert.equal(sessionParams.discounts[0].coupon, 'coupon_test');
    const saved = sql.prepare('SELECT subtotal,discountAmount,total,couponCode,commissionRate FROM "Order" WHERE id=?').get(body.id);
    assert.deepEqual({ ...saved }, { subtotal: 19, discountAmount: 1.9, total: 22, couponCode: 'REST10', commissionRate: 15 });
    assert.equal(sql.prepare('SELECT country FROM "Order" WHERE id=?').get(body.id).country, 'Germany');
  } finally {
    delete process.env.STRIPE_SECRET_KEY;
    delete globalThis.stripe;
  }
});
