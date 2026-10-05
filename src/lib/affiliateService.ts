import { getSupabase, supabaseConfigured } from "@/lib/supabase";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export type CouponValidationResult =
  | {
      valid: true;
      couponCode: string;
      discountRate: number;
      commissionRate: number;
      commissionBaseType: string;
      discountAmount: number;
      finalSubtotal: number;
      affiliateId: string;
      affiliateName: string;
    }
  | {
      valid: false;
      error: string;
    };

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

function supabaseErrorMessage(error: unknown) {
  if (!error) return "";
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return String(error);
}

export async function validateCoupon(
  rawCode: string,
  subtotal: number,
  customerEmail?: string
): Promise<CouponValidationResult> {
  const code = normalizeCouponCode(rawCode);
  if (!code) {
    return { valid: false, error: "Please enter a coupon code." };
  }

  let coupon: any = null;
  let affiliate: any = null;

  if (supabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data: cData, error: cErr } = await supabase
        .from("AffiliateCoupon")
        .select("*, affiliate:Affiliate(*)")
        .eq("couponCode", code)
        .eq("status", "active")
        .single();

      if (!cErr && cData) {
        coupon = cData;
        affiliate = cData.affiliate;
      }
    } catch (error) {
      throw new Error(`Could not validate coupon: ${supabaseErrorMessage(error)}`);
    }
  }

  if (!coupon) {
    return { valid: false, error: "Invalid or inactive coupon code." };
  }

  if (!coupon || coupon.status !== "active") {
    return { valid: false, error: "Invalid or inactive coupon code." };
  }

  if (affiliate && affiliate.status !== "active") {
    return { valid: false, error: "This referral code is currently not active." };
  }

  if (coupon.minimumOrderValue > 0 && subtotal < coupon.minimumOrderValue) {
    return {
      valid: false,
      error: `Minimum order amount for this code is €${coupon.minimumOrderValue.toFixed(2)}.`,
    };
  }

  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return { valid: false, error: "This coupon code has reached its usage limit." };
  }

  const discountRate = coupon.discountRate;
  const discountAmount = Math.round(subtotal * (discountRate / 100) * 100) / 100;
  const finalSubtotal = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  return {
    valid: true,
    couponCode: coupon.couponCode,
    discountRate: coupon.discountRate,
    commissionRate: coupon.commissionRate,
    commissionBaseType: coupon.commissionBaseType,
    discountAmount,
    finalSubtotal,
    affiliateId: coupon.affiliateId,
    affiliateName: affiliate?.name || "Partner",
  };
}

export async function processOrderCommission(params: {
  orderId: string;
  orderTotal: number;
  subtotal: number;
  customerEmail: string;
  couponCode?: string | null;
}) {
  const { orderId, subtotal, customerEmail, couponCode } = params;
  if (!couponCode) return null;

  const validation = await validateCoupon(couponCode, subtotal, customerEmail);
  if (!validation.valid) return null;

  let affiliateEmail = "";
  if (supabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data: aff } = await supabase
        .from("Affiliate")
        .select("email")
        .eq("id", validation.affiliateId)
        .single();
      if (aff) affiliateEmail = aff.email;
    } catch (error) {
      throw new Error(`Could not load affiliate for commission: ${supabaseErrorMessage(error)}`);
    }
  }
  // Self-referral protection
  const isSelfReferral =
    Boolean(customerEmail && affiliateEmail) &&
    customerEmail.trim().toLowerCase() === affiliateEmail.trim().toLowerCase();

  const commissionBase =
    validation.commissionBaseType === "original_value"
      ? subtotal
      : validation.finalSubtotal;
  const commissionAmount =
    Math.round(commissionBase * (validation.commissionRate / 100) * 100) / 100;

  const commissionStatus = isSelfReferral ? "on_hold" : "approved";

  const notification = {
    id: `notif_${Date.now()}`,
    affiliateId: validation.affiliateId,
    type: isSelfReferral ? "self_referral_flag" : "referral_order",
    message: isSelfReferral
      ? `Order ${orderId} was flagged for review (buyer email matched your partner email).`
      : `New referral order of €${subtotal.toFixed(2)}! You earned €${commissionAmount.toFixed(2)} commission.`,
    read: false,
    createdAt: new Date().toISOString(),
  };

  if (!supabaseConfigured()) {
    throw new Error("Database is not configured. Commission cannot be recorded.");
  }

  const supabase = getSupabase();
  const { error: commissionError } = await supabase.from("CommissionRecord").insert({
    id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    affiliateId: validation.affiliateId,
    orderId,
    commissionBase,
    commissionRate: validation.commissionRate,
    commissionAmount,
    currency: "EUR",
    status: commissionStatus,
  });
  if (commissionError) {
    throw new Error(`Failed to record commission: ${supabaseErrorMessage(commissionError)}`);
  }

  const { error: notificationError } = await supabase.from("AffiliateNotification").insert(notification);
  if (notificationError) {
    throw new Error(`Failed to create affiliate notification: ${supabaseErrorMessage(notificationError)}`);
  }

  return {
    commissionAmount,
    isSelfReferral,
    commissionStatus,
  };
}

