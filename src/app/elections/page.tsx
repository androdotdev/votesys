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

export default function ElectionsPage() {
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">All Polls</h1>
      <p className="mt-2 mb-6 sm:mb-8 text-sm text-slate-500">Internal polls for your community — not political elections. No government affiliation.</p>

      {loading ? (
        <p className="text-lg text-slate-500 text-center py-12">Loading polls...</p>
      ) : elections.length === 0 ? (
        <p className="text-lg text-slate-500 text-center py-12">No polls available at this time.</p>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {elections.map((election) => (
            <Link
              key={election.id}
              href={`/election/${election.id}`}
              className="block border-2 border-slate-300 bg-white p-6 hover:border-indigo-600 transition-colors"
            >
              <h3 className="text-xl font-bold text-slate-800">{election.title}</h3>
              <div className="mt-3">
                <span
                  className={`inline-block border-2 px-3 py-1 text-sm font-bold uppercase tracking-wide ${
                    election.status === "open"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : election.status === "closed"
                      ? "border-slate-500 bg-slate-100 text-slate-700"
                      : "border-amber-600 bg-amber-50 text-amber-800"
                  }`}
                >
                  {election.status}
                </span>
              </div>
              <p className="mt-4 text-base text-slate-500">
                Opens:{" "}
                {new Date(election.startsAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-base text-slate-500">
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
    </div>
  );
}
