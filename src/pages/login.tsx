import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { api } from '../lib/api';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      router.push('/app');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Head>
      <title>
        Sign in to your account - iahc Network
      </title>
    </Head>
   <div className="flex items-center justify-center min-h-full p-6">
    <div className="max-w-[440px] w-full bg-white rounded-[32px] shadow-[0_20px_35px_-8px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="pt-8 px-8 pb-2 text-center max-sm:pt-6 max-sm:px-6 max-sm:pb-1">
        <h1 className="text-3xl font-semibold bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-text-muted mt-2">Sign in to continue</p>
      </div>

      <div className="px-8 pb-8 pt-6 max-sm:px-6">
        {error && (
          <div className="bg-soft-pink text-primary px-4 py-3 rounded-2xl mb-5 border-l-4 border-primary-light">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-soft-pink text-text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary-light font-medium hover:underline">
            Create account
          </Link>
        </div>

        <div className="text-center mt-6 text-text-muted">
          <Link href="/recovery" className="text-primary-light font-medium hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div></div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookie = req.headers.cookie || '';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check_session`, {
      headers: { cookie },
      credentials: 'include',
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
