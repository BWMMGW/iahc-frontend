import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface ProfileData {
  firstname: string | null;
  lastname: string | null;
  username: string;
  location: string | null;
  bio: string | null;
  email: string;
  birthday: string | null;   // ISO 8601
  gender: string | null;
  created_at: string;        // ISO 8601
}

interface Props {
  profile?: ProfileData;
  isOwnProfile: boolean;
  error?: string;
}

export default function ProfileViewPage({ profile, isOwnProfile, error }: Props) {
  const router = useRouter();

  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto py-12 text-center">
        <p className="text-red-500">{error}</p>
        <Link href="/app" className="mt-4 inline-block">
          ← Back to home
        </Link>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const fullName =
    `${profile.firstname || ''} ${profile.lastname || ''}`.trim(); // no fallback

  const formatDate = (iso: string | null) => {
    if (!iso) return null;
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const birthDate = profile.birthday ? formatDate(profile.birthday) : null;
  const joinedDate = profile.created_at ? formatDate(profile.created_at) : null;

  return (
    <>
      <Head>
        {isOwnProfile ? (
          <title>your profile - iahc Network</title>
        ) : (
          <title>@{profile.username}'s Profile</title>
        )}
      </Head>
      <div className="max-w-[1100px] mx-auto">
        <Link href="/app" className="inline-block mb-4">
          ← Back
        </Link>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_35px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="h-[140px] bg-gradient-to-r from-cover-start to-cover-end" />
          <div className="px-8 pb-8 pt-0 relative max-sm:px-6">
            <div className="-mt-[60px] mb-4">
              <div className="w-[120px] h-[120px] bg-cover-start rounded-full border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-5xl text-primary max-sm:w-[90px] max-sm:h-[90px] max-sm:text-4xl">
                👤
              </div>
            </div>

            {/* Only show the name heading if fullName is not empty */}
            {fullName && (
              <h1 className="text-3xl font-bold text-primary max-sm:text-2xl">
                {fullName}
              </h1>
            )}

            <div className="text-primary-light text-base font-medium mt-1">
              @{profile.username}
            </div>

            {/* Badge row: location, gender, birthday, joined */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {profile.location && (
                <div className="inline-flex items-center gap-1 text-text-muted text-sm bg-soft-pink/50 px-4 py-1 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {profile.location}
                </div>
              )}

              {profile.gender && (
                <div className="inline-flex items-center text-text-muted text-sm bg-soft-pink/50 px-4 py-1 rounded-full">
                  <span></span> {profile.gender}
                </div>
              )}

              {birthDate && (
                <div className="inline-flex items-center gap-1 text-text-muted text-sm bg-soft-pink/50 px-4 py-1 rounded-full">
                  <span>🎂</span> {birthDate}
                </div>
              )}

              {joinedDate && (
                <div className="inline-flex items-center gap-1 text-text-muted text-sm bg-soft-pink/50 px-4 py-1 rounded-full">
                  <span>🗓</span> Joined {joinedDate}
                </div>
              )}
            </div>

            {isOwnProfile && (
              <div className="mt-4">
                <Link
                  href={`/profile/${profile.username}/edit`}
                  className="inline-block px-6 py-2 bg-primary-light text-white rounded-full font-medium hover:bg-primary transition"
                >
                  Edit Profile
                </Link>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-soft-pink max-[700px]:grid-cols-1 max-[700px]:gap-6">
              <section>
                <h3>About me</h3>
                <div className="bg-bio-bg p-5 rounded-3xl leading-relaxed text-bio-text break-words">
                  {profile.bio || 'No bio yet.'}
                </div>
              </section>

              <section>
                <h3>Contact</h3>
                <div className="bg-bio-bg p-5 rounded-3xl leading-relaxed text-bio-text">
                  <strong className="text-primary mr-2">Email:</strong>
                  {profile.email}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { username } = context.params as { username: string };
  const cookie = context.req.headers.cookie || '';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  try {
    const profileRes = await fetch(`${baseUrl}/api/profile/${username}`, {
      headers: { cookie },
      credentials: 'include',
    });

    if (!profileRes.ok) {
      if (profileRes.status === 404) return { notFound: true };
      throw new Error('Failed to load profile');
    }

    const profile: ProfileData = await profileRes.json();

    const authRes = await fetch(`${baseUrl}/check_session`, {
      headers: { cookie },
    });
    const authData = await authRes.json();
    const isOwnProfile =
      authData.authenticated && authData.user?.username === username;

    return { props: { profile, isOwnProfile } };
  } catch (err: any) {
    return { props: { error: err.message || 'Unable to load profile' } };
  }
};
