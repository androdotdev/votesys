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

interface ElectionWithVotes extends Election {
  totalVotes: number;
}

export default function AdminDashboard() {
  const [elections, setElections] = useState<ElectionWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/elections").then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Access denied. Admin access required.");
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Failed to load elections");
        }
        return data;
      }),
    ])
      .then(async ([electionsData]) => {
        const withVotes = await Promise.all(
          electionsData.map(async (e: Election) => {
            const reportRes = await fetch(`/api/admin/elections/${e.id}/report`);
            const report = reportRes.ok ? await reportRes.json() : { totalVotes: 0 };
            return { ...e, totalVotes: report.totalVotes ?? 0 };
          })
        );
        setElections(withVotes);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/elections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setElections((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    }
  };

  const deleteElection = async (id: string) => {
    if (!confirm("Delete this election? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/elections/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setElections((prev) => prev.filter((e) => e.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <p className="text-lg text-red-700 font-bold">{error}</p>
        <Link href="/" className="mt-4 inline-block text-lg font-bold text-teal-700">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/" className="text-lg font-bold text-teal-700">
          Back to site
        </Link>
      </div>

      {elections.length === 0 ? (
        <div className="border-2 border-gray-400 bg-white p-8 text-center">
          <p className="text-lg text-gray-600">No elections yet</p>
        </div>
      ) : (
        <div className="border-2 border-gray-400 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b-2 border-gray-400 bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-4 text-base font-bold text-gray-700">Election</th>
                  <th className="px-3 sm:px-6 py-4 text-base font-bold text-gray-700">Status</th>
                  <th className="px-3 sm:px-6 py-4 text-base font-bold text-gray-700">Votes</th>
                  <th className="px-3 sm:px-6 py-4 text-base font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.map((election) => (
                  <tr key={election.id} className="border-b border-gray-200 last:border-b-0">
                    <td className="px-3 sm:px-6 py-4">
                      <Link
                        href={`/admin/election/${election.id}`}
                        className="text-base font-bold text-gray-800 hover:text-teal-700 break-words"
                      >
                        {election.title}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Closes: {new Date(election.endsAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
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
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className="text-lg font-bold">{election.totalVotes}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {election.status === "draft" && (
                          <button
                            onClick={() => updateStatus(election.id, "open")}
                            className="bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800"
                          >
                            Open
                          </button>
                        )}
                        {election.status === "open" && (
                          <button
                            onClick={() => updateStatus(election.id, "closed")}
                            className="bg-gray-700 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800"
                          >
                            Close
                          </button>
                        )}
                        <Link
                          href={`/admin/election/${election.id}`}
                          className="border-2 border-gray-400 px-4 py-3 text-sm font-bold text-center hover:border-teal-600 hover:text-teal-700"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => deleteElection(election.id)}
                          className="border-2 border-red-300 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 hover:border-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 border-2 border-gray-400 bg-white p-6">
        <h2 className="text-xl font-bold mb-4">Create New Election</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const body = {
              title: form.get("title"),
              startsAt: form.get("startsAt"),
              endsAt: form.get("endsAt"),
            };

            const res = await fetch("/api/admin/elections", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });

            if (res.ok) {
              window.location.reload();
            }
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="title" className="block text-base font-bold text-gray-700">
              Election Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-2 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startsAt" className="block text-base font-bold text-gray-700">
                Start Date
              </label>
              <input
                id="startsAt"
                name="startsAt"
                type="date"
                required
                className="mt-2 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="endsAt" className="block text-base font-bold text-gray-700">
                End Date
              </label>
              <input
                id="endsAt"
                name="endsAt"
                type="date"
                required
                className="mt-2 w-full border-2 border-gray-400 px-4 py-3 text-base focus:border-teal-600 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-teal-700 px-6 py-3 text-base font-bold text-white hover:bg-teal-800"
          >
            Create Election
          </button>
        </form>
      </div>
    </div>
  );
}
