// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";

export default function Header() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ authenticated: boolean; user?: { username: string } }>("/check_session")
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-soft-gray">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand with icon – now matches footer style */}
        <Link
          href={user ? "/app" : "/"}
          className="flex items-center gap-2 font-bold text-lg text-primary no-underline"
        >
          {/* Icon container (same as footer) */}
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center p-2 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <rect width="24" height="24" rx="4" fill="#000" />
              <path
                fill="none"
                stroke="white"
                strokeWidth="1.2"
                d="M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z
                   M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"
              />
            </svg>
          </div>
          iahc Network
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {loading ? (
            <span className="text-sm text-text-muted">...</span>
          ) : user ? (
            <>
              <span className="text-sm text-text-muted hidden sm:inline">
                {user.username}
              </span>
              <Link
                href={`/profile/${user.username}`}
                className="text-sm text-primary-light hover:text-primary font-medium no-underline"
              >
                My Profile
              </Link>
              <Link
                href="/logout"
                className="text-sm text-primary-light hover:text-primary font-medium no-underline"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-primary-light hover:text-primary font-medium no-underline"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition font-medium no-underline"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
