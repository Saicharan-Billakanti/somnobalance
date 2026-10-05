// Frontend-only mock data layer for the Partner Portal UI, built from the
// backend team's spec (Affiliate Portal UI/UX Requirements). Every function
// here returns realistic sample data synchronously — no real API calls,
// no persistence, no auth check beyond the existing site login. The
// backend team replaces these functions (keeping the same shapes) once the
// real affiliate/commission/payout/Stripe-Connect logic exists; nothing
// here should be treated as real financial or account data.

export type AffiliateStatus = "pending" | "active" | "suspended" | "rejected";
export type StripeStatus = "not_connected" | "restricted" | "paused" | "connected";
export type PayoutMethod = "stripe" | "bank" | null;
export type CommissionStatus = "pending" | "approved" | "available" | "paid" | "cancelled" | "refunded";
export type PayoutStatus = "requested" | "processing" | "paid" | "failed" | "cancelled";

export type AffiliateOverview = {
  name: string;
  affiliateCode: string;
  status: AffiliateStatus;
  totalReferredOrders: number;
  totalReferredRevenue: number;
  totalCommissionEarned: number;
  availableBalance: number;
  pendingCommission: number;
  paidCommission: number;
  nextPayoutEligibleDate: string | null;
  commissionRate: number;
  couponCode: string;
  stripeStatus: StripeStatus;
};

export function getAffiliateOverview(): AffiliateOverview {
  return {
    name: "Sophie Wagner",
    affiliateCode: "AFF-SOPHIE15",
    status: "active",
    totalReferredOrders: 32,
    totalReferredRevenue: 2450,
    totalCommissionEarned: 367.5,
    availableBalance: 250,
    pendingCommission: 117.5,
    paidCommission: 1200,
    nextPayoutEligibleDate: "2026-10-01",
    commissionRate: 10,
    couponCode: "PARTNER15",
    stripeStatus: "restricted",
  };
}

export type AffiliateProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  country: string;
  address: string;
  website: string;
  audienceType: string;
  description: string;
  status: AffiliateStatus;
};

export function getAffiliateProfile(): AffiliateProfile {
  return {
    firstName: "Sophie",
    lastName: "Wagner",
    email: "sophie.wagner@example.com",
    phone: "+49 151 2345 6789",
    businessName: "Wagner Physiotherapie",
    businessType: "Physiotherapy practice",
    country: "Germany",
    address: "Musterstraße 12, 10115 Berlin",
    website: "https://wagner-physio.example.com",
    audienceType: "Patients (in-practice)",
    description: "A boutique physiotherapy practice recommending SomnoBalance as part of aftercare routines.",
    status: "active",
  };
}

export type ReferralTools = {
  affiliateCode: string;
  couponCode: string;
  discountPercent: number;
  commissionPercent: number;
  referralLink: string;
  couponLink: string;
};

export function getReferralTools(): ReferralTools {
  return {
    affiliateCode: "AFF-SOPHIE15",
    couponCode: "PARTNER15",
    discountPercent: 15,
    commissionPercent: 15,
    referralLink: "https://somnobalance.example.com/en/shop?ref=AFF-SOPHIE15",
    couponLink: "https://somnobalance.example.com/en/shop?coupon=PARTNER15",
  };
}

export type CommissionEntry = {
  orderId: string;
  orderDate: string;
  orderValue: number;
  couponCode: string;
  commissionBase: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  payoutId: string | null;
};

export function getCommissionHistory(): CommissionEntry[] {
  return [
    {
      orderId: "ORD-10021",
      orderDate: "2026-09-17",
      orderValue: 125,
      couponCode: "PARTNER15",
      commissionBase: 125,
      commissionRate: 10,
      commissionAmount: 18.75,
      status: "available",
      payoutId: null,
    },
    {
      orderId: "ORD-10018",
      orderDate: "2026-09-15",
      orderValue: 150,
      couponCode: "PARTNER15",
      commissionBase: 150,
      commissionRate: 10,
      commissionAmount: 22.5,
      status: "paid",
      payoutId: "PO-2026-0031",
    },
    {
      orderId: "ORD-10010",
      orderDate: "2026-09-12",
      orderValue: 100,
      couponCode: "PARTNER15",
      commissionBase: 100,
      commissionRate: 10,
      commissionAmount: 15,
      status: "pending",
      payoutId: null,
    },
    {
      orderId: "ORD-10005",
      orderDate: "2026-09-08",
      orderValue: 89,
      couponCode: "PARTNER15",
      commissionBase: 89,
      commissionRate: 10,
      commissionAmount: 13.35,
      status: "cancelled",
      payoutId: null,
    },
    {
      orderId: "ORD-09994",
      orderDate: "2026-09-02",
      orderValue: 210,
      couponCode: "PARTNER15",
      commissionBase: 0,
      commissionRate: 10,
      commissionAmount: 0,
      status: "refunded",
      payoutId: null,
    },
  ];
}

