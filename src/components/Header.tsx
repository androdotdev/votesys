"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createAuthClient } from "better-auth/react";
import { FiList, FiShield, FiLogIn, FiLogOut, FiKey } from "react-icons/fi";
import PasswordDropdown from "./PasswordDropdown";

const authClient = createAuthClient();

export default function Header({ initialAuthenticated = false, initialIsAdmin = false }: { initialAuthenticated?: boolean; initialIsAdmin?: boolean }) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [loading, setLoading] = useState(false);
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

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-slate-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-700 shrink-0">PollForge</Link>
        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-slate-300 text-slate-700 hover:border-indigo-600 hover:text-indigo-600"
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        {loading ? (
          <div className="hidden sm:block w-32 h-6 animate-pulse bg-slate-100" />
        ) : (
          <nav className={`sm:flex flex-wrap items-center gap-4 sm:gap-6 text-base ${mobileOpen ? "flex flex-col absolute left-0 top-full w-full bg-white border-b-2 border-slate-300 px-4 py-4 sm:static sm:w-auto sm:border-0 sm:p-0 sm:flex-row" : "hidden sm:flex"}`}>
            <Link href="/elections" onClick={()=>setMobileOpen(false)} className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 py-2 sm:py-0">
              <FiList className="w-5 h-5" />
              <span>Elections</span>
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={()=>setMobileOpen(false)} className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 py-2 sm:py-0">
                <FiShield className="w-5 h-5" />
                <span>Admin</span>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex flex-wrap gap-4 sm:gap-6 items-center" ref={dropdownRef}>
                <button
                  onClick={() => setShowPasswordDropdown(!showPasswordDropdown)}
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 cursor-pointer"
                >
                  <FiKey className="w-5 h-5" />
                  <span>Password</span>
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={signOutLoading}
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 cursor-pointer disabled:opacity-50"
                >
                  {signOutLoading ? (
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <FiLogOut className="w-5 h-5" />
                  )}
                  <span>{signOutLoading ? "Signing out" : "Sign Out"}</span>
                </button>
                {showPasswordDropdown && <PasswordDropdown onClose={() => setShowPasswordDropdown(false)} />}
              </div>
            ) : (
              <Link href="/sign-in" onClick={()=>setMobileOpen(false)} className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 py-2 sm:py-0">
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
