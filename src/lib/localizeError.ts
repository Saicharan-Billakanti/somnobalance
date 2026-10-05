// Server routes and Supabase return English error strings; the UI is
// bilingual, so translate the known ones before showing them in German.
const de: Record<string, string> = {
  "Please enter your email and password.": "Bitte geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein.",
  "Accounts are not configured in this environment.": "Konten sind in dieser Umgebung nicht konfiguriert.",
  "Unable to sign in right now.": "Anmeldung derzeit nicht möglich.",
  "Incorrect email or password.": "E-Mail-Adresse oder Passwort ist falsch.",
  "Invalid login credentials": "E-Mail-Adresse oder Passwort ist falsch.",
  "Email not confirmed": "Die E-Mail-Adresse wurde noch nicht bestätigt.",
  "User already registered": "Ein Konto mit dieser E-Mail-Adresse existiert bereits.",
  "Unauthorized": "Nicht autorisiert.",
  "Invalid payload": "Ungültige Eingabe.",
  "Database is not configured.": "Die Datenbank ist nicht konfiguriert.",
  "Verified email and profile details are required.": "Bestätigte E-Mail-Adresse und Profildaten sind erforderlich.",
  "Accounts are not available in this environment yet.": "Konten sind in dieser Umgebung noch nicht verfügbar.",
  "Please log in or sign up before sending a business request so we can keep track of it.":
    "Bitte melden Sie sich an oder registrieren Sie sich, bevor Sie eine Geschäftsanfrage senden, damit wir sie zuordnen können.",
  "Your approved business account is required.": "Ein freigegebenes Geschäftskonto ist erforderlich.",
  "Catalog product was not found.": "Das Katalogprodukt wurde nicht gefunden.",
  "Company name, contact name, and email are required": "Firmenname, Ansprechpartner und E-Mail-Adresse sind erforderlich.",
  "Message is required": "Bitte geben Sie eine Nachricht ein.",
  "No business account or inquiry found. Please submit your application first.":
    "Kein Geschäftskonto und keine Anfrage gefunden. Bitte senden Sie zuerst Ihre Bewerbung ab.",
  "Supabase Auth is not configured.": "Die Authentifizierung ist nicht konfiguriert.",
  "Invalid message": "Ungültige Nachricht.",
  "Could not send your message. Please try again.": "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
  "Missing coupon code": "Gutscheincode fehlt.",
  "Could not validate coupon.": "Gutschein konnte nicht geprüft werden.",
  "Could not validate coupon": "Gutschein konnte nicht geprüft werden.",
  "Invalid coupon code": "Ungültiger Gutscheincode.",
  "Please enter a coupon code.": "Bitte geben Sie einen Gutscheincode ein.",
  "Invalid or inactive coupon code.": "Ungültiger oder inaktiver Gutscheincode.",
  "This referral code is currently not active.": "Dieser Empfehlungscode ist derzeit nicht aktiv.",
  "This coupon code has reached its usage limit.": "Dieser Gutscheincode hat sein Nutzungslimit erreicht.",
  "Missing orderId": "Bestellnummer fehlt.",
  "Order not found": "Bestellung nicht gefunden.",
  "Invalid order data": "Ungültige Bestelldaten.",
  "Database is not configured. Orders cannot be accepted.": "Die Datenbank ist nicht konfiguriert. Bestellungen können nicht angenommen werden.",
  "You must be signed in as an affiliate.": "Sie müssen als Affiliate-Partner angemeldet sein.",
  "Partner account not found.": "Partnerkonto nicht gefunden.",
  "Invalid action.": "Ungültige Aktion.",
  "Email is required.": "E-Mail-Adresse ist erforderlich.",
  "No partner account found for this email.": "Für diese E-Mail-Adresse wurde kein Partnerkonto gefunden.",
  "Could not load partner portal data.": "Partnerportal-Daten konnten nicht geladen werden.",
  "Name and email are required.": "Name und E-Mail-Adresse sind erforderlich.",
  "Could not submit partner application. Please try again.":
    "Partnerbewerbung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
  "Could not submit application.": "Bewerbung konnte nicht gesendet werden.",
  "Stripe onboarding could not be started.": "Das Stripe-Onboarding konnte nicht gestartet werden.",
  "Failed to submit application": "Bewerbung konnte nicht gesendet werden.",
  "Failed to update profile": "Profil konnte nicht aktualisiert werden.",
  "Could not create your profile.": "Ihr Profil konnte nicht erstellt werden.",
  "Unable to add this product to your business catalog.": "Dieses Produkt konnte nicht zu Ihrem Geschäftskatalog hinzugefügt werden.",
  "Failed to reach /api/health": "/api/health ist nicht erreichbar.",
  "An unexpected error occurred during evaluation.": "Bei der Auswertung ist ein unerwarteter Fehler aufgetreten.",
  "Failed to load questions": "Fragen konnten nicht geladen werden.",
};

export function localizeError(message: string, lang: string): string {
  if (lang !== "de") return message;
  if (de[message]) return de[message];
  const min = message.match(/^Minimum order amount for this code is €([\d.]+)\.$/);
  if (min) return `Der Mindestbestellwert für diesen Code beträgt ${min[1].replace(".", ",")} €.`;
  const pw = message.match(/^Password should be at least (\d+) characters/);
  if (pw) return `Das Passwort muss mindestens ${pw[1]} Zeichen lang sein.`;
  return message;
}
