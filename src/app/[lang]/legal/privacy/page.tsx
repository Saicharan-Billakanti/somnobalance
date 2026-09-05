import { LegalPage } from "@/components/LegalPage";
import { business } from "@/lib/site";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Privacy Policy — SomnoBalance" };

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.privacy.title} updated="4. September 2026">
        <p>
          SomnoBalance, betrieben von {business.ownerName}, handelnd unter der Bezeichnung
          &quot;Willing1863&quot; (Einzelunternehmen) (&quot;SomnoBalance&quot;, &quot;wir&quot;,
          &quot;uns&quot;, &quot;unser&quot;), respektiert Ihre Privatsphäre und setzt sich für den
          Schutz der personenbezogenen Daten ein, die Sie uns über unsere Website, unseren
          B2C-Shop, unseren B2B-Zugangsbereich und unser Partnerportal unter
          www.somnobalance.com (zusammen die &quot;Plattform&quot;) mitteilen.
        </p>
        <p>
          Diese Datenschutzerklärung erläutert im Einklang mit der
          Datenschutz-Grundverordnung (&quot;DSGVO&quot;) und dem anwendbaren deutschen
          Datenschutzrecht, welche personenbezogenen Daten wir erheben, warum und auf welcher
          Rechtsgrundlage wir sie verarbeiten, wann wir sie ggf. weitergeben, wie lange wir sie
          speichern und welche Rechte Ihnen zustehen. Mit der Nutzung der Plattform bestätigen
          Sie, dass Sie diese Datenschutzerklärung gelesen und verstanden haben.
        </p>

        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlicher im Sinne der DSGVO für die in dieser Erklärung beschriebene
          Verarbeitung ist {business.ownerName}, handelnd unter der Bezeichnung
          &quot;Willing1863&quot; (Einzelunternehmen), {business.addressLine1},{" "}
          {business.addressLine2}. Bei Fragen zu dieser Erklärung oder zur Nutzung Ihrer Daten
          erreichen Sie uns unter {business.email}. Vollständige Unternehmensangaben finden Sie
          in unserem <a href={`/${lang}/legal/impressum`}>Impressum</a>.
        </p>

        <h2>2. Welche Informationen wir erheben</h2>
        <p>
          Wir erheben Informationen, die Sie uns freiwillig mitteilen, wenn Sie die Plattform
          nutzen, ein Konto anlegen, eine Bestellung aufgeben, sich für den B2B- oder
          Partnerzugang registrieren, uns kontaktieren oder anderweitig mit unseren Services
          interagieren. Dazu können gehören:
        </p>
        <ul>
          <li>Vollständiger Name</li>
          <li>E-Mail-Adresse</li>
          <li>Mobil-/Telefonnummer</li>
          <li>Rechnungsadresse</li>
          <li>Liefer-/Versandadresse</li>
          <li>Kontoinformationen</li>
          <li>Bestell- und Transaktionsdetails</li>
          <li>
            Schlaf- und Produktpräferenzen, die Sie freiwillig mit uns teilen (z. B. Härtegrad,
            Materialien oder Ritual-Vorlieben)
          </li>
          <li>
            Für B2B-Kund:innen: Firmenname, Gewerbe-/Registerangaben, USt-IdNr. und
            Kontaktpersonendaten
          </li>
          <li>
            Für Affiliate-Partner:innen: berufliche Qualifikation bzw. Nachweise,
            Geschäftsangaben sowie Zahlungsdaten für Provisionszahlungen
          </li>
          <li>Angaben gegenüber unserem Kundenservice</li>
          <li>Sonstige von Ihnen freiwillig bereitgestellte Informationen</li>
        </ul>
        <p>
          Zudem erheben wir beim Besuch der Plattform automatisch technische Informationen wie
          IP-Adresse, Browsertyp, Gerätetyp, Betriebssystem, aufgerufene Seiten, verweisende
          URLs, ungefähren Standort und Nutzungsdaten der Plattform, in der Regel mittels
          Cookies und ähnlicher Technologien (siehe Ziffer 7).
        </p>

        <h2>3. Rechtsgrundlagen und Zwecke der Verarbeitung</h2>
        <p>
          Wir verarbeiten personenbezogene Daten für folgende Zwecke auf folgenden
          Rechtsgrundlagen gemäß Art. 6 Abs. 1 DSGVO:
        </p>
        <ul>
          <li>
            Bearbeitung und Erfüllung Ihrer Bestellungen, Versand und Lieferung,
            Zahlungsabwicklung — Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO)
          </li>
          <li>
            Verwaltung Ihres B2B-Kontos oder Ihrer Affiliate-Partnerschaft, einschließlich
            Onboarding, Verifizierung und Provisionszahlungen — Vertragserfüllung bzw.
            vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO)
          </li>
          <li>
            Beantwortung von Anfragen und Kundensupport — Art. 6 Abs. 1 lit. b und lit. f DSGVO
          </li>
          <li>
            Versand bestell- und servicebezogener Mitteilungen — Vertragserfüllung (Art. 6 Abs.
            1 lit. b DSGVO)
          </li>
          <li>
            Versand von Marketingmitteilungen wie unserem Newsletter — Ihre Einwilligung (Art. 6
            Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können
          </li>
          <li>
            Verbesserung der Plattform, Betrugsprävention und Aufrechterhaltung der Sicherheit —
            unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO)
          </li>
          <li>Erfüllung rechtlicher, steuerlicher und buchhalterischer Pflichten — Art. 6 Abs. 1 lit. c DSGVO</li>
        </ul>

        <h2>4. Zahlungsinformationen</h2>
        <p>
          Zahlungen können über den Zahlungsdienstleister Stripe abgewickelt werden.
          SomnoBalance speichert bewusst keine vollständigen Kartennummern, CVV-Codes oder
          Online-Banking-Passwörter auf eigenen Servern. Zahlungsdaten werden von Stripe gemäß
          dessen eigenen Sicherheits- und Datenschutzrichtlinien sowie, soweit einschlägig, den
          PCI-DSS-Standards verarbeitet.
        </p>

        <h2>5. Weitergabe von Informationen</h2>
        <p>
          Wir verkaufen Ihre personenbezogenen Daten nicht. Wir geben notwendige Informationen
          an vertrauenswürdige Dienstleister weiter, unter anderem an:
        </p>
        <ul>
          <li>Zahlungsdienstleister</li>
          <li>Kurier- und Logistikunternehmen (einschließlich Spezialtransporteure für sperrige Waren wie Matratzen)</li>
          <li>Hosting- und IT-Dienstleister</li>
          <li>Analyseanbieter</li>
          <li>Kundensupport-Dienstleister</li>
          <li>Anbieter für Affiliate-Tracking und Provisionsabrechnung</li>
          <li>E-Mail- und Marketing-Dienstleister, soweit einschlägig</li>
          <li>Berufliche Berater:innen (Recht, Steuern, Wirtschaftsprüfung)</li>
          <li>Behörden oder Strafverfolgungsbehörden, soweit gesetzlich vorgeschrieben</li>
        </ul>
        <p>
          So können beispielsweise Ihr Name, Ihre Telefonnummer und Ihre Lieferadresse an einen
          Kurierpartner weitergegeben werden, um Ihre Bestellung auszuliefern. Befindet sich ein
          Dienstleister außerhalb des Europäischen Wirtschaftsraums, stützen wir uns auf
          geeignete Garantien wie die EU-Standardvertragsklauseln oder einen entsprechenden
          Angemessenheitsbeschluss; Näheres teilen wir Ihnen auf Anfrage mit.
        </p>

        <h2>6. Eingebettete Spotify-Player</h2>
        <p>
          Unsere Plattform nutzt das offizielle Einbettungstool von Spotify, um passend zu jeder
          Phase des SomnoBalance-Rituals (Regulate · Let Go · Prepare · Regenerate) kuratierte
          Musik anzubieten. Eine gesonderte Musiklizenz ist auf unserer Seite nicht
          erforderlich, da die Lizenz für die gestreamten Inhalte bei Spotify verbleibt. Beim
          Laden eines Spotify-Players kann Spotify eigene Cookies setzen und technische
          Nutzungsdaten gemäß der eigenen Datenschutzerklärung von Spotify verarbeiten. Soweit
          gesetzlich erforderlich, werden Spotify-Player erst nach Ihrer Einwilligung über
          unser Consent-Tool geladen, oder erst nachdem Sie aktiv auf &quot;Abspielen&quot;
          geklickt haben.
        </p>

        <h2>7. Cookies und ähnliche Technologien</h2>
        <p>
          Wir verwenden Cookies und ähnliche Technologien, um wesentliche Funktionen der
          Plattform zu ermöglichen, Ihre Präferenzen zu speichern, Warenkorbinformationen zu
          erhalten und, vorbehaltlich Ihrer Einwilligung, um den Traffic zu analysieren, die
          Marketingleistung zu verbessern und eingebettete Inhalte wie die oben beschriebenen
          Spotify-Player zu laden.
        </p>
        <p>
          Im Einklang mit dem Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG,
          vormals TTDSG) und den geltenden ePrivacy-Vorgaben holen wir Ihre Einwilligung ein,
          bevor wir nicht notwendige Cookies setzen; dies erfolgt über das Consent-Banner, das
          Ihnen bei Ihrem ersten Besuch angezeigt wird. Sie können Ihre Einwilligung jederzeit
          über unsere{" "}
          <a href={`/${lang}/legal/cookies`}>Cookie-Richtlinie</a> oder Ihre Browsereinstellungen
          widerrufen oder ändern. Das Deaktivieren notwendiger Cookies kann die
          Funktionsfähigkeit der Plattform beeinträchtigen.
        </p>

        <h2>8. Marketingmitteilungen</h2>
        <p>
          Sofern Sie eingewilligt haben, etwa per Double-Opt-in für unseren Newsletter, oder
          soweit gesetzlich anderweitig zulässig, kontaktieren wir Sie ggf. zu neuen Produkten,
          Ritualen, Angeboten und weiteren Inhalten von SomnoBalance. Sie können Ihre
          Einwilligung jederzeit über den Abmeldelink in jeder Mitteilung oder durch
          Kontaktaufnahme mit uns widerrufen. Transaktionsbezogene Mitteilungen zu Bestellung,
          Zahlung, Lieferung, Rückgabe oder Support versenden wir weiterhin, soweit
          erforderlich.
        </p>

        <h2>9. Datensicherheit</h2>
        <p>
          Wir treffen angemessene technische und organisatorische Maßnahmen, um
          personenbezogene Daten vor unbefugtem Zugriff, Missbrauch, Verlust, Veränderung oder
          Offenlegung zu schützen. Eine vollständig sichere Übertragung von Daten über das
          Internet oder Speicherung in elektronischen Systemen kann jedoch nicht garantiert
          werden.
        </p>

        <h2>10. Speicherdauer</h2>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für die oben genannten
          Zwecke angemessen erforderlich ist, einschließlich gesetzlicher
          Aufbewahrungspflichten nach deutschem Handels- und Steuerrecht (z. B. § 257 HGB und §
          147 AO), die für bestimmte Geschäftsunterlagen in der Regel eine Aufbewahrung von
          sechs bis zehn Jahren vorsehen. Werden Daten nicht mehr benötigt, löschen oder
          anonymisieren wir sie vorbehaltlich dieser gesetzlichen Aufbewahrungsfristen.
        </p>

        <h2>11. Internationale Datenübermittlungen</h2>
        <p>
          Sofern wir oder unsere Dienstleister personenbezogene Daten außerhalb des
          Europäischen Wirtschaftsraums übermitteln, etwa im Zusammenhang mit bestimmten
          Hosting-, Analyse- oder Musik-Einbettungsanbietern, stützen wir uns auf geeignete
          Garantien wie die EU-Standardvertragsklauseln oder einen entsprechenden
          Angemessenheitsbeschluss. Weitere Einzelheiten erhalten Sie auf Anfrage.
        </p>

        <h2>12. Websites Dritter</h2>
        <p>
          Die Plattform kann Links zu Websites oder Diensten Dritter enthalten. SomnoBalance
          ist nicht verantwortlich für die Datenschutzpraktiken oder Inhalte dieser Websites
          Dritter. Wir empfehlen Ihnen, deren Datenschutzerklärungen zu prüfen, bevor Sie dort
          personenbezogene Daten angeben.
        </p>

        <h2>13. Ihre Rechte nach der DSGVO</h2>
        <p>Vorbehaltlich der gesetzlichen Voraussetzungen haben Sie das Recht auf:</p>
        <ul>
          <li>Auskunft über die von uns über Sie gespeicherten personenbezogenen Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung, soweit gesetzlich zulässig (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Übertragbarkeit der von Ihnen bereitgestellten Daten (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen eine auf berechtigten Interessen beruhende Verarbeitung oder gegen Direktwerbung (Art. 21 DSGVO)</li>
          <li>
            jederzeitigen Widerruf einer erteilten Einwilligung, ohne dass die Rechtmäßigkeit der
            bis zum Widerruf erfolgten Verarbeitung berührt wird (Art. 7 Abs. 3 DSGVO)
          </li>
          <li>
            Beschwerde bei einer Datenschutz-Aufsichtsbehörde, insbesondere in dem
            EU-Mitgliedstaat Ihres Aufenthaltsorts, Arbeitsplatzes oder des Orts des
            mutmaßlichen Verstoßes (Art. 77 DSGVO)
          </li>
        </ul>
        <p>
          Für uns zuständig ist die {business.supervisoryAuthority}. Wir können vor der
          Bearbeitung bestimmter Anfragen eine angemessene Identitätsprüfung verlangen.
        </p>

        <h2>14. Datenschutz von Kindern</h2>
        <p>
          Die Plattform richtet sich an Erwachsene und ist nicht für Kinder bestimmt. Wenn Sie
          der Ansicht sind, dass ein Kind uns ohne angemessene elterliche Einwilligung
          personenbezogene Daten mitgeteilt hat, kontaktieren Sie uns bitte, damit wir dies
          prüfen können.
        </p>

        <h2>15. Änderungen dieser Erklärung</h2>
        <p>
          Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Die
          aktualisierte Fassung wird mit einem neuen Datum unter &quot;Letzte
          Aktualisierung&quot; auf dieser Seite veröffentlicht.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.privacy.title} updated="4 September 2026">
      <p>
        SomnoBalance, operated by {business.ownerName}, trading as &quot;Willing1863&quot; (sole
        proprietorship / Einzelunternehmen) (&quot;SomnoBalance&quot;, &quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;), respects your privacy and is committed to protecting the
        personal data you share with us across our website, our B2C store, our B2B access area and
        our affiliate portal at www.somnobalance.com (together, the &quot;Platform&quot;).
      </p>
      <p>
        This Privacy Policy explains, in line with the EU General Data Protection Regulation
        (&quot;GDPR&quot;) and applicable German data-protection law, what personal data we
        collect, why and on what legal basis we process it, when we may share it, how long we keep
        it, and the rights available to you. By using the Platform, you acknowledge that you have
        read and understood this Privacy Policy.
      </p>

      <h2>1. Data controller</h2>
      <p>
        The controller responsible for the processing described in this Policy is{" "}
        {business.ownerName}, trading as &quot;Willing1863&quot; (sole proprietorship /
        Einzelunternehmen), {business.addressLine1}, {business.addressLine2}. For questions about
        this Policy or about our use of your data, contact us at {business.email}. Full corporate
        details are set out in our{" "}
        <a href={`/${lang}/legal/impressum`}>Legal Notice (Impressum)</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>
        We may collect information you voluntarily provide when you browse the Platform, create
        an account, place an order, register for B2B or affiliate access, contact us, or otherwise
        interact with our services. This may include:
      </p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Mobile/telephone number</li>
        <li>Billing address</li>
        <li>Shipping/delivery address</li>
        <li>Account information</li>
        <li>Order and transaction details</li>
        <li>
          Sleep and product preferences you choose to share with us (for example firmness,
          materials or ritual preferences)
        </li>
        <li>For B2B customers: company name, business registration details, VAT ID and contact-person details</li>
        <li>
          For affiliate partners: professional qualification or credentials, business details and
          payment details for commission payments
        </li>
        <li>Information provided to our customer-support team</li>
        <li>Any other information you voluntarily provide</li>
      </ul>
      <p>
        We may also automatically collect technical information when you visit the Platform, such
        as IP address, browser type, device type, operating system, pages visited, referring URLs,
        approximate location, and Platform interaction data, generally via cookies and similar
        technologies (see Section 7).
      </p>

      <h2>3. Legal basis and purposes of processing</h2>
      <p>We process personal data for the following purposes and on the following legal bases under Art. 6(1) GDPR:</p>
      <ul>
        <li>To process and fulfil your orders, arrange shipping and delivery, and process payments — performance of a contract (Art. 6(1)(b) GDPR)</li>
        <li>To manage your B2B account or affiliate partnership, including onboarding, verification and commission payments — performance of a contract or pre-contractual measures (Art. 6(1)(b) GDPR)</li>
        <li>To respond to enquiries and provide customer support — Art. 6(1)(b) and Art. 6(1)(f) GDPR</li>
        <li>To send order- and service-related communications — performance of a contract (Art. 6(1)(b) GDPR)</li>
        <li>To send marketing communications such as our newsletter — your consent (Art. 6(1)(a) GDPR), which you may withdraw at any time</li>
        <li>To improve the Platform, prevent fraud and maintain security — our legitimate interests (Art. 6(1)(f) GDPR)</li>
        <li>To comply with legal, tax and accounting obligations — Art. 6(1)(c) GDPR</li>
      </ul>

      <h2>4. Payment information</h2>
      <p>
        Payments may be processed through our third-party payment provider, Stripe. SomnoBalance
        does not intentionally store complete card numbers, CVV codes or banking passwords on its
        own servers. Payment data is processed by Stripe in accordance with its own security and
        privacy practices and, where relevant, PCI-DSS standards.
      </p>

      <h2>5. Sharing of information</h2>
      <p>We do not sell your personal data. We may share necessary information with trusted service providers, including:</p>
      <ul>
        <li>Payment providers</li>
        <li>Courier and logistics companies (including specialist carriers for bulky goods such as mattresses)</li>
        <li>Website hosting and IT providers</li>
        <li>Analytics providers</li>
        <li>Customer-support providers</li>
        <li>Affiliate-tracking and commission-payment providers</li>
        <li>Email and marketing service providers, where applicable</li>
        <li>Professional advisers (legal, tax, audit)</li>
        <li>Government or law-enforcement authorities, where legally required</li>
      </ul>
      <p>
        For example, your name, phone number and delivery address may be shared with a courier
        partner to fulfil your order. Where a service provider is located outside the European
        Economic Area, we rely on appropriate safeguards such as EU Standard Contractual Clauses
        or an applicable adequacy decision; details are available on request.
      </p>

      <h2>6. Embedded Spotify players</h2>
      <p>
        Our Platform uses Spotify&apos;s official embedding tool to offer curated music for each
        phase of the SomnoBalance ritual (Regulate · Let Go · Prepare · Regenerate). No separate
        music licence is required on our side, as the licence for the streamed content remains
        with Spotify. When a Spotify player is loaded, Spotify may set its own cookies and process
        technical and usage data in accordance with Spotify&apos;s own privacy policy. Where
        required by law, Spotify players are only loaded after you have given consent through our
        consent tool, or only after you actively click to play.
      </p>

      <h2>7. Cookies and similar technologies</h2>
      <p>
        We use cookies and similar technologies to enable essential Platform functions, remember
        your preferences, maintain shopping-cart information, and — subject to your consent — to
        analyse traffic, improve marketing performance and load embedded content such as the
        Spotify players described above.
      </p>
      <p>
        In line with the German Telecommunications-Digital Services Data Protection Act (TDDDG,
        formerly TTDSG) and applicable ePrivacy rules, we ask for your consent before setting
        non-essential cookies, through the consent banner shown on your first visit. You may
        withdraw or change your consent at any time via our{" "}
        <a href={`/${lang}/legal/cookies`}>Cookie Policy</a> or your browser settings. Disabling essential
        cookies may affect Platform functionality.
      </p>

      <h2>8. Marketing communications</h2>
      <p>
        Where you have given consent, for example via double opt-in for our newsletter or where
        otherwise permitted by law, we may contact you about new products, rituals, offers and
        other SomnoBalance content. You may withdraw consent at any time via the unsubscribe link
        in each communication or by contacting us. Transactional communications relating to your
        order, payment, delivery, returns or support will still be sent when necessary.
      </p>

      <h2>9. Data security</h2>
      <p>
        We take reasonable technical and organisational measures to protect personal data against
        unauthorised access, misuse, loss, alteration or disclosure. However, no Internet
        transmission or electronic storage system can be guaranteed to be completely secure.
      </p>

      <h2>10. Data retention</h2>
      <p>
        We retain personal data only as long as reasonably necessary for the purposes described
        above, including statutory retention obligations under German commercial and tax law (for
        example § 257 HGB and § 147 AO), which generally require certain business records to be
        kept for six to ten years. Where data is no longer required, we delete or anonymise it,
        subject to these statutory retention periods.
      </p>

      <h2>11. International transfers</h2>
      <p>
        Where we or our service providers transfer personal data outside the European Economic
        Area, for example in connection with certain hosting, analytics or music-embedding
        providers, we rely on appropriate safeguards such as EU Standard Contractual Clauses or an
        applicable adequacy decision. You may request further details by contacting us.
      </p>

      <h2>12. Third-party websites</h2>
      <p>
        The Platform may contain links to third-party websites or services. SomnoBalance is not
        responsible for the privacy practices or content of third-party websites. We encourage you
        to review their privacy policies before providing personal data.
      </p>

      <h2>13. Your rights under the GDPR</h2>
      <p>Subject to applicable law, you have the right to:</p>
      <ul>
        <li>Request access to the personal data we hold about you (Art. 15 GDPR)</li>
        <li>Request correction of inaccurate data (Art. 16 GDPR)</li>
        <li>Request erasure, where legally permissible (Art. 17 GDPR)</li>
        <li>Request restriction of processing (Art. 18 GDPR)</li>
        <li>Request a portable copy of the data you provided to us (Art. 20 GDPR)</li>
        <li>Object to processing based on legitimate interests or direct marketing (Art. 21 GDPR)</li>
        <li>Withdraw consent at any time, without affecting the lawfulness of processing before withdrawal (Art. 7(3) GDPR)</li>
      </ul>
      <p>
        The authority responsible for us is the {business.supervisoryAuthority}. We may request
        reasonable verification of your identity before processing certain requests.
      </p>

      <h2>14. Children&apos;s privacy</h2>
      <p>
        The Platform is intended for adults and is not directed at children. If you believe a
        child has provided personal data to us without appropriate parental consent, please
        contact us so that we can address it.
      </p>

      <h2>15. Policy changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The updated version will be published
        on this page with a revised &quot;Last Updated&quot; date.
      </p>
    </LegalPage>
  );
}
