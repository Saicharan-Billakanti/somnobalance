// Central place for business/legal identifiers used across the site.
// Fields marked TODO must be filled with the real, registered details
// before this site is submitted with any payment gateway or delivery
// partner application — mismatched legal/registration info is one of
// the most common rejection reasons.

export const business = {
  brandName: "SomnoBalance",
  legalEntityName: "Willing1863 [legal form TBD — e.g. GmbH] — TODO: confirm exact registered name",
  ownerName: "Friedrich-A. Willing",
  addressLine1: "TODO: Street and house number",
  addressLine2: "TODO: Postal code and city, Germany",
  country: "Germany",
  email: "hello@somnobalance.com",
  supportEmail: "support@somnobalance.com",
  phone: "TODO: +49 …",
  registerCourt: "TODO: e.g. Amtsgericht [City]",
  registerNumber: "TODO: HRB …",
  vatId: "TODO: DE… (Umsatzsteuer-ID)",
  managingDirector: "Friedrich-A. Willing",
  bankNote:
    "TODO: bank/IBAN details are only needed internally for the payment gateway application form — do not publish them on the site.",
};

export const currency = "EUR";
