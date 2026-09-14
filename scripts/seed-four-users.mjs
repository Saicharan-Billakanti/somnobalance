import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

const password = "Password123!";
const passwordHash = await bcrypt.hash(password, 12);

const now = new Date().toISOString();

const users = [
  {
    id: "usr_admin_demo",
    email: "admin@somnobalance.de",
    passwordHash,
    firstName: "Elena",
    lastName: "Weber (Admin)",
    phone: "+491700000001",
    street: "Kurfürstendamm 100",
    postalCode: "10709",
    city: "Berlin",
    country: "Germany",
    role: "admin",
  },
  {
    id: "usr_customer_demo",
    email: "customer@somnobalance.de",
    passwordHash,
    firstName: "Maximilian",
    lastName: "Schmidt",
    phone: "+491700000002",
    street: "Mönckebergstraße 15",
    postalCode: "20095",
    city: "Hamburg",
    country: "Germany",
    role: "customer",
  },
  {
    id: "usr_affiliate_demo",
    email: "affiliate@somnobalance.de",
    passwordHash,
    firstName: "Sophie",
    lastName: "Bauer (Partner)",
    phone: "+491700000003",
    street: "Maximilianstraße 22",
    postalCode: "80539",
    city: "Munich",
    country: "Germany",
    role: "customer",
  },
  {
    id: "usr_business_demo",
    email: "business@somnobalance.de",
    passwordHash,
    firstName: "Dr. Klaus",
    lastName: "Lindner (Hotel Group)",
    phone: "+491700000004",
    street: "Schildergasse 45",
    postalCode: "50667",
    city: "Cologne",
    country: "Germany",
    role: "business",
  },
];

const insertedUsers = [];
for (const user of users) {
  const { data: existing } = await supabase
    .from("User")
    .select("id")
    .or(`email.eq.${user.email},id.eq.${user.id}`)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("User")
      .update({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: user.passwordHash,
        phone: user.phone,
        street: user.street,
        postalCode: user.postalCode,
        city: user.city,
        country: user.country,
        role: user.role,
      })
      .eq("id", existing.id)
      .select("id, email, role")
      .single();

    if (error) {
      console.error("Failed to update user", user.email, error);
      throw error;
    }
    insertedUsers.push(data);
  } else {
    const { data, error } = await supabase
      .from("User")
      .insert({ ...user, id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })
      .select("id, email, role")
      .single();

    if (error) {
      console.error("Failed to insert user", user.email, error);
      throw error;
    }
    insertedUsers.push(data);
  }
}

// 1. Admin Staff Account
const adminUser = insertedUsers.find((u) => u.email === "admin@somnobalance.de");
if (adminUser) {
  const { data: existingStaff } = await supabase
    .from("StaffAccount")
    .select("id")
    .eq("email", "admin@somnobalance.de")
    .maybeSingle();

  const staffPayload = {
    name: "Elena Weber",
    email: "admin@somnobalance.de",
    role: "super_admin",
    roleTitle: "Super Administrator",
    department: "Executive",
    status: "active",
    permissions: [
      "analytics:read",
      "catalog:manage",
      "settings:manage",
      "business:manage",
      "affiliates:manage",
      "payouts:disburse",
      "orders:manage",
      "refunds:approve",
      "staff:manage",
    ],
    updatedAt: now,
  };

  if (existingStaff) {
    await supabase.from("StaffAccount").update(staffPayload).eq("id", existingStaff.id);
  } else {
    await supabase.from("StaffAccount").insert({ id: "staff_admin_demo", ...staffPayload, createdAt: now });
  }
}

