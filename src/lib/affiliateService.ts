import { getDB } from "@/lib/db";
import { getStripe, stripeConfigured } from "@/lib/stripe";

export type CouponValidationResult = { valid: true; couponId: string; couponCode: string; discountRate: number; commissionRate: number; commissionBaseType: string; discountAmount: number; finalSubtotal: number; affiliateId: string; affiliateName: string } | { valid: false; error: string };
export const normalizeCouponCode = (code: string) => code.trim().toUpperCase();
const db = () => getDB();

export async function validateCoupon(rawCode:string,subtotal:number,_customerEmail?:string):Promise<CouponValidationResult> {
  const code=normalizeCouponCode(rawCode); if(!code) return {valid:false,error:"Please enter a coupon code."};
  const row=await db().prepare('SELECT c.*, a.name affiliateName, a.status affiliateStatus, (SELECT COUNT(*) FROM "AffiliateCouponRedemption" r WHERE r.couponId=c.id) redemptionCount FROM "AffiliateCoupon" c JOIN "Affiliate" a ON a.id=c.affiliateId WHERE c.couponCode=?').bind(code).first<any>();
  if(!row||row.status!=="active") return {valid:false,error:"Invalid or inactive coupon code."};
  if(row.affiliateStatus!=="active") return {valid:false,error:"This referral code is currently not active."};
  if(row.minimumOrderValue>0&&subtotal<row.minimumOrderValue) return {valid:false,error:`Minimum order amount for this code is €${Number(row.minimumOrderValue).toFixed(2)}.`};
  if(row.usageLimit&&Number(row.redemptionCount)>=Number(row.usageLimit)) return {valid:false,error:"This coupon code has reached its usage limit."};
  const discountAmount=Math.round(subtotal*(Number(row.discountRate)/100)*100)/100; const finalSubtotal=Math.max(0,Math.round((subtotal-discountAmount)*100)/100);
  return {valid:true,couponId:row.id,couponCode:row.couponCode,discountRate:Number(row.discountRate),commissionRate:Number(row.commissionRate),commissionBaseType:row.commissionBaseType,discountAmount,finalSubtotal,affiliateId:row.affiliateId,affiliateName:row.affiliateName||"Partner"};
}

export async function recordPaidOrderCommission(orderId:string) {
  const order=await db().prepare('SELECT * FROM "Order" WHERE id=?').bind(orderId).first<any>();
  if(!order?.couponId||!order.affiliateId||!order.couponCode) return null;
  const affiliate=await db().prepare('SELECT email FROM "Affiliate" WHERE id=?').bind(order.affiliateId).first<{email:string}>();
  const self=Boolean(affiliate?.email&&String(order.email).trim().toLowerCase()===affiliate.email.trim().toLowerCase());
  const base=order.commissionBaseType==="original_value"?Number(order.subtotal):Math.max(0,Number(order.subtotal)-Number(order.discountAmount));
  const amount=Math.round(base*(Number(order.commissionRate)/100)*100)/100, status=self?"on_hold":"approved", now=new Date().toISOString();
  await db().prepare('INSERT OR IGNORE INTO "CommissionRecord" (id,affiliateId,orderId,couponId,commissionBase,commissionRate,commissionAmount,currency,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,\'EUR\',?,?,?)').bind(`comm_${orderId}`,order.affiliateId,orderId,order.couponId,base,Number(order.commissionRate),amount,status,now,now).run();
  await db().prepare('INSERT OR IGNORE INTO "AffiliateCouponRedemption" (id,couponId,orderId,createdAt) VALUES (?,?,?,?)').bind(`redemption_${orderId}`,order.couponId,orderId,now).run();
  await db().prepare('UPDATE "AffiliateCoupon" SET timesUsed=(SELECT COUNT(*) FROM "AffiliateCouponRedemption" WHERE couponId=?) WHERE id=?').bind(order.couponId,order.couponId).run();
  await db().prepare('INSERT OR IGNORE INTO "AffiliateNotification" (id,affiliateId,type,message,read,createdAt) VALUES (?,?,?,?,0,?)').bind(`notif_order_${orderId}`,order.affiliateId,self?"self_referral_flag":"referral_order",self?`Order ${orderId} was flagged for review.`:`New referral order of €${Number(order.subtotal).toFixed(2)}! You earned €${amount.toFixed(2)} commission.`,now).run();
  return {commissionAmount:amount,isSelfReferral:self,commissionStatus:status};
}

