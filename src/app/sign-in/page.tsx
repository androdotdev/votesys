"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        if (error.message?.includes("invalid")) {
          setError("Incorrect email or password. Please try again");
        } else if (error.message?.includes("not found")) {
          setError("No account found with this email. Please sign up first");
        } else {
          setError(error.message ?? "Unable to sign in. Please try again");
        }
        setLoading(false);
      } else {
        const res = await fetch("/api/session");
        const session = await res.json();
        router.push(session.user?.role === "admin" ? "/admin" : "/");
        router.refresh();
      }
    } catch {
      setError("Unable to connect. Please check your internet and try again");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-10 sm:py-16">
      <div className="border-2 border-slate-300 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center text-slate-800">Sign In</h1>

        {error && (
          <p className="mt-4 text-base font-bold text-red-700 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-base font-bold text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full border-2 border-slate-300 px-4 py-4 text-base focus:border-indigo-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-bold text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full border-2 border-slate-300 px-4 py-4 text-base focus:border-indigo-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 px-6 py-4 text-lg font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-base text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-bold text-indigo-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
