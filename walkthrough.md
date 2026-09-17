# SomnoBalance Unified Auth, B2B Portal & Admin Hub Walkthrough

## 1. Unified Authentication & Role-Based Routing
- **Unified Login Page (`/login`)**: Removed isolated admin login pages. All users (Customers, Partners/Affiliates, Business Members, and Administrators) use the same clean login page.
- **Dynamic Role Detection**:
  - **Administrator**: Granted immediate access to the **SomnoBalance Admin Hub** at `/admin`.
  - **Dual Affiliate & Customer**: If a user is registered as a partner and also shops as a customer, they are provided with a dedicated quick switcher between **Customer Shop** (`/shop`) and **Partner Portal** (`/partner`) in the header and mobile drawer.
  - **Customer Only**: Presented with a clear **"Become a Partner (15% Commission)"** link and **"For My Business"** options.
  - **Business Customer**: Redirected directly to their custom wholesale **B2B Portal** at `/for-business`.

---

## 2. SomnoBalance Admin Hub (`/admin`)
The Admin Hub has been upgraded with full access modules:
- 📊 **Analytics & Metrics**: Real-time gross revenue, order volume, average order value (AOV), conversion rates, 30-day interactive sales chart, and top product leaderboards.
- 📦 **Product Catalog Management**: Add custom products with live forms (Name, Category, Price, Phase, Description, Image URL, Shipping Included) and delete or manage existing items.
- ⚙️ **Taxation & Delivery Details**:
  - Configure Standard EU VAT (19%) and Reduced VAT (7%), and toggle VAT-inclusive pricing.
  - Configure Flat Parcel Shipping Rate, Free Shipping Threshold (e.g. €59), courier names (e.g. DHL GoGreen), and delivery windows.
- 🏢 **B2B & Hospitality Applications Hub**:
  - Full application pipeline for boutique hotels, wellness clinics, luxury spas, and corporate accounts.
  - Review business credentials and EU VAT IDs (USt-IdNr.).
  - Approve / Reject applications with custom wholesale discounts (e.g. 20% to 40% OFF).
  - **2-Way Communication Desk**: Interactive real-time message chat between Admin and each Business Customer.
- 🤝 **Affiliates & Commission Ledger**: Track health partners, generate custom coupon codes (e.g. `SOMNO-DR10`), approve commissions, and record bank payouts.

---

## 3. "For My Business" Portal (`/for-business`)
- Public overview of SomnoBalance hospitality solutions and nightstand guest amenity packages.
- Interactive **Business Application Form** collecting company name, contact, VAT ID, business type, and estimated volume.
- Dedicated **B2B Customer Portal** displaying the account's approval status, assigned wholesale rate, and a direct 2-way message chat with the SomnoBalance Admin desk.

---

## 4. Verification
- Built and verified with `npm run build:vinext`.
