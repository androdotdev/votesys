"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function SignUpPage() {
  const [name, setName] = useState("");
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
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        if (error.message?.includes("already") || error.message?.includes("exists")) {
          setError("An account with this email already exists. Please sign in instead");
        } else if (error.message?.includes("password")) {
          setError("Password must be at least 8 characters long");
        } else {
          setError(error.message ?? "Unable to create account. Please try again");
        }
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Unable to connect. Please check your internet and try again");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="border-2 border-gray-400 bg-white p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create Account</h1>

        {error && (
          <p className="mt-4 text-base font-bold text-red-700 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-base font-bold text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-base font-bold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-base font-bold text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 px-6 py-4 text-lg font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-base text-gray-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-bold text-teal-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
