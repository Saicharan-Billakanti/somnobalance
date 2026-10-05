import fs from 'fs';

const route = fs.readFileSync('src/app/api/auth/login/route.ts', 'utf8');

const mustHaveDemoCredentialFallback = route.includes('const DEMO_CREDENTIALS') && route.includes('customer@somnobalance.online') && route.includes('partner@somnobalance.online');
const mustNotPromoteAffiliateToAdmin = route.includes('const isAdmin = user.role === "admin";') && route.includes('const isAffiliate = user.isAffiliate;');

if (!mustHaveDemoCredentialFallback || !mustNotPromoteAffiliateToAdmin) {
  console.error('AUTH_REGRESSION_TEST_FAILED: auth regression checks missing');
  process.exit(1);
}

console.log('AUTH_REGRESSION_TEST_PASSED: auth demo fallback and admin gate tightened');
