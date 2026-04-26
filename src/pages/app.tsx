import Head from "next/head";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "../lib/api";

interface SearchUser {
  id: number;
  username: string;
  firstname: string | null;
  lastname: string | null;
  picture: string | null;
}

const Dashboard: NextPage = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // Debounced search function
  const performSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setError("");
      return;
    }
    setSearching(true);
    setError("");
    try {
      const data = await api<{ users: SearchUser[] }>(
        `/api/search?q=${encodeURIComponent(q)}`
      );
      setResults(data.users || []);
    } catch (err: any) {
      setError(err.message || "Search failed");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  if (!user) {
    return null; // useAuth will redirect
  }

  return (
    <>
      <Head>
        <title>iahc Network - Dashboard</title>
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          Find people on iahc Network
        </h1>

        {/* Search Section */}
        <div className="mb-8">
          <label htmlFor="search" className="block text-sm font-medium text-primary mb-2">
            Search users
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or name..."
              className="w-full px-4 py-3 border-[1.5px] border-soft-gray rounded-2xl text-base bg-bio-bg text-bio-text transition-all duration-200 focus:outline-none focus:border-primary-light focus:ring-[3px] focus:ring-primary-light/10 focus:bg-white"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-primary"
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
            )}
          </div>

          {error && (
            <div className="mt-3 bg-error-bg text-error-text px-4 py-2 rounded-2xl border border-error-border">
              {error}
            </div>
          )}

          {/* Search Results */}
          {searchQuery.length >= 2 && results.length > 0 && (
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-soft-gray divide-y divide-soft-gray">
              {results.map((u) => (
                <Link
                  key={u.id}
                  href={`/profile/${u.username}`}
                  className="flex items-center gap-4 p-4 hover:bg-bio-bg transition-colors no-underline"
                >
                  <div className="w-12 h-12 rounded-full bg-cover-start flex items-center justify-center overflow-hidden flex-shrink-0">
                    {u.picture ? (
                      <img
                        src={u.picture}
                        alt={u.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-text truncate">
                      {[u.firstname, u.lastname].filter(Boolean).join(" ") || u.username}
                    </div>
                    <div className="text-sm text-text-muted">@{u.username}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && !searching && results.length === 0 && (
            <p className="mt-4 text-text-muted text-sm">No users found.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;

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
      if (!data.authenticated) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
      return { props: {} };
    }
  } catch (error) {
    // fail safe to login
  }

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};