export async function processOrderCommission(params:{orderId:string;orderTotal:number;subtotal:number;customerEmail:string;couponCode?:string|null}) {
  if(!params.couponCode) return null; const valid=await validateCoupon(params.couponCode,params.subtotal,params.customerEmail); if(!valid.valid) return null;
  const affiliate=await db().prepare('SELECT email FROM "Affiliate" WHERE id=?').bind(valid.affiliateId).first<{email:string}>();
  const self=Boolean(affiliate?.email&&params.customerEmail.trim().toLowerCase()===affiliate.email.trim().toLowerCase());
  const base=valid.commissionBaseType==="original_value"?params.subtotal:valid.finalSubtotal; const amount=Math.round(base*(valid.commissionRate/100)*100)/100; const status=self?"on_hold":"approved"; const now=new Date().toISOString();
  await db().prepare('INSERT OR IGNORE INTO "CommissionRecord" (id,affiliateId,orderId,commissionBase,commissionRate,commissionAmount,currency,status,createdAt,updatedAt) VALUES (?,?,?,?,?,?,\'EUR\',?,?,?)').bind(`comm_${crypto.randomUUID()}`,valid.affiliateId,params.orderId,base,valid.commissionRate,amount,status,now,now).run();
  await db().prepare('UPDATE "Order" SET affiliateId=?,couponCode=?,discountAmount=?,discountRate=?,commissionAmount=?,selfReferral=? WHERE id=?').bind(valid.affiliateId,valid.couponCode,valid.discountAmount,valid.discountRate,amount,self?1:0,params.orderId).run();
  await db().prepare('UPDATE "AffiliateCoupon" SET timesUsed=timesUsed+1,updatedAt=? WHERE couponCode=?').bind(now,valid.couponCode).run();
  await db().prepare('INSERT INTO "AffiliateNotification" (id,affiliateId,type,message,read,createdAt) VALUES (?,?,?,?,0,?)').bind(`notif_${crypto.randomUUID()}`,valid.affiliateId,self?"self_referral_flag":"referral_order",self?`Order ${params.orderId} was flagged for review.`:`New referral order of €${params.subtotal.toFixed(2)}! You earned €${amount.toFixed(2)} commission.`,now).run();
  return {commissionAmount:amount,isSelfReferral:self,commissionStatus:status};
}

export async function getPartnerPortalData(email:string) {
  const affiliate=await db().prepare('SELECT * FROM "Affiliate" WHERE email=?').bind(email.trim().toLowerCase()).first<any>(); if(!affiliate) return null;
  const [c,p,n]=await Promise.all([
    db().prepare('SELECT * FROM "AffiliateCoupon" WHERE affiliateId=?').bind(affiliate.id).all<any>(),
    db().prepare('SELECT c.*,o.id orderId,o.total orderTotal,o.email customerEmail FROM "CommissionRecord" c LEFT JOIN "Order" o ON o.id=c.orderId WHERE c.affiliateId=? ORDER BY c.createdAt DESC').bind(affiliate.id).all<any>(),
    db().prepare('SELECT * FROM "Payout" WHERE affiliateId=? ORDER BY createdAt DESC').bind(affiliate.id).all<any>(),
  ]);
  const notifications=await db().prepare('SELECT * FROM "AffiliateNotification" WHERE affiliateId=? ORDER BY createdAt DESC').bind(affiliate.id).all<any>();
  const commissions=p.results,coupons=c.results,payouts=n.results; const earned=commissions.filter(x=>["approved","paid"].includes(x.status)).reduce((s,x)=>s+Number(x.commissionAmount||0),0); const paid=payouts.filter(x=>["processing","paid"].includes(x.status)).reduce((s,x)=>s+Number(x.amount||0),0); const reserved=payouts.filter(x=>["pending","processing"].includes(x.status)).reduce((s,x)=>s+Number(x.amount||0),0); const threshold=Number(affiliate.payoutThreshold||50); const balance=Math.max(0,Math.round((earned-paid-payouts.filter(x=>x.status==="pending").reduce((s,x)=>s+Number(x.amount||0),0))*100)/100);
  return {affiliate,coupons,commissions,payouts,notifications:notifications.results,metrics:{totalReferralOrders:commissions.length,totalEarned:earned,totalPaid:paid,availableBalance:balance,payoutThreshold:threshold,thresholdProgress:Math.min(100,Math.round(balance/threshold*100)),isPayoutEligible:balance>=threshold,payoutProcessing:reserved>0}};
}

