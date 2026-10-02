import { LegalPage } from "@/components/LegalPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export const metadata = { title: "Cookie Policy — SomnoBalance" };

export default async function CookiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  if (lang === "de") {
    return (
      <LegalPage lang="de" dict={dict} title={dict.legalPages.cookies.title} updated="4. September 2026">
        <h2>1. Was sind Cookies?</h2>
        <p>
          Cookies und ähnliche Technologien sind kleine Dateien oder technische Verfahren, die
          auf Ihrem Gerät gespeichert oder von diesem verwendet werden können. Sie helfen uns,
          die Website bereitzustellen, Einstellungen zu speichern und bestimmte Funktionen zu
          ermöglichen.
        </p>

        <h2>2. Essenzielle Cookies</h2>
        <p>
          Essenzielle Cookies und ähnliche Technologien werden eingesetzt, soweit sie für den
          Betrieb der Website notwendig sind. Dazu gehören Funktionen wie der Warenkorb, die
          Anmeldung und grundlegende Sicherheit.
        </p>

        <h2>3. Nicht essenzielle Cookies</h2>
        <p>Nicht essenzielle Cookies werden nur eingesetzt, wenn die erforderliche Einwilligung erteilt wurde. Dazu können gehören:</p>
        <ul>
          <li>Analyse der Websitenutzung und des Traffics</li>
          <li>Verbesserung der Marketingleistung</li>
          <li>Marketing- und Tracking-Funktionen, einschließlich Meta Pixel</li>
          <li>Eingebettete Inhalte, einschließlich Spotify-Player</li>
        </ul>

        <h2>4. Einwilligung</h2>
        <p>
          Beim ersten Besuch der Website wird ein Consent-Banner angezeigt. Nicht essenzielle
          Cookies werden erst gesetzt, nachdem die erforderliche Einwilligung erteilt wurde. Die
          Möglichkeit, nicht essenzielle Cookies abzulehnen, wird mit gleicher Gewichtung
          angeboten.
        </p>

        <h2>5. Cookie-Einstellungen ändern</h2>
        <p>
          Sie können Ihre Einwilligung jederzeit ändern oder widerrufen. Die Cookie-Einstellungen
          sind dauerhaft über den entsprechenden Link im Footer der Website erreichbar.
        </p>

        <h2>6. Weitere Dienste</h2>
        <p>
          Je nach Nutzung der Website können Dienste von Hosting-, Newsletter-, Analyse-,
          Marketing- und Zahlungsdienstleistern eingebunden sein. Informationen zu den
          tatsächlich genutzten Diensten und zur Verarbeitung personenbezogener Daten finden Sie
          in unserer <a href={`/${lang}/legal/privacy`}>Datenschutzerklärung</a>.
        </p>

        <h2>7. Kontakt</h2>
        <p>
          Fragen zu dieser Cookie-Richtlinie können Sie über die Kontaktdaten in unserem{" "}
          <a href={`/${lang}/legal/impressum`}>Impressum</a> an uns richten.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang="en" dict={dict} title={dict.legalPages.cookies.title} updated="4 September 2026">
      <h2>1. What are cookies?</h2>
      <p>
        Cookies and similar technologies are small files or technical methods that may be stored
        on or used by your device. They help us provide the website, remember settings and enable
        certain functions.
      </p>

      <h2>2. Essential cookies</h2>
      <p>
        Essential cookies and similar technologies are used where they are necessary for the
        operation of the website. This includes functions such as the shopping cart, login and
        basic security.
      </p>

      <h2>3. Non-essential cookies</h2>
      <p>Non-essential cookies are used only where the required consent has been given. These may include:</p>
      <ul>
        <li>Analysing website use and traffic</li>
        <li>Improving marketing performance</li>
        <li>Marketing and tracking functions, including the Meta Pixel</li>
        <li>Embedded content, including Spotify players</li>
      </ul>

      <h2>4. Consent</h2>
      <p>
        A consent banner is shown when you first visit the website. Non-essential cookies are only
        set after the required consent has been given. The option to reject non-essential cookies
        is presented with equal prominence.
      </p>

      <h2>5. Changing cookie settings</h2>
      <p>
        You can change or withdraw your consent at any time. Cookie settings remain permanently
        accessible through the relevant link in the website footer.
      </p>

      <h2>6. Other services</h2>
      <p>
        Depending on how the website is used, services from hosting, newsletter, analytics,
        marketing and payment providers may be integrated. Information about the services actually
        used and the processing of personal data is provided in our{" "}
        <a href={`/${lang}/legal/privacy`}>Privacy Policy</a>.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this Cookie Policy can be directed to us using the contact details in our{" "}
        <a href={`/${lang}/legal/impressum`}>Impressum</a>.
      </p>
    </LegalPage>
  );
}
