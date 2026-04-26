import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { api } from '../lib/api';
import Head from 'next/head';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    location: '',
    bio: '',
    birthday: '',
    gender: '',
    picture: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api('/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Head>
      <title>Create your account - iahc Network</title>
    </Head>
    <div className="max-w-[640px] mx-auto bg-white rounded-[32px] shadow-[0_20px_35px_-8px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="pt-8 px-8 pb-2 text-center max-sm:pt-6 max-sm:px-6 max-sm:pb-1">
        <h1 className="text-3xl font-semibold bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
          Join us today
        </h1>
        <p className="text-text-muted mt-2">Create your free account</p>
      </div>

      <div className="px-8 pb-8 pt-6 max-sm:px-6">
        {error && (
          <div className="bg-soft-pink text-primary px-4 py-3 rounded-2xl mb-5 border-l-4 border-primary-light">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4 max-[560px]:grid-cols-1 max-[560px]:gap-0">
            <div className="mb-5">
              <label htmlFor="firstname" className="block text-sm font-medium text-primary mb-1">
                First name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                
                value={formData.firstname}
                onChange={handleChange}

              />
            </div>
            <div className="mb-5">
              <label htmlFor="lastname" className="block text-sm font-medium text-primary mb-1">
                Last name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                
                value={formData.lastname}
                onChange={handleChange}
                
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="username" className="block text-sm font-medium text-primary mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              
              value={formData.username}
              onChange={handleChange}
              
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              
              value={formData.email}
              onChange={handleChange}
              
            />
          </div>

          <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1 max-[560px]:gap-0">
            <div className="mb-5">
              <label htmlFor="birthday" className="block text-sm font-medium text-primary mb-1">
                Birthday
              </label>
              <input
                type="date"
                name="birthday"
                id="birthday"
                value={formData.birthday}
                onChange={handleChange}
                />
            </div>
            <div className="mb-5">
              <label htmlFor="gender" className="block text-sm font-medium text-primary mb-1">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
              
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="location" className="block text-sm font-medium text-primary mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleChange}
              
            />
          </div>

          <div className="mb-5">
            <label htmlFor="bio" className="block text-sm font-medium text-primary mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              placeholder="Tell something about yourself..."
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              
            />
          </div>

          <div className="mb-5">
            <label htmlFor="picture" className="block text-sm font-medium text-primary mb-1">
              Profile Picture URL
            </label>
            <input
              type="url"
              name="picture"
              id="picture"
              placeholder="https://example.com/avatar.jpg"
              value={formData.picture}
              onChange={handleChange}

            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              
              value={formData.password}
              onChange={handleChange}
        
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-soft-pink text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-light font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie || '';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check_session`, {
      headers: { cookie },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        return {
          redirect: {
            destination: '/app',
            permanent: false,
          },
        };
      }
    }
  } catch (error) {
    console.error('Session check failed:', error);
  }

  return { props: {} };
};
