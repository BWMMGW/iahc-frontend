import { useState } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { api } from '../lib/api';
import Head from 'next/head';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await api<{ message: string }>('/recovery', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage(data.message || 'If an account exists, a reset link will be sent.');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Head>
      <title>
        Recover your account - iahc Network
      </title>
    </Head>
    <div className="max-w-[440px] w-full bg-white rounded-[32px] shadow-[0_20px_35px_-8px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="pt-8 px-8 pb-2 text-center">
        <h1 className="text-3xl font-semibold bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
          Reset password
        </h1>
        <p className="text-text-muted mt-2">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <div className="px-8 pb-8 pt-6">
        {error && (
          <div className="bg-soft-pink text-primary px-4 py-3 rounded-2xl mb-5 border-l-4 border-primary-light">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl mb-5 border-l-4 border-green-500">
            {message}
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
              
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-soft-pink text-text-muted">
          <Link href="/login" className="text-primary-light font-medium hover:underline">
            ← Back to login
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
