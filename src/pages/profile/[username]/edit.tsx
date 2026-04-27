import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
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
  profile: ProfileData;
}

export default function EditProfilePage({ profile }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: profile.firstname || '',
    lastname: profile.lastname || '',
    location: profile.location || '',
    bio: profile.bio || '',
    birthday: profile.birthday || '',
    gender: profile.gender || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fullName =
    `${formData.firstname} ${formData.lastname}`.trim(); // empty if both empty

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      params.append(key, value);
    });

    try {
      await api(`/profile/${profile.username}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => router.push(`/profile/${profile.username}`), 1500);
    } catch (err: any) {
      setError(err.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for birthday and joined
  const formatDate = (iso: string | null) => {
    if (!iso) return null;
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const birthDateDisplay = formatDate(profile.birthday);
  const joinedDateDisplay = formatDate(profile.created_at);

  return (
    <>
      <Head>
        <title>Edit your profile - iahc Network</title>
      </Head>
      <div className="max-w-[1100px] mx-auto">
        <Link href={`/profile/${profile.username}`} className="inline-block mb-4">
          ← Back to profile
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

            {/* Badge row: location, gender, birthday, joined – now also on edit page */}
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

              {birthDateDisplay && (
                <div className="inline-flex items-center gap-1 text-text-muted text-sm bg-soft-pink/50 px-4 py-1 rounded-full">
                  <span>🎂</span> {birthDateDisplay}
                </div>
              )}

              {joinedDateDisplay && (
                <div className="inline-flex items-center gap-1 text-text-muted text-sm bg-soft-pink/50 px-4 py-1 rounded-full">
                  <span>🗓</span> Joined {joinedDateDisplay}
                </div>
              )}
            </div>

            {success && (
              <div className="mt-6 mb-2 px-6 py-3 rounded-full font-medium bg-success-bg text-success-text border border-success-border">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-6 mb-2 px-6 py-3 rounded-full font-medium bg-error-bg text-error-text border border-error-border">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-soft-pink max-[700px]:grid-cols-1 max-[700px]:gap-6">
                <section>
                  <h3>Edit Personal Info</h3>

                  <div className="mb-5">
                    <label htmlFor="firstname">
                      First name{' '}
                      <span className="text-text-muted font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      maxLength={50}
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="lastname">
                      Last name{' '}
                      <span className="text-text-muted font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      maxLength={50}
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="location">
                      Location{' '}
                      <span className="text-text-muted font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="birthday">
                      Birthday{' '}
                      <span className="text-text-muted font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="gender">
                      Gender{' '}
                      <span className="text-text-muted font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-soft-pink rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </section>

                <section>
                  <h3>About & Contact</h3>

                  <div className="mb-5">
                    <label htmlFor="bio">
                      Bio{' '}
                      <span className="text-text-muted font-normal ml-1">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      maxLength={500}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="mb-5">
                    <label>Email (read-only)</label>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      disabled
                    />
                    <small className="text-text-muted block mt-1">
                      Contact support to change email
                    </small>
                  </div>

                  {joinedDateDisplay && (
                    <div className="mb-5">
                      <label>Joined</label>
                      <input
                        type="text"
                        value={joinedDateDisplay}
                        readOnly
                        disabled
                        className="w-full border border-soft-pink rounded-full px-4 py-2 bg-gray-100"
                      />
                    </div>
                  )}
                </section>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <Link href={`/profile/${profile.username}`}>
                  Cancel
                </Link>
              </div>
            </form>
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

  const authRes = await fetch(`${baseUrl}/check_session`, {
    headers: { cookie },
  });
  const authData = await authRes.json();

  if (!authData.authenticated || authData.user?.username !== username) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const profileRes = await fetch(`${baseUrl}/api/profile/${username}`, {
    headers: { cookie },
  });

  if (!profileRes.ok) {
    return { notFound: true };
  }

  const profile: ProfileData = await profileRes.json();

  return { props: { profile } };
};