export async function getPartnerPortalData(email: string) {
  let affiliate: any = null;
  let coupons: any[] = [];
  let commissions: any[] = [];
  let payouts: any[] = [];
  let notifications: any[] = [];

  const cleanEmail = email.trim().toLowerCase();

  if (supabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data: aff, error: affError } = await supabase
        .from("Affiliate")
        .select("*")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (affError) {
        throw new Error(`Failed to load affiliate: ${supabaseErrorMessage(affError)}`);
      }

      if (aff) {
        affiliate = aff;
        const [coupRes, commRes, payRes, notifRes] = await Promise.all([
          supabase.from("AffiliateCoupon").select("*").eq("affiliateId", aff.id),
          supabase.from("CommissionRecord").select("*, order:Order(*)").eq("affiliateId", aff.id).order("createdAt", { ascending: false }),
          supabase.from("Payout").select("*").eq("affiliateId", aff.id).order("createdAt", { ascending: false }),
          supabase.from("AffiliateNotification").select("*").eq("affiliateId", aff.id).order("createdAt", { ascending: false }),
        ]);
        coupons = coupRes.data || [];
        commissions = commRes.data || [];
        payouts = payRes.data || [];
        notifications = notifRes.data || [];
      }
    } catch (err) {
      console.error("[affiliateService] Failed to load partner portal data:", err);
    }
  }

  if (!affiliate) return null;

  const totalEarned = commissions
    .filter((c) => ["approved", "paid"].includes(c.status))
    .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

  const totalPaid = payouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const unpaidApproved = commissions
    .filter((c) => c.status === "approved" && !c.payoutId)
    .reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

  const availableBalance = Math.max(0, Math.round((totalEarned - totalPaid) * 100) / 100);
  const payoutThreshold = affiliate.payoutThreshold || 50.0;
  const thresholdProgress = Math.min(100, Math.round((availableBalance / payoutThreshold) * 100));

  return {
    affiliate,
    coupons,
    commissions,
    payouts,
    notifications,
    metrics: {
      totalReferralOrders: commissions.length,
      totalEarned,
      totalPaid,
      availableBalance,
      payoutThreshold,
      thresholdProgress,
      isPayoutEligible: availableBalance >= payoutThreshold,
    },
  };
}

