// Central place for business/legal identifiers used across the site.
// Sourced from SomnoBalance_Legal_Policies_English_Final4.docx (04/09/2026).

export const business = {
  brandName: "SomnoBalance",
  legalEntityName: 'Friedrich-Alexander Willing, trading as "Willing1863" (sole proprietorship / Einzelunternehmen)',
  ownerName: "Friedrich-Alexander Willing",
  addressLine1: "Am Gelskamp 7",
  addressLine2: "32758 Detmold, Germany",
  country: "Germany",
  email: "faw@willing1863.com",
  supportEmail: "faw@willing1863.com",
  phone: "+49 5231 5681470",
  // Sole proprietorship — no Commercial Register entry is generally required.
  registerNote: "As a sole proprietorship (Einzelunternehmen), there is generally no obligation to register in the Commercial Register.",
  vatId: "DE189509701",
  ownerTitle: "Owner",
  supervisoryAuthority:
    "Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)",
  operatingSince: 2019,
};

export const currency = "EUR";

// Real operational facts from the legal policy documents — used across
// checkout, shipping, and legal pages so they all agree with each other.
export const shipping = {
  country: "Germany",
  carrier: "DHL",
  freeShippingThreshold: 59,
  belowThresholdRate: 4.9, // TODO: confirm exact sub-threshold shipping rate with the client
  inStockDeliveryDays: "1–3 business days after dispatch",
  mattressLeadTime: "approx. 3–4 weeks (made to order)",
};
