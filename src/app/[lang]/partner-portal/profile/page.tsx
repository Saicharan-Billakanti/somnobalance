import { getAffiliateProfile } from "@/lib/affiliateMockData";
import { ProfileForm } from "@/components/partner-portal/ProfileForm";

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const tx = (en: string, de: string) => (lang === "de" ? de : en);
  const profile = getAffiliateProfile();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">{tx("Profile", "Profil")}</h1>
      <p className="mt-2 text-ink/70">{tx("View and update your affiliate profile.", "Zeigen Sie Ihr Partnerprofil an und aktualisieren Sie es.")}</p>
      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
