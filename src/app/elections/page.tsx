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
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">All Elections</h1>

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
              className="block border-2 border-gray-400 bg-white p-6 hover:border-teal-600 transition-colors"
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
                Opens:{" "}
                {new Date(election.startsAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-base text-gray-500">
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
