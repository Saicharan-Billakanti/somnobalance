import { getAffiliateProfile } from "@/lib/affiliateMockData";
import { ProfileForm } from "@/components/partner-portal/ProfileForm";

export default function ProfilePage() {
  const profile = getAffiliateProfile();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Profile</h1>
      <p className="mt-2 text-ink/70">View and update your affiliate profile.</p>
      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