export async function registerAffiliate(data:{name:string;email:string;phone?:string;businessName?:string;businessType?:string;website?:string;country?:string;address?:string;audienceType?:string;description?:string;bankName?:string;iban?:string;bicSwift?:string}) {
  const id=`aff_${crypto.randomUUID()}`, now=new Date().toISOString(), code=`AFF-${Math.floor(100000+Math.random()*900000)}`;
  await db().prepare('INSERT INTO "Affiliate" (id,affiliateCode,createdAt,updatedAt,name,email,phone,businessName,businessType,website,country,address,audienceType,description,status,bankName,iban,bicSwift,paymentMethod,payoutThreshold,defaultCommissionRate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,? ,\'pending\',?,?,?,\'bank_transfer\',50,10)').bind(id,code,now,now,data.name,data.email.trim().toLowerCase(),data.phone||null,data.businessName||null,data.businessType||null,data.website||null,data.country||"Germany",data.address||null,data.audienceType||null,data.description||null,data.bankName||null,data.iban||null,data.bicSwift||null).run();
  return db().prepare('SELECT * FROM "Affiliate" WHERE id=?').bind(id).first<any>();
}
export async function getAllAdminAffiliateData() {
  const [a,c,m,p]=await Promise.all([db().prepare('SELECT * FROM "Affiliate" ORDER BY createdAt DESC').all<any>(),db().prepare('SELECT c.*,a.name affiliateName,a.affiliateCode FROM "AffiliateCoupon" c JOIN "Affiliate" a ON a.id=c.affiliateId ORDER BY c.createdAt DESC').all<any>(),db().prepare('SELECT c.*,a.name affiliateName,a.email affiliateEmail FROM "CommissionRecord" c JOIN "Affiliate" a ON a.id=c.affiliateId ORDER BY c.createdAt DESC').all<any>(),db().prepare('SELECT p.*,a.name affiliateName,a.email affiliateEmail,a.iban FROM "Payout" p JOIN "Affiliate" a ON a.id=p.affiliateId ORDER BY p.createdAt DESC').all<any>()]); return {affiliates:a.results,coupons:c.results,commissions:m.results,payouts:p.results};
}
export async function updateAffiliateStatus(id:string,status:string) { const r=await db().prepare('UPDATE "Affiliate" SET status=?,updatedAt=? WHERE id=?').bind(status,new Date().toISOString(),id).run(); if(!r.meta?.changes) throw new Error("Partner account was not found."); return {success:true}; }
export async function createAffiliateCoupon(d:{affiliateId:string;couponCode:string;discountRate:number;commissionRate:number;minimumOrderValue?:number}) { const id=`coup_${crypto.randomUUID()}`,now=new Date().toISOString(),code=normalizeCouponCode(d.couponCode); await db().prepare('INSERT INTO "AffiliateCoupon" (id,affiliateId,couponCode,discountRate,commissionRate,commissionBaseType,minimumOrderValue,usageLimit,timesUsed,status,createdAt,updatedAt) VALUES (?,?,?,?,?,\'discounted_value\',?,NULL,0,\'active\',?,?)').bind(id,d.affiliateId,code,Number(d.discountRate)||10,Number(d.commissionRate)||10,Number(d.minimumOrderValue)||0,now,now).run(); return db().prepare('SELECT * FROM "AffiliateCoupon" WHERE id=?').bind(id).first<any>(); }

