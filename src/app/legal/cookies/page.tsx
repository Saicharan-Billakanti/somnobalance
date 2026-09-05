import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Cookie Policy — SomnoBalance" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="4 September 2026">
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
        <a href="/legal/privacy">Privacy Policy</a>.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about this Cookie Policy can be directed to us using the contact details in our{" "}
        <a href="/legal/impressum">Impressum</a>.
      </p>
    </LegalPage>
  );
}
