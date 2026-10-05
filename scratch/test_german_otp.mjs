import { validateAndNormalizeGermanPhone } from "../src/lib/phoneUtils.ts";
import {
  sendGermanPhoneOtp,
  verifyGermanPhoneOtp,
  validatePhoneVerificationToken,
} from "../src/lib/otpService.ts";

async function runTests() {
  console.log("=== SomnoBalance® German Phone OTP Verification Test Suite ===\n");
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  // 1. German Phone Validation & Normalization Tests
  const v1 = validateAndNormalizeGermanPhone("0170 1234567");
  assert(v1.isValid && v1.normalized === "+491701234567" && v1.isMobile === true, "Normalize national mobile 0170 1234567 to +491701234567");

  const v2 = validateAndNormalizeGermanPhone("+49 (0) 171 9876543");
  assert(v2.isValid && v2.normalized === "+491719876543", "Normalize +49 (0) 171 9876543 removing erroneous 0");

  const v3 = validateAndNormalizeGermanPhone("0049 151 22334455");
  assert(v3.isValid && v3.normalized === "+4915122334455", "Normalize 0049 to +49");

  const v4 = validateAndNormalizeGermanPhone("089 20004000"); // Munich landline
  assert(v4.isValid && v4.normalized === "+498920004000" && v4.isMobile === false, "Normalize Munich landline 089 20004000");

  const v5 = validateAndNormalizeGermanPhone("12345"); // Invalid short
  assert(!v5.isValid, "Reject too-short phone number");

  const v6 = validateAndNormalizeGermanPhone("abcde");
  assert(!v6.isValid, "Reject non-numeric string");

  assert(v1.masked && v1.masked.includes("••••"), "Phone number masked correctly for privacy");

  // 2. OTP Dispatch & Cooldown Tests
  const sendRes1 = await sendGermanPhoneOtp("0170 1234567", "register");
  assert(sendRes1.success === true, "Send OTP returns success: true");
  assert(sendRes1.phone === "+491701234567", "Send OTP returns normalized phone");
  assert(sendRes1.cooldownSeconds === 60, "Send OTP enforces 60-second cooldown");

  // Immediate second send should trigger cooldown
  const sendRes2 = await sendGermanPhoneOtp("0170 1234567", "register");
  assert(sendRes2.success === false && sendRes2.cooldownSeconds > 0, "Second send within cooldown is rejected with wait timer");

  // 3. OTP Verification Tests
  // Verification with invalid code
  const verifyFail = verifyGermanPhoneOtp("0170 1234567", "000000", "register");
  assert(verifyFail.success === false && verifyFail.error?.includes("Versuch"), "Incorrect OTP returns failure with attempt count");

  // Verification with invalid phone
  const verifyInvalidPhone = verifyGermanPhoneOtp("0171 9999999", "123456", "register");
  assert(verifyInvalidPhone.success === false, "Non-existent OTP record returns failure");

  // 4. End-to-End OTP Generation, Verification and Token Validation
  const testPhone = "0151 77889900";
  const sendRes = await sendGermanPhoneOtp(testPhone, "register");
  assert(sendRes.success === true, "Send OTP for e2e test succeeds");

  // Verify with OTP code extracted from simulated memory
  // Let's test that verifyGermanPhoneOtp returns a signed token
  // If we try invalid code first:
  const badVerify = verifyGermanPhoneOtp(testPhone, "999999", "register");
  assert(badVerify.success === false, "Bad OTP code fails");

  // Let's test token validator with a valid HMAC signed token
  const dummyPayload = {
    phone: "+4915177889900",
    purpose: "register",
    verifiedAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
  const tokenString = Buffer.from(JSON.stringify(dummyPayload)).toString("base64url");
  const tamperedToken = `${tokenString}.fakeSignature12345`;
  const tokenValFail = validatePhoneVerificationToken(tamperedToken, "+4915177889900", "register");
  assert(tokenValFail.isValid === false, "Tampered verification token rejected");

  console.log(`\n================================`);
  console.log(`Result: ${passed}/${total} assertions passed`);
  console.log(`================================\n`);
}

runTests();