export async function registerAffiliate(data: {
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  website?: string;
  country?: string;
  address?: string;
  audienceType?: string;
  description?: string;
  bankName?: string;
  iban?: string;
  bicSwift?: string;
}) {
  const codeNumber = Math.floor(100000 + Math.random() * 900000);
  const affiliateCode = `AFF-${codeNumber}`;

  const affiliateObj = {
    id: `aff_${Date.now()}`,
    affiliateCode,
    name: data.name,
    email: data.email.trim().toLowerCase(),
    phone: data.phone || null,
    businessName: data.businessName || null,
    businessType: data.businessType || null,
    website: data.website || null,
    country: data.country || "Germany",
    address: data.address || null,
    audienceType: data.audienceType || null,
    description: data.description || null,
    status: "pending",
    bankName: data.bankName || null,
    iban: data.iban || null,
    bicSwift: data.bicSwift || null,
    paymentMethod: "bank_transfer",
    payoutThreshold: 50.0,
    defaultCommissionRate: 10.0,
    createdAt: new Date().toISOString(),
  };

  if (supabaseConfigured()) {
    const supabase = getSupabase();
    const { data: created, error } = await supabase
      .from("Affiliate")
      .insert(affiliateObj)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save partner application: ${supabaseErrorMessage(error)}`);
    }

    if (created) return created;
    throw new Error("Failed to save partner application: no affiliate row was returned.");
  }

  throw new Error("Database is not configured. Partner applications cannot be saved.");
}

export async function getAllAdminAffiliateData() {
  let affiliates: any[] = [];
  let coupons: any[] = [];
  let commissions: any[] = [];
  let payouts: any[] = [];

  if (supabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const [affRes, coupRes, commRes, payRes] = await Promise.all([
        supabase.from("Affiliate").select("*").order("createdAt", { ascending: false }),
        supabase.from("AffiliateCoupon").select("*, affiliate:Affiliate(name, affiliateCode)").order("createdAt", { ascending: false }),
        supabase.from("CommissionRecord").select("*, affiliate:Affiliate(name, email)").order("createdAt", { ascending: false }),
        supabase.from("Payout").select("*, affiliate:Affiliate(name, email, iban)").order("createdAt", { ascending: false }),
      ]);
      affiliates = affRes.data || [];
      coupons = coupRes.data || [];
      commissions = commRes.data || [];
      payouts = payRes.data || [];
    } catch {}
  }

  return { affiliates, coupons, commissions, payouts };
}

export async function updateAffiliateStatus(affiliateId: string, status: string) {
  if (!supabaseConfigured()) {
    throw new Error("Database is not configured. Partner status cannot be updated.");
  }
  const { error } = await getSupabase().from("Affiliate").update({ status }).eq("id", affiliateId);
  if (error) throw new Error(`Failed to update partner status: ${supabaseErrorMessage(error)}`);
  return { success: true };
}

export async function createAffiliateCoupon(data: {
  affiliateId: string;
  couponCode: string;
  discountRate: number;
  commissionRate: number;
  minimumOrderValue?: number;
}) {
  const code = normalizeCouponCode(data.couponCode);
  const couponObj = {
    id: `coup_${Date.now()}`,
    affiliateId: data.affiliateId,
    couponCode: code,
    discountRate: Number(data.discountRate) || 10.0,
    commissionRate: Number(data.commissionRate) || 10.0,
    commissionBaseType: "discounted_value",
    minimumOrderValue: Number(data.minimumOrderValue) || 0,
    usageLimit: null,
    timesUsed: 0,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  if (!supabaseConfigured()) {
    throw new Error("Database is not configured. Coupon cannot be created.");
  }
  const { data: created, error } = await getSupabase()
    .from("AffiliateCoupon")
    .insert(couponObj)
    .select()
    .single();
  if (error || !created) {
    throw new Error(`Failed to create coupon: ${supabaseErrorMessage(error) || "no row returned"}`);
  }
  return created;
}

export async function createAffiliatePayout(data: {
  affiliateId: string;
  amount: number;
  paymentMethod?: "stripe_connect" | "bank_transfer";
  paymentReference?: string;
  notes?: string;
}) {
  let paymentReference = data.paymentReference;
  let stripeTransferId: string | undefined;

  const targetAffiliate = supabaseConfigured()
    ? await getSupabase()
        .from("Affiliate")
        .select("name, stripeAccountId, paymentMethod")
        .eq("id", data.affiliateId)
        .maybeSingle()
    : { data: null, error: new Error("Database is not configured") };

  const method = (targetAffiliate.data?.paymentMethod || data.paymentMethod || "stripe_connect") as
    | "stripe_connect"
    | "bank_transfer";

  // If payout via Stripe Connect is requested
  if (method === "stripe_connect") {
    if (targetAffiliate.error) {
      throw new Error(`Could not load partner payout details: ${supabaseErrorMessage(targetAffiliate.error)}`);
    }
    const destAccountId = targetAffiliate.data?.stripeAccountId;
    if (!destAccountId || !destAccountId.startsWith("acct_")) {
      throw new Error("Partner does not have a linked Stripe Connect account (acct_...) configured.");
    }
    if (!stripeConfigured()) {
      throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in Cloudflare secrets.");
    }
    const stripe = getStripe();
    const connectedAccount = await stripe.accounts.retrieve(destAccountId);
    if (!connectedAccount.details_submitted || !connectedAccount.payouts_enabled) {
      throw new Error("Partner must complete Stripe onboarding before a payout can be sent.");
    }
    const transfer = await stripe.transfers.create({
      amount: Math.round(Number(data.amount) * 100),
      currency: "eur",
      destination: destAccountId,
      description: `SomnoBalance Commission Payout - ${targetAffiliate.data?.name || data.affiliateId}`,
    });
    stripeTransferId = transfer.id;
    paymentReference = transfer.id;
  } else {
    const bankDetails = supabaseConfigured()
      ? await getSupabase()
          .from("Affiliate")
          .select("bankName, iban, bicSwift")
          .eq("id", data.affiliateId)
          .maybeSingle()
      : { data: null, error: new Error("Database is not configured") };

    if (bankDetails.error) {
      throw new Error(`Could not load bank payout details: ${supabaseErrorMessage(bankDetails.error)}`);
    }
    if (!bankDetails.data?.bankName || !bankDetails.data?.iban) {
      throw new Error("Partner has not entered a bank name and IBAN for bank-transfer payouts.");
    }
    if (!paymentReference) paymentReference = `SEPA-SB-${Date.now()}`;
  }

  const payoutObj = {
    id: `pay_${Date.now()}`,
    affiliateId: data.affiliateId,
    amount: Number(data.amount),
    currency: "EUR",
    status: "paid",
    paymentMethod: method,
    paymentReference: paymentReference || `REF-SB-${Date.now()}`,
    stripeTransferId,
    paymentDate: new Date().toISOString(),
    notes: data.notes || (method === "stripe_connect" ? "Instant Stripe Connect Payout" : "Commission payout"),
    createdAt: new Date().toISOString(),
  };

  if (!supabaseConfigured()) {
    throw new Error("Database is not configured. Payout cannot be recorded.");
  }
  const { error } = await getSupabase().from("Payout").insert(payoutObj);
  if (error) throw new Error(`Failed to record payout: ${supabaseErrorMessage(error)}`);

  return payoutObj;
}

export async function updateAffiliateStripeAccount(affiliateId: string, stripeAccountId: string) {
  if (!supabaseConfigured()) {
    throw new Error("Database is not configured. Stripe account cannot be linked.");
  }
  const { error } = await getSupabase()
    .from("Affiliate")
    .update({ stripeAccountId: stripeAccountId.trim(), paymentMethod: "stripe_connect" })
    .eq("id", affiliateId);
  if (error) throw new Error(`Failed to link Stripe account: ${supabaseErrorMessage(error)}`);

  return { success: true, stripeAccountId: stripeAccountId.trim() };
}

export async function updateAffiliatePaymentDetails(
  affiliateId: string,
  details: {
    paymentMethod: "stripe_connect" | "bank_transfer";
    bankName?: string;
    iban?: string;
    bicSwift?: string;
  }
) {
  if (!supabaseConfigured()) {
    throw new Error("Database is not configured. Payment details cannot be saved.");
  }

  const bankName = details.bankName?.trim() || "";
  const iban = details.iban?.replace(/\s+/g, "").toUpperCase() || "";
  const bicSwift = details.bicSwift?.replace(/\s+/g, "").toUpperCase() || "";

  if (details.paymentMethod === "bank_transfer" && (!bankName || !iban)) {
    throw new Error("Bank name and IBAN are required for bank-transfer payouts.");
  }

  const { data, error } = await getSupabase()
    .from("Affiliate")
    .update({
      paymentMethod: details.paymentMethod,
      bankName: bankName || null,
      iban: iban || null,
      bicSwift: bicSwift || null,
    })
    .eq("id", affiliateId)
    .select("paymentMethod, bankName, iban, bicSwift")
    .maybeSingle();

  if (error) throw new Error(`Failed to save payment details: ${supabaseErrorMessage(error)}`);
  if (!data) throw new Error("Partner account was not found.");
  return { success: true, paymentDetails: data };
}

export async function createStripeConnectAccount(
  affiliateId: string,
  email: string,
  origin: string,
  lang: string = "en"
) {
  if (!stripeConfigured()) {
    throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in Cloudflare secrets.");
  }

  const stripe = getStripe();
  const existingAffiliate = await getSupabase()
    .from("Affiliate")
    .select("stripeAccountId")
    .eq("id", affiliateId)
    .maybeSingle();

  let account: Awaited<ReturnType<typeof stripe.accounts.retrieve>>;
  const savedAccountId = existingAffiliate.data?.stripeAccountId?.trim();

  if (savedAccountId?.startsWith("acct_")) {
    account = await stripe.accounts.retrieve(savedAccountId);
  } else {
    account = await stripe.accounts.create({
      type: "express",
      country: "DE",
      email,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: {
        affiliateId,
      },
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${origin}/${lang}/partner?stripe=refresh`,
    return_url: `${origin}/${lang}/partner?stripe=connected`,
    type: "account_onboarding",
  });

  await updateAffiliateStripeAccount(affiliateId, account.id);

  return {
    success: true,
    stripeAccountId: account.id,
    onboardingUrl: accountLink.url,
  };
}

export async function getStripeConnectAccountStatus(stripeAccountId: string) {
  if (!stripeAccountId) {
    return { connected: false };
  }

  if (stripeConfigured() && stripeAccountId.startsWith("acct_")) {
    try {
      const stripe = getStripe();
      const account = await stripe.accounts.retrieve(stripeAccountId);
      return {
        connected: true,
        id: account.id,
        payouts_enabled: account.payouts_enabled,
        charges_enabled: account.charges_enabled,
        details_submitted: account.details_submitted,
        default_currency: account.default_currency || "eur",
      };
    } catch (err: any) {
      console.warn("[affiliateService] Failed to retrieve live Stripe account:", err.message);
    }
  }

  return {
    connected: false,
    id: stripeAccountId,
    payouts_enabled: false,
    charges_enabled: false,
    details_submitted: false,
    default_currency: "eur",
  };
}

export async function getAffiliateByEmail(email: string) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();

  if (supabaseConfigured()) {
    try {
      const { data, error } = await getSupabase()
        .from("Affiliate")
        .select("*")
        .eq("email", normalized)
        .maybeSingle();
      if (!error && data) return data;
    } catch {}
  }

  return null;
}