export type PayoutEntry = {
  id: string;
  date: string;
  amount: number;
  method: "Stripe Connect" | "Bank transfer";
  status: PayoutStatus;
  referenceId: string;
  failureReason?: string;
};

export function getPayoutHistory(): PayoutEntry[] {
  return [
    {
      id: "PO-2026-0031",
      date: "2026-09-16",
      amount: 22.5,
      method: "Stripe Connect",
      status: "paid",
      referenceId: "po_1PxYz2Sophie",
    },
    {
      id: "PO-2026-0022",
      date: "2026-08-20",
      amount: 145,
      method: "Stripe Connect",
      status: "paid",
      referenceId: "po_1PwAb9Sophie",
    },
    {
      id: "PO-2026-0011",
      date: "2026-07-25",
      amount: 60,
      method: "Stripe Connect",
      status: "failed",
      referenceId: "po_1PuTr3Sophie",
      failureReason: "Bank account verification incomplete at the time of transfer.",
    },
  ];
}

export type PayoutReadiness = {
  availableBalance: number;
  minimumPayout: number;
  selectedMethod: PayoutMethod;
  nextEligibleDate: string | null;
  stripeStatus: StripeStatus;
  bankDetailsComplete: boolean;
  accountSuspended: boolean;
  payoutProcessing: boolean;
};

export function getPayoutReadiness(): PayoutReadiness {
  return {
    availableBalance: 250,
    minimumPayout: 50,
    selectedMethod: "stripe",
    nextEligibleDate: "2026-10-01",
    stripeStatus: "restricted",
    bankDetailsComplete: false,
    accountSuspended: false,
    payoutProcessing: false,
  };
}

export type BankDetails = {
  accountHolderName: string;
  bankName: string;
  ibanMasked: string;
  bicSwift: string;
  country: string;
};

export function getBankDetails(): BankDetails | null {
  return null; // no bank details saved — Stripe Connect is the selected method in this sample
}

export type NotificationEntry = {
  id: string;
  type:
    | "affiliate_approved"
    | "affiliate_suspended"
    | "new_commission"
    | "commission_approved"
    | "commission_cancelled"
    | "payout_requested"
    | "payout_processing"
    | "payout_completed"
    | "payout_failed"
    | "stripe_verification_required"
    | "payment_details_updated"
    | "refund_affecting_commission";
  message: string;
  date: string;
  read: boolean;
};

export function getNotifications(): NotificationEntry[] {
  return [
    {
      id: "n1",
      type: "stripe_verification_required",
      message: "Your Stripe account requires additional verification.",
      date: "2026-09-17",
      read: false,
    },
    {
      id: "n2",
      type: "new_commission",
      message: "New commission of €18.75 from order ORD-10021.",
      date: "2026-09-17",
      read: false,
    },
    {
      id: "n3",
      type: "payout_completed",
      message: "Payout of €22.50 was completed via Stripe Connect.",
      date: "2026-09-16",
      read: true,
    },
    {
      id: "n4",
      type: "refund_affecting_commission",
      message: "Order ORD-09994 was refunded; the related commission was reversed.",
      date: "2026-09-03",
      read: true,
    },
  ];
}

export type SupportMessage = {
  id: string;
  from: "affiliate" | "admin";
  text: string;
  date: string;
  read: boolean;
};

export function getSupportMessages(): SupportMessage[] {
  return [
    {
      id: "m1",
      from: "affiliate",
      text: "Hi, I noticed my Stripe account still shows as restricted even though I completed the onboarding form. Could you check?",
      date: "2026-09-15",
      read: true,
    },
    {
      id: "m2",
      from: "admin",
      text: "Thanks for flagging this — Stripe is asking for one more identity document. We've sent you the exact link to finish it.",
      date: "2026-09-16",
      read: false,
    },
  ];
}