export async function requestAffiliatePayout(email:string) {
  const portal=await getPartnerPortalData(email); if(!portal) throw new Error("Partner account not found.");
  if(portal.affiliate.status!=="active") throw new Error("Your partner account is not active.");
  if(portal.affiliate.paymentMethod!=="stripe_connect") throw new Error("Select Stripe Connect as your payout method first.");
  if(portal.metrics.payoutProcessing) throw new Error("A payout request is already pending or processing.");
  if(portal.metrics.availableBalance<portal.metrics.payoutThreshold) throw new Error("Your available balance has not reached the payout minimum.");
  if(!portal.affiliate.stripeAccountId) throw new Error("Complete Stripe Connect onboarding before requesting a payout.");
  const connect=await getStripeConnectAccountStatus(portal.affiliate.stripeAccountId);
  if(!connect.connected||!connect.payouts_enabled||!connect.details_submitted) throw new Error("Complete Stripe Connect verification before requesting a payout.");
  const id=`pay_${crypto.randomUUID()}`,now=new Date().toISOString(),amount=portal.metrics.availableBalance;
  await db().prepare('INSERT INTO "Payout" (id,affiliateId,amount,currency,status,paymentMethod,notes,createdAt,updatedAt) VALUES (?,?,?,\'EUR\',\'pending\',\'stripe_connect\',\'Partner payout request\',?,?)').bind(id,portal.affiliate.id,amount,now,now).run();
  await db().prepare('INSERT INTO "AffiliateNotification" (id,affiliateId,type,message,read,createdAt) VALUES (?,?,?,?,0,?)').bind(`notif_${id}`,portal.affiliate.id,"payout_requested",`Payout of €${amount.toFixed(2)} requested.`,now).run();
  return db().prepare('SELECT * FROM "Payout" WHERE id=?').bind(id).first<any>();
}

export async function processAffiliatePayout(payoutId:string) {
  const payout=await db().prepare('SELECT * FROM "Payout" WHERE id=?').bind(payoutId).first<any>();
  if(!payout) throw new Error("Payout request was not found.");
  if(payout.status==="paid"&&payout.stripeTransferId) return payout;
  if(payout.status!=="pending"||payout.paymentMethod!=="stripe_connect") throw new Error("Only pending Stripe Connect requests can be processed.");
  const affiliate=await db().prepare('SELECT * FROM "Affiliate" WHERE id=?').bind(payout.affiliateId).first<any>();
  if(!affiliate||affiliate.status!=="active") throw new Error("Partner account is not active.");
  if(!affiliate.stripeAccountId||!stripeConfigured()) throw new Error("Stripe Connect is not configured for this partner.");
  const commissions=await db().prepare('SELECT id,commissionAmount FROM "CommissionRecord" WHERE affiliateId=? AND status=\'approved\' AND payoutId IS NULL ORDER BY createdAt,id').bind(affiliate.id).all<any>();
  const balance=Math.round(commissions.results.reduce((sum,row)=>sum+Number(row.commissionAmount||0),0)*100)/100;
  if(Math.round(Number(payout.amount)*100)!==Math.round(balance*100)||balance<Number(affiliate.payoutThreshold||50)) throw new Error("The available commission balance changed. Refresh the partner portal and submit a new request.");
  const stripe=getStripe(),account=await stripe.accounts.retrieve(affiliate.stripeAccountId);
  if(!account.details_submitted||!account.payouts_enabled) throw new Error("Partner must complete Stripe onboarding before a payout can be sent.");
  const transfer=await stripe.transfers.create({amount:Math.round(balance*100),currency:"eur",destination:affiliate.stripeAccountId,description:`SomnoBalance partner payout ${payout.id}`,metadata:{payoutId:payout.id,affiliateId:affiliate.id}},{idempotencyKey:`somnobalance-${payout.id}`});
  const now=new Date().toISOString();
  await db().batch([
    db().prepare('UPDATE "Payout" SET status=\'paid\',stripeTransferId=?,paymentReference=?,paymentDate=?,updatedAt=? WHERE id=? AND status=\'pending\'').bind(transfer.id,transfer.id,now,now,payout.id),
    db().prepare('UPDATE "CommissionRecord" SET payoutId=?,status=\'paid\',updatedAt=? WHERE affiliateId=? AND status=\'approved\' AND payoutId IS NULL').bind(payout.id,now,affiliate.id),
  ]);
  return db().prepare('SELECT * FROM "Payout" WHERE id=?').bind(payout.id).first<any>();
}

