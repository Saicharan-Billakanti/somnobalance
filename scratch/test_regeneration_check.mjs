import { evaluateRegenerationCheck, CHECK_QUESTIONS, ANSWER_OPTIONS } from "../src/lib/regenerationCheck.ts";

function runTests() {
  console.log("=== SomnoBalance® Regenerationscheck Backend Validation Suite ===\n");
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

  // 1. Structure Tests
  assert(CHECK_QUESTIONS.length === 20, "Exact 20 questions defined");
  assert(ANSWER_OPTIONS.length === 5, "Exact 5-point scale (0..4)");

  // 2. Test Case 1: Low-Score Scenario (all 0s)
  const lowAnswers = new Array(20).fill(0);
  const res1 = evaluateRegenerationCheck(lowAnswers, "de");
  assert(res1.isLowScore === true, "Case 1: isLowScore is true for all 0s");
  assert(res1.title === "Deine Balance bewusst bewahren", "Case 1: Title matches preventive profile");
  assert(res1.primaryProduct.slug === "somnobalance-regeneration-cards", "Case 1: Recommended product is Regenerationskarten");
  assert(res1.showSecondary === false, "Case 1: showSecondary is false");

  // 3. Test Case 2: Ruhe profile
  const ruheAnswers = new Array(20).fill(0);
  ruheAnswers[0] = 4; // q01
  ruheAnswers[1] = 4; // q02
  const res2 = evaluateRegenerationCheck(ruheAnswers, "de");
  assert(res2.isLowScore === false, "Case 2: isLowScore is false");
  assert(res2.primaryKey === "ruhe", "Case 2: primaryKey is 'ruhe'");
  assert(res2.title === "Ruhe finden", "Case 2: Title is 'Ruhe finden'");
  assert(res2.primaryProduct.slug === "somnobalance-regeneration-cards", "Case 2: Primary product is cards");
  assert(res2.addonProduct?.slug === "somnobalance-roll-on", "Case 2: Addon product is roll-on");

  // 4. Test Case 3: Schlaf profile
  const schlafAnswers = new Array(20).fill(0);
  schlafAnswers[2] = 4; // q03
  schlafAnswers[3] = 4; // q04
  const res3 = evaluateRegenerationCheck(schlafAnswers, "de");
  assert(res3.primaryKey === "schlaf", "Case 3: primaryKey is 'schlaf'");
  assert(res3.title === "Erholsam schlafen", "Case 3: Title is 'Erholsam schlafen'");
  assert(res3.primaryProduct.slug === "somnobalance-starter-set", "Case 3: Primary product is Starter-Set");
  assert(res3.addonProduct?.slug === "somnobalance-regeneration-tea", "Case 3: Addon is regeneration tea");

  // 5. Test Case 4: Tie-Break Priority (schlaf = 6 vs balance = 6)
  const tieAnswers = new Array(20).fill(0);
  tieAnswers[2] = 3; tieAnswers[3] = 3; // schlaf = 6
  tieAnswers[6] = 3; tieAnswers[7] = 3; // balance = 6
  const res4 = evaluateRegenerationCheck(tieAnswers, "de");
  assert(res4.primaryKey === "schlaf", "Case 4: schlaf wins over balance on equal scores");

  // 6. Test Case 5: Secondary Focus Trigger (schlaf = 7, balance = 5 => diff 2, secondary >= 5)
  const secAnswers = new Array(20).fill(0);
  secAnswers[2] = 4; secAnswers[3] = 3; // schlaf = 7
  secAnswers[6] = 3; secAnswers[7] = 2; // balance = 5
  const res5 = evaluateRegenerationCheck(secAnswers, "de");
  assert(res5.primaryKey === "schlaf", "Case 5: Primary is schlaf");
  assert(res5.showSecondary === true, "Case 5: showSecondary is true");
  assert(res5.secondarySnippet?.key === "balance", "Case 5: Secondary snippet key is balance");
  assert(Boolean(res5.secondarySnippet?.description), "Case 5: Secondary description present");

  // 7. Test Case 6: Secondary Focus Suppression (primary = 7, secondary = 4)
  const suppAnswers = new Array(20).fill(0);
  suppAnswers[2] = 4; suppAnswers[3] = 3; // schlaf = 7
  suppAnswers[6] = 2; suppAnswers[7] = 2; // balance = 4
  const res6 = evaluateRegenerationCheck(suppAnswers, "de");
  assert(res6.showSecondary === false, "Case 6: showSecondary suppressed when secondary < 5");

  // 8. Test Case 7: Multi-Elevated Override (3 scores >= 5)
  const multiAnswers = new Array(20).fill(0);
  multiAnswers[0] = 3; multiAnswers[1] = 3; // ruhe = 6
  multiAnswers[4] = 3; multiAnswers[5] = 3; // kraft = 6
  multiAnswers[8] = 3; multiAnswers[9] = 3; // emotionen = 6
  const res7 = evaluateRegenerationCheck(multiAnswers, "de");
  assert(res7.isMultiElevated === true, "Case 7: isMultiElevated is true");
  assert(res7.primaryProduct.slug === "somnobalance-starter-set", "Case 7: Multi-elevated forces Starter-Set as main");
  assert(res7.addonProduct?.slug === "somnobalance-regeneration-cards", "Case 7: Multi-elevated forces cards as addon");

  // 9. Test Case 8: Data Privacy & Non-diagnostic Compliance
  const jsonString = JSON.stringify(res7);
  assert(!jsonString.includes('"score"'), "Case 8: Output does not contain score key");
  assert(!jsonString.includes('"points"'), "Case 8: Output does not contain points key");
  assert(!jsonString.includes('"rank"'), "Case 8: Output does not contain rank key");
  assert(!jsonString.includes('"percentage"'), "Case 8: Output does not contain percentage key");

  console.log(`\n================================`);
  console.log(`Result: ${passed}/${total} assertions passed`);
  console.log(`================================\n`);
}

runTests();
