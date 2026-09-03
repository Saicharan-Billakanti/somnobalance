import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Cookie Policy — SomnoBalance" };

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="2 September 2026">
      <h2>What we use</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-mauve/20 text-left">
            <th className="py-2 pr-4">Name / purpose</th>
            <th className="py-2 pr-4">Type</th>
            <th className="py-2">Consent required?</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-mauve/10">
            <td className="py-2 pr-4">Shopping cart (local storage)</td>
            <td className="py-2 pr-4">Essential</td>
            <td className="py-2">No — needed to operate checkout</td>
          </tr>
          <tr className="border-b border-mauve/10">
            <td className="py-2 pr-4">Cookie consent choice (local storage)</td>
            <td className="py-2 pr-4">Essential</td>
            <td className="py-2">No — remembers your choice</td>
          </tr>
          <tr>
            <td className="py-2 pr-4">Spotify embedded player</td>
            <td className="py-2 pr-4">Third-party / functional</td>
            <td className="py-2">Yes — blocked until you accept</td>
          </tr>
        </tbody>
      </table>

      <h2>Your choice</h2>
      <p>
        On your first visit you can choose &quot;Essential only&quot; or &quot;Accept all&quot;.
        Spotify players for our ritual playlists stay hidden until you accept. You can change your
        choice at any time by clearing this site&apos;s local storage in your browser settings.
      </p>

      <h2>Third-party provider</h2>
      <p>
        When accepted, Spotify embeds are loaded directly from Spotify and are subject to
        Spotify&apos;s own cookie and privacy practices, over which we have no control.
      </p>
    </LegalPage>
  );
}
