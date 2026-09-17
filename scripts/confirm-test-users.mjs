import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with: node --env-file=.env scripts/confirm-test-users.mjs"
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

const testEmails = [
  "customer@somnobalance.de",
  "affiliate@somnobalance.de",
  "business@somnobalance.de",
  "admin@somnobalance.de",
];

const { data, error } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

if (error) {
  throw error;
}

for (const email of testEmails) {
  const user = data.users.find(
    (candidate) => candidate.email?.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    console.log(`Not found: ${email}`);
    continue;
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        testUser: true,
      },
    }
  );

  if (updateError) {
    throw updateError;
  }

  console.log(`Email confirmed: ${email}`);
}