export async function createAffiliatePayout(data:{affiliateId:string;amount:number;paymentMethod?:"stripe_connect"|"bank_transfer";paymentReference?:string;notes?:string}) {
  if(data.paymentMethod&&data.paymentMethod!=="stripe_connect") throw new Error("Automated payout processing currently supports Stripe Connect only.");
  const affiliate=await db().prepare('SELECT email FROM "Affiliate" WHERE id=?').bind(data.affiliateId).first<{email:string}>();
  if(!affiliate) throw new Error("Partner account was not found.");
  const portal=await getPartnerPortalData(affiliate.email); if(!portal) throw new Error("Partner account was not found.");
  if(Math.round(Number(data.amount)*100)!==Math.round(portal.metrics.availableBalance*100)) throw new Error("Enter the partner's full available commission balance.");
  if(portal.metrics.payoutProcessing) throw new Error("A payout request is already pending or processing.");
  const id=`pay_${crypto.randomUUID()}`,now=new Date().toISOString();
  await db().prepare('INSERT INTO "Payout" (id,affiliateId,amount,currency,status,paymentMethod,paymentReference,notes,createdAt,updatedAt) VALUES (?,?,?,\'EUR\',\'pending\',\'stripe_connect\',?,?,?,?)').bind(id,data.affiliateId,data.amount,data.paymentReference||null,data.notes||"Admin-approved commission payout",now,now).run();
  return processAffiliatePayout(id);
}
export async function updateAffiliateStripeAccount(id:string,stripeAccountId:string) { const value=stripeAccountId.trim(); await db().prepare('UPDATE "Affiliate" SET stripeAccountId=?,paymentMethod=\'stripe_connect\',updatedAt=? WHERE id=?').bind(value,new Date().toISOString(),id).run(); return {success:true,stripeAccountId:value}; }
export async function updateAffiliatePaymentDetails(id:string,d:{paymentMethod:"stripe_connect"|"bank_transfer";bankName?:string;iban?:string;bicSwift?:string}) { const bank=d.bankName?.trim()||"",iban=d.iban?.replace(/\s+/g,"").toUpperCase()||"",bic=d.bicSwift?.replace(/\s+/g,"").toUpperCase()||""; if(d.paymentMethod==="bank_transfer"&&(!bank||!iban)) throw new Error("Bank name and IBAN are required for bank-transfer payouts."); await db().prepare('UPDATE "Affiliate" SET paymentMethod=?,bankName=?,iban=?,bicSwift=?,updatedAt=? WHERE id=?').bind(d.paymentMethod,bank||null,iban||null,bic||null,new Date().toISOString(),id).run(); const row=await db().prepare('SELECT paymentMethod,bankName,iban,bicSwift FROM "Affiliate" WHERE id=?').bind(id).first<any>(); if(!row) throw new Error("Partner account was not found."); return {success:true,paymentDetails:row}; }
export async function createStripeConnectAccount(id:string,email:string,origin:string,lang="en") { if(!stripeConfigured()) throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY in Cloudflare secrets."); const stripe=getStripe(),affiliate=await db().prepare('SELECT stripeAccountId FROM "Affiliate" WHERE id=?').bind(id).first<{stripeAccountId:string|null}>(); let account:any; if(affiliate?.stripeAccountId?.startsWith("acct_")) account=await stripe.accounts.retrieve(affiliate.stripeAccountId); else account=await stripe.accounts.create({type:"express",country:"DE",email,capabilities:{transfers:{requested:true}},business_type:"individual",metadata:{affiliateId:id}}); const link=await stripe.accountLinks.create({account:account.id,refresh_url:`${origin}/${lang}/partner?stripe=refresh`,return_url:`${origin}/${lang}/partner?stripe=connected`,type:"account_onboarding"}); await updateAffiliateStripeAccount(id,account.id); return {success:true,stripeAccountId:account.id,onboardingUrl:link.url}; }
export async function getStripeConnectAccountStatus(id:string) { if(!id) return {connected:false}; if(stripeConfigured()&&id.startsWith("acct_")) try { const a=await getStripe().accounts.retrieve(id); return {connected:true,id:a.id,payouts_enabled:a.payouts_enabled,charges_enabled:a.charges_enabled,details_submitted:a.details_submitted,default_currency:a.default_currency||"eur"}; } catch(e) { console.warn("[affiliateService] Stripe account lookup failed",e); } return {connected:false,id,payouts_enabled:false,charges_enabled:false,details_submitted:false,default_currency:"eur"}; }
export async function getAffiliateByEmail(email:string) { if(!email) return null; return db().prepare('SELECT * FROM "Affiliate" WHERE email=?').bind(email.trim().toLowerCase()).first<any>(); }
