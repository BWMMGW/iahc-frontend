import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const performLogout = async () => {
      try {
        await api<{ success: boolean }>('/logout', {
          method: 'POST', // or GET – depends on your backend; adjust if needed
        });
        setStatus('success');
        // Redirect after a brief moment so user sees success feedback
        setTimeout(() => {
          router.replace('/login');
        }, 1000);
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error.message || 'Something went wrong. Please try again.');
      }
    };

    performLogout();
  }, [router]);

  const handleRetry = () => {
    setStatus('loading');
    setErrorMessage('');
    // Re-run the effect by forcing a re-mount or simply calling again
    window.location.reload(); // easiest, but you could also extract the function
  };

  return (
    <div className="max-w-md w-full mx-auto text-center">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-soft-pink">
        {status === 'loading' && (
          <>
            <div className="mb-6">
              <svg
                className="animate-spin h-10 w-10 mx-auto text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              Signing you out...
            </h2>
            <p className="text-text-muted">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6 text-success-text">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              You've been logged out
            </h2>
            <p className="text-text-muted">Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6 text-error-text">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              Logout failed
            </h2>
            <p className="text-text-muted mb-6">{errorMessage}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="!w-auto px-8 py-3"
              >
                Try again
              </button>
              <button
                onClick={() => router.push('/')}
                className="!w-auto !bg-transparent !text-primary border-2 border-primary hover:!bg-primary/5 hover:!text-primary-dark !shadow-none"
              >
                Go home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
