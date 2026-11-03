
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type ResetPasswordFormProps = {
  token: string;
};

export default function ResetPasswordForm({
  token,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("This password reset link is invalid or incomplete.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("Your password is too long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to reset your password.");
        return;
      }

      window.location.assign("/login?passwordReset=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p role="alert" className="text-sm text-red-700">
          This password reset link is invalid or incomplete.
        </p>

        <Link
          href="/forgot-password"
          className="inline-block font-semibold text-blue-900 hover:text-blue-800"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Reset your password
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Choose a new password for your SAMB account.
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          New password
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your new password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm text-slate-600 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-3 text-sm font-medium text-blue-900"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          Use at least 8 characters.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Confirm new password
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Enter your new password again"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword((current) => !current)}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            aria-pressed={showConfirmPassword}
            className="absolute inset-y-0 right-3 text-sm font-medium text-blue-900"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-900 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Resetting password..." : "Reset password"}
      </button>

      <p className="text-center text-sm text-gray-600">
        <Link
          href="/login"
          className="font-semibold text-blue-900 hover:text-blue-800"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}
