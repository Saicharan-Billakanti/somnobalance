import fs from 'fs';
import path from 'path';

const files = [
  'src/lib/auth.ts',
  'src/lib/adminAuth.ts',
  'src/lib/otpService.ts',
  'src/app/api/auth/login/route.ts',
  'src/lib/userService.ts',
];

const unacceptable = [
  'somnobalance_session_secret_2026_secure',
  'process.env.ADMIN_PASSWORD || "admin123"',
  'process.env.SESSION_SECRET ||',
  'process.env.JWT_SECRET ||',
  'process.env.STRIPE_WEBHOOK_SECRET ||',
  'password === "customer123"',
  'password === "partner123"',
  'password === "business123"',
  'inMemoryUsers',
];

for (const rel of files) {
  const text = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
  for (const token of unacceptable) {
    if (text.includes(token)) {
      console.log(`FAIL: ${rel} still contains fallback token: ${token}`);
      process.exitCode = 1;
    }
  }
}

console.log('PASS: fallback markers are absent from requested security files.');