// 2. Affiliate / Dual Role Setup
const affiliateUser = insertedUsers.find((u) => u.email === "affiliate@somnobalance.de");
if (affiliateUser) {
  const { data: existingAff } = await supabase
    .from("Affiliate")
    .select("id")
    .eq("email", "affiliate@somnobalance.de")
    .maybeSingle();

  const affPayload = {
    affiliateCode: "AFF-SOPHIE15",
    name: "Sophie Bauer",
    email: "affiliate@somnobalance.de",
    phone: "+491700000003",
    businessName: "Holistic Sleep & Wellness Studio",
    businessType: "Wellness Coaching & Spa",
    country: "Germany",
    address: "Maximilianstraße 22, Munich",
    audienceType: "Boutique Spa & Wellness Clients",
    description: "Certified sleep consultant and holistic wellbeing ambassador.",
    status: "active",
    payoutThreshold: 50,
    defaultCommissionRate: 15,
    paymentMethod: "bank_transfer",
    bankName: "Deutsche Bank",
    iban: "DE89370400440532013000",
    bicSwift: "DEUTDEDB800",
    updatedAt: now,
  };

  let affId = existingAff?.id;
  if (existingAff) {
    await supabase.from("Affiliate").update(affPayload).eq("id", existingAff.id);
  } else {
    affId = "aff_sophie_demo";
    await supabase.from("Affiliate").insert({ id: affId, ...affPayload, createdAt: now });
  }

  if (affId) {
    const { data: existingCoupon } = await supabase
      .from("AffiliateCoupon")
      .select("id")
      .eq("couponCode", "PARTNER15")
      .maybeSingle();

    const couponPayload = {
      affiliateId: affId,
      couponCode: "PARTNER15",
      discountRate: 15,
      commissionRate: 15,
      commissionBaseType: "discounted_value",
      minimumOrderValue: 0,
      usageLimit: null,
      timesUsed: 12,
      status: "active",
    };

    if (existingCoupon) {
      await supabase.from("AffiliateCoupon").update(couponPayload).eq("id", existingCoupon.id);
    } else {
      await supabase.from("AffiliateCoupon").insert({ id: "coup_sophie15_demo", ...couponPayload, createdAt: now });
    }
  }
}

// 3. Business Application Setup
const businessUser = insertedUsers.find((u) => u.email === "business@somnobalance.de");
if (businessUser) {
  const { data: existingBiz } = await supabase
    .from("BusinessApplication")
    .select("id")
    .eq("email", "business@somnobalance.de")
    .maybeSingle();

  const bizPayload = {
    userId: businessUser.id,
    companyName: "Grand Alpine Resorts & Spa GmbH",
    contactName: "Dr. Klaus Lindner",
    email: "business@somnobalance.de",
    phone: "+491700000004",
    businessType: "Luxury Hotel & Boutique Spa",
    vatId: "DE318492041",
    address: "Schildergasse 45",
    city: "Cologne",
    country: "Germany",
    estimatedVolume: "100-250 units / quarter",
    status: "approved",
    discountRate: 25,
    notes: "Approved Gold Hospitality Partner — VIP amenities distribution.",
    updatedAt: now,
  };

  if (existingBiz) {
    await supabase.from("BusinessApplication").update(bizPayload).eq("id", existingBiz.id);
  } else {
    await supabase.from("BusinessApplication").insert({ id: "biz_lindner_demo", ...bizPayload, createdAt: now });
  }
}

console.log("Successfully created/updated all 4 Demo Accounts in Supabase:");
console.log("-----------------------------------------------------------------");
console.log("1) ONLY CUSTOMER:");
console.log("   Email:    customer@somnobalance.de");
console.log("   Password: Password123!");
console.log("   Role:     customer (Order tracking, profile, personal shopping)");
console.log("");
console.log("2) CUSTOMER + AFFILIATE (DUAL ROLE):");
console.log("   Email:    affiliate@somnobalance.de");
console.log("   Password: Password123!");
console.log("   Role:     customer + active partner (Partner Portal, Coupon: PARTNER15, 15% commission)");
console.log("");
console.log("3) B2B BUSINESS:");
console.log("   Email:    business@somnobalance.de");
console.log("   Password: Password123!");
console.log("   Role:     business (Grand Alpine Resorts & Spa, Approved 25% wholesale discount)");
console.log("");
console.log("4) ADMIN (SUPER ADMINISTRATOR):");
console.log("   Email:    admin@somnobalance.de");
console.log("   Password: Password123!");
console.log("   Role:     admin (Full Admin Portal, super_admin staff permissions)");
console.log("-----------------------------------------------------------------");
