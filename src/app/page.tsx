"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/sign-in");
          return;
        }
        setAuthenticated(true);
        return fetch("/api/elections");
      })
      .then((res) => {
        if (!res) return;
        return res.json();
      })
      .then((data) => {
        if (data) setElections(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <p className="text-lg">Loading elections...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  if (elections.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">No active elections</h1>
        <p className="mt-3 text-lg text-gray-500">Check back later for upcoming elections.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Active Elections</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {elections.map((election) => (
          <Link
            key={election.id}
            href={`/election/${election.id}`}
            className="block border-2 border-gray-400 bg-white p-6 no-underline hover:border-teal-600 transition-colors"
          >
            <h2 className="text-xl font-bold text-gray-800">{election.title}</h2>
            <div className="mt-3">
              <span className="inline-block border-2 border-emerald-600 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800 uppercase tracking-wide">
                {election.status}
              </span>
            </div>
            <p className="mt-4 text-base text-gray-500">
              Closes: {new Date(election.endsAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
