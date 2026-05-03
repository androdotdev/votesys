"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createAuthClient } from "better-auth/react";
import PasswordDropdown from "./PasswordDropdown";

const authClient = createAuthClient();

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordDropdown, setShowPasswordDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!showPasswordDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPasswordDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPasswordDropdown]);

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <header className="border-b-2 border-gray-400 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-teal-800">Voting System</Link>
        {loading ? (
          <div className="w-32" />
        ) : (
          <nav className="flex gap-6 text-base items-center relative">
            <Link href="/" className="text-gray-700 hover:text-teal-700">Elections</Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-teal-700">Admin</Link>
            )}
            {isAuthenticated ? (
              <div className="flex gap-6 items-center" ref={dropdownRef}>
                <button
                  onClick={() => setShowPasswordDropdown(!showPasswordDropdown)}
                  className="text-gray-700 hover:text-teal-700 cursor-pointer"
                >
                  Change Password
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-teal-700 cursor-pointer"
                >
                  Sign Out
                </button>
                {showPasswordDropdown && <PasswordDropdown onClose={() => setShowPasswordDropdown(false)} />}
              </div>
            ) : (
              <Link href="/sign-in" className="text-gray-700 hover:text-teal-700">Sign In</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
