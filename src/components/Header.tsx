"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createAuthClient } from "better-auth/react";
import { FiList, FiShield, FiLogIn, FiLogOut, FiKey } from "react-icons/fi";
import PasswordDropdown from "./PasswordDropdown";

const authClient = createAuthClient();

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [showPasswordDropdown, setShowPasswordDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setIsAuthenticated(data.authenticated);
          setIsAdmin(data.user?.role === "admin");
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [pathname]);

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
    setSignOutLoading(true);
    await authClient.signOut();
    setSignOutLoading(false);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setShowPasswordDropdown(false);
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
            <Link href="/elections" className="flex items-center gap-2 text-gray-700 hover:text-teal-700">
              <FiList className="w-5 h-5" />
              <span>Elections</span>
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2 text-gray-700 hover:text-teal-700">
                <FiShield className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex gap-6 items-center" ref={dropdownRef}>
                <button
                  onClick={() => setShowPasswordDropdown(!showPasswordDropdown)}
                  className="flex items-center gap-2 text-gray-700 hover:text-teal-700 cursor-pointer"
                >
                  <FiKey className="w-5 h-5" />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={signOutLoading}
                  className="flex items-center gap-2 text-gray-700 hover:text-teal-700 cursor-pointer disabled:opacity-50"
                >
                  {signOutLoading ? (
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <FiLogOut className="w-5 h-5" />
                  )}
                  <span>{signOutLoading ? "Signing out" : "Sign Out"}</span>
                </button>
                {showPasswordDropdown && <PasswordDropdown onClose={() => setShowPasswordDropdown(false)} />}
              </div>
            ) : (
              <Link href="/sign-in" className="flex items-center gap-2 text-gray-700 hover:text-teal-700">
                <FiLogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
