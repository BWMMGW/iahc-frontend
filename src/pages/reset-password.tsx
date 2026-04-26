import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";

  const [email] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const showPasswordMismatch = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      setSuccess(null);
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      setSuccess(null);
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Your password has been reset successfully. You can now sign in.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Invalid or expired code. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Head>
      <title>
        Reset your password - iahc Network
      </title>
    </Head>
    <div className="max-w-[480px] w-full bg-white rounded-[32px] shadow-[0_20px_35px_-8px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="pt-8 px-8 pb-2 text-center max-sm:pt-6 max-sm:px-6 max-sm:pb-1">
        <h1>Check your inbox</h1>
        <p className="mt-2">
          Enter the 6‑digit code we sent to your email
        </p>
        {email && (
          <p className="text-sm mt-1">
            Sent to: <span className="font-medium">{email}</span>
          </p>
        )}
      </div>

      <div className="px-8 pb-8 pt-6 max-sm:px-6">
        {error && (
          <div className="bg-soft-pink text-primary px-4 py-3 rounded-2xl mb-5 border-l-4 border-primary-light">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-success-bg text-success-text px-4 py-3 rounded-2xl mb-5 border-l-4 border-success-text">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="email" value={email} />

          <div className="mb-5">
            <label htmlFor="code">Verification code</label>
            <input
              type="text"
              name="code"
              id="code"
              maxLength={6}
              
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="text-center text-2xl tracking-widest"
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="newPassword">New password</label>
            <input
              type="password"
              name="new_password"
              id="newPassword"
              
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              type="password"
              name="confirm_password"
              id="confirmPassword"
              
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            {showPasswordMismatch && (
              <span className="text-sm text-primary mt-1 block">
                Passwords do not match
              </span>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-soft-pink">
          <Link href="/login" className="inline-flex items-center gap-1">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
