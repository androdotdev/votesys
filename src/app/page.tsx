"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Election {
  id: string;
  title: string;
  status: string;
  startsAt: string;
  endsAt: string;
}

export default function Home() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/elections")
      .then((res) => res.json())
      .then((data) => {
        setElections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center border-b-2 border-gray-400">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800">
          VoteSys
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Secure, transparent, and accessible online voting for everyone.
        </p>
        <div className="mt-8 flex gap-6 justify-center">
          <Link
            href="/sign-in"
            className="bg-teal-700 px-8 py-3 text-lg font-bold text-white hover:bg-teal-800 no-underline"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="border-2 border-teal-700 px-8 py-3 text-lg font-bold text-teal-700 hover:bg-teal-50 no-underline"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="border-2 border-gray-400 bg-white p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-teal-700 bg-teal-50 text-2xl font-bold text-teal-700 mb-4">
              1
            </span>
            <h3 className="text-xl font-bold">Browse Elections</h3>
            <p className="mt-2 text-base text-gray-500">
              View all active and upcoming elections listed below.
            </p>
          </div>
          <div className="border-2 border-gray-400 bg-white p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-teal-700 bg-teal-50 text-2xl font-bold text-teal-700 mb-4">
              2
            </span>
            <h3 className="text-xl font-bold">Sign In Securely</h3>
            <p className="mt-2 text-base text-gray-500">
              Create an account or sign in to verify your identity.
            </p>
          </div>
          <div className="border-2 border-gray-400 bg-white p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-teal-700 bg-teal-50 text-2xl font-bold text-teal-700 mb-4">
              3
            </span>
            <h3 className="text-xl font-bold">Cast Your Vote</h3>
            <p className="mt-2 text-base text-gray-500">
              Select your candidate and submit. Each election allows one vote.
            </p>
          </div>
        </div>
      </section>

      {/* Election List */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        <h2 className="text-2xl font-bold mb-8">Current Elections</h2>

        {loading ? (
          <p className="text-lg text-gray-500 text-center py-12">Loading elections...</p>
        ) : elections.length === 0 ? (
          <p className="text-lg text-gray-500 text-center py-12">No elections available at this time.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {elections.map((election) => (
              <Link
                key={election.id}
                href={`/election/${election.id}`}
                className="block border-2 border-gray-400 bg-white p-6 no-underline hover:border-teal-600 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-800">{election.title}</h3>
                <div className="mt-3">
                  <span
                    className={`inline-block border-2 px-3 py-1 text-sm font-bold uppercase tracking-wide ${
                      election.status === "open"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : election.status === "closed"
                        ? "border-gray-500 bg-gray-100 text-gray-700"
                        : "border-amber-600 bg-amber-50 text-amber-800"
                    }`}
                  >
                    {election.status}
                  </span>
                </div>
                <p className="mt-4 text-base text-gray-500">
                  Closes:{" "}
                  {new Date(election.endsAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
