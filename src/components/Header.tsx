"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
        setIsAdmin(data.user?.role === "admin");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <header className="border-b-2 border-gray-400 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-teal-800 no-underline">Voting System</Link>
        {loading ? (
          <div className="w-32" />
        ) : (
          <nav className="flex gap-6 text-base items-center">
            <Link href="/" className="text-gray-700 hover:text-teal-700 no-underline">Elections</Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-teal-700 no-underline">Admin</Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-teal-700 cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/sign-in" className="text-gray-700 hover:text-teal-700 no-underline">Sign In</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
