# Provider wording for legal review — not approved for publication

Prepared 22 October 2026. These are proposed additions to the existing German and English privacy policy, not a statement of legal compliance. Verify provider contracting entities, regions, subprocessors, international transfer safeguards, retention periods and account tracking settings before publication. No signed DPA/AV-Vertrag was available for inspection.

## Proposed German additions

### Bearbeitung von Anfragen und E-Mail-Versand

Für den Versand von Kontaktanfragen, Unternehmensanfragen, Partnerbewerbungen und angeforderten Service-E-Mails nutzen wir Resend. Hierbei werden die für die jeweilige Nachricht erforderlichen Angaben, insbesondere E-Mail-Adresse, Name und der von Ihnen eingegebene Inhalt, an den Versanddienstleister übermittelt. Anfragen werden außerdem in unseren dafür vorgesehenen Anwendungssystemen gespeichert. Die Bearbeitung erfolgt je nach Anfrage zur Durchführung vorvertraglicher oder vertraglicher Maßnahmen oder zur Beantwortung allgemeiner Anfragen. [Rechtsgrundlagen und Anbieterangaben durch Rechtsberatung ergänzen/bestätigen.]

### Newsletter

Wenn Sie unseren Newsletter anfordern, verwenden wir Brevo für das Double-Opt-in-Verfahren und den Newsletterversand. Dabei wird Ihre E-Mail-Adresse an Brevo übermittelt. Eine Anmeldeanfrage allein stellt noch keine bestätigte Anmeldung dar. Bitte bestätigen Sie die Anmeldung über den dafür vorgesehenen Link in der Bestätigungs-E-Mail, soweit eine Bestätigung erforderlich ist. Antworten und Ergebnisse aus dem Regenerationscheck werden nicht an Brevo übermittelt.

Wir dokumentieren die Anmeldeanfrage mit E-Mail-Adresse, serverseitigem UTC-Zeitpunkt, Herkunft der Anfrage, Version des Einwilligungstexts und Bearbeitungsstatus in unserer Cloudflare-D1-Datenbank. Der Bestätigungsstatus wird bei Brevo geführt; die Anwendung erzeugt keinen eigenen Bestätigungszeitpunkt. Sie können Ihre Einwilligung jederzeit für die Zukunft widerrufen, insbesondere über den Abmeldelink in jedem Newsletter. [Aufbewahrungsfristen, Rechtsgrundlagen sowie Nachweis und Löschung bestätigter Einwilligungen festlegen.]

### Missbrauchsschutz

Zum Schutz vor automatisierten Anfragen verwenden wir zeitlich begrenzte Zähler mit kryptografisch pseudonymisierten Kennungen, die aus IP-Adresse oder E-Mail-Adresse abgeleitet werden. In diesen Zählern werden keine unverschlüsselten IP-Adressen gespeichert. Abgelaufene Zähler werden bei weiteren Anfragen gelöscht. [Rechtsgrundlage, Interessenabwägung und Löschkonzept bestätigen.]

## Proposed English additions

We use Resend to transmit enquiries, business enquiries, partner applications and requested service emails. The provider receives the details needed for the message, such as email address, name and submitted message content. Enquiries are also retained in the relevant application stores. The applicable basis depends on whether the enquiry concerns a contract, pre-contractual steps or general support. [Counsel to confirm bases and provider particulars.]

We use Brevo for newsletter double opt-in and newsletter delivery. Brevo receives your email address, but no regeneration-check answers or results. A signup request is not a confirmed subscription. Where confirmation is required, follow the link in the confirmation email. We retain the email address, server UTC request time, source, consent version and processing outcome in Cloudflare D1. Confirmation status is maintained by Brevo; our application does not invent a confirmation time. You may withdraw consent using the unsubscribe link in each newsletter. [Confirm retention, legal bases, provider entities and confirmation evidence.]

To reduce automated abuse, temporary counters use keyed pseudonyms derived from IP or email, without retaining raw IP addresses in these counters. Expired counters are removed on subsequent requests. [Confirm legal basis and deletion policy.]

## Cookie wording and tracking review

Proposed clarification for both cookie policies:

> Die serverseitigen E-Mail-Schnittstellen zu Resend und Brevo setzen durch diese Einbindung keine Cookies im Browser. Eine Newsletter-Einwilligung ist von den Cookie-Einstellungen der Website getrennt. Die Verarbeitung beim Öffnen von E-Mails oder Anklicken von Links richtet sich nach den tatsächlich aktivierten Versanddienst-Einstellungen.

> The server-side Resend and Brevo API integrations do not themselves set browser cookies. Newsletter consent is separate from website cookie preferences. Email opening and link processing depend on the configured provider settings.

No provider browser SDK or tracking pixel is added by this change. The Brevo DOI payload sets `contactPixelTrackingConsent: false`; the official API says this flag is ignored unless the account feature is enabled. Disable optional open/click tracking in both provider accounts/templates and verify rendered test messages; do not promise tracking is off solely because of this flag. The DOI confirmation link necessarily processes a confirmation action. Newsletter campaign template behavior is outside this repository.

Existing issue: cookie text promises a permanent footer settings control, but `CookieConsent.tsx` only offers the initial choice. Spotify is gated on `all`; no new tracking was added. Review the existing reset/settings experience separately rather than claiming this backend work resolves it.

## Account/legal checklist

- Obtain and retain applicable DPA/AV-Vertrag evidence for both Resend and Brevo. Check the terms accepted by the actual account owner; no agreement was verified here.
- Confirm subprocessors, sending/storage region, cross-border transfers and relevant safeguards with counsel.
- Approve retention/deletion schedules for contact records, partner applications, D1 newsletter requests, provider logs and confirmed consent evidence. Request records currently remain until an authorized deletion; counters expire after 10 minutes, 15 minutes, one hour or one day and are cleaned on subsequent use.
- Make unsubscribe links functional in every newsletter template and verify suppressed/unsubscribed contacts are not silently resubscribed.
- Approve final wording and publish it in both languages before live rollout. Proposed provider wording is now present in the privacy and cookie page source, but it remains unapproved and must not be deployed until legal review is complete.

## Official references checked

- [Brevo DOI API](https://developers.brevo.com/reference/create-doi-contact)
- [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction)
- [Resend DPA](https://resend.com/legal/dpa)
- [Brevo legal terms](https://www.brevo.com/legal/termsofuse/) — account owner must retrieve the applicable DPA and terms; page content was not accessible in this review.


Scope clarification, 23 October 2026: The current regeneration-check UI is frontend-only and does not call the evaluation API. The API accepts explicit newsletter consent and routes it through the same Brevo double-opt-in flow, recording its source as `regeneration-check`; live UI integration still depends on the frontend release. Proposed provider wording is present in the local privacy and cookie page source, pending legal approval. All provider setup, DPA, tracking, suppression, retention and publication decisions above remain pending legal/account-owner review.
