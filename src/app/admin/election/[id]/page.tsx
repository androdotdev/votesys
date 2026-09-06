"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface CandidateResult {
  candidateId: string;
  candidateName: string;
  description?: string | null;
  voteCount: number;
  percentage: number;
}

interface Election {
  id: string;
  title: string;
  status: string;
  startsAt: string;
  endsAt: string;
}

interface Voter {
  userId: string;
  votedAt: string | null;
}

interface Report {
  election: Election;
  candidates: CandidateResult[];
  totalVotes: number;
  generatedAt: string;
}

export default function AdminElectionPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVoters, setShowVoters] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: "", description: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/elections/${id}/report`),
      fetch(`/api/admin/elections/${id}/voters`),
    ])
      .then(async ([reportRes, votersRes]) => {
        const reportData = await reportRes.json();
        const votersData = await votersRes.json();
        setReport(reportData);
        setVoters(votersData.voters || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const addCandidate = async () => {
    if (!newCandidate.name.trim()) return;
    setAddLoading(true);
    try {
      const res = await fetch("/api/admin/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionId: id,
          name: newCandidate.name,
          description: newCandidate.description || null,
        }),
      });
      if (res.ok) {
        setNewCandidate({ name: "", description: "" });
        window.location.reload();
      } else {
        setAddLoading(false);
      }
    } catch {
      setAddLoading(false);
    }
  };

  const removeCandidate = async (candidateId: string) => {
    if (!confirm("Remove this candidate?")) return;
    setRemoveLoading(candidateId);
    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        setRemoveLoading(null);
      }
    } catch {
      setRemoveLoading(null);
    }
  };

  const updateStatus = async (status: string) => {
    setStatusLoading(status);
    try {
      const res = await fetch(`/api/admin/elections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setStatusLoading(null);
      }
    } catch {
      setStatusLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12 text-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12 text-center">
        <p className="text-lg">Election not found</p>
        <Link href="/admin" className="mt-4 inline-block text-lg font-bold text-indigo-600">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{report.election.title}</h1>
          <p className="text-base text-slate-500 mt-1">
            {formatDate(report.election.startsAt)} — {formatDate(report.election.endsAt)}
          </p>
        </div>
        <Link href="/admin" className="text-lg font-bold text-indigo-600">
          Back to dashboard
        </Link>
      </div>

      <div className="border-2 border-slate-300 bg-white p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-lg font-bold">Total Votes:</span>
            <span className="text-3xl font-bold ml-3">{report.totalVotes}</span>
          </div>
          <div className="flex gap-2">
            <span
              className={`inline-block border-2 px-3 py-1 text-sm font-bold uppercase tracking-wide ${
                report.election.status === "open"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : report.election.status === "closed"
                  ? "border-slate-500 bg-slate-100 text-slate-700"
                  : "border-amber-600 bg-amber-50 text-amber-800"
              }`}
            >
              {report.election.status}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {report.election.status === "draft" && (
            <button
              onClick={() => updateStatus("open")}
              disabled={!!statusLoading}
              className="bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {statusLoading==="open" ? "Opening..." : "Open Voting"}
            </button>
          )}
          {report.election.status === "open" && (
            <button
              onClick={() => updateStatus("closed")}
              disabled={!!statusLoading}
              className="bg-slate-700 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {statusLoading==="closed" ? "Closing..." : "Close Voting"}
            </button>
          )}
          <button
            onClick={() => setShowVoters(!showVoters)}
            className="border-2 border-slate-300 px-4 py-3 text-sm font-bold hover:border-indigo-600 hover:text-indigo-600"
          >
            {showVoters ? "Hide Voters" : "View Voters List"} ({voters.length})
          </button>
        </div>
      </div>

      {showVoters && (
        <div className="border-2 border-slate-300 bg-white mb-8">
          <div className="border-b-2 border-slate-300 bg-slate-50 px-6 py-4">
            <h2 className="text-xl font-bold">Voters List ({voters.length})</h2>
          </div>
          {voters.length === 0 ? (
            <p className="p-6 text-base text-slate-500">No votes cast yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-base font-bold text-slate-700">#</th>
                    <th className="px-6 py-3 text-base font-bold text-slate-700">User ID</th>
                    <th className="px-6 py-3 text-base font-bold text-slate-700">Voted At</th>
                  </tr>
                </thead>
                <tbody>
                  {voters.map((v, i) => (
                    <tr key={v.userId} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-6 py-3 text-base">{i + 1}</td>
                      <td className="px-6 py-3 text-sm font-mono">{v.userId}</td>
                      <td className="px-6 py-3 text-base">
                        {v.votedAt ? new Date(v.votedAt).toLocaleString("en-IN") : "Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="border-2 border-slate-300 bg-white p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Candidates ({report.candidates.length})</h2>
        <div className="space-y-4">
          {report.candidates.map((c) => (
            <div
              key={c.candidateId}
              className="border-2 border-slate-300 p-4 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <span className="text-lg font-bold">{c.candidateName}</span>
                {c.description && (
                  <p className="text-sm text-slate-500 mt-1">{c.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-bold">{c.voteCount}</span>
                  <span className="text-sm text-slate-500 ml-1">votes</span>
                  <p className="text-sm text-slate-500">
                    ({c.percentage.toFixed(1)}%)
                  </p>
                </div>
                <button
                  onClick={() => removeCandidate(c.candidateId)}
                  disabled={removeLoading===c.candidateId}
                  className="border-2 border-red-300 px-3 py-3 text-sm font-bold text-red-700 hover:bg-red-50 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {removeLoading===c.candidateId ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t-2 border-slate-300">
          <h3 className="text-lg font-bold mb-3">Add Candidate</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Name"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              className="border-2 border-slate-300 px-4 py-3 text-base flex-1 focus:border-indigo-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newCandidate.description}
              onChange={(e) => setNewCandidate({ ...newCandidate, description: e.target.value })}
              className="border-2 border-slate-300 px-4 py-3 text-base flex-1 focus:border-indigo-600 focus:outline-none"
            />
            <button
              onClick={addCandidate}
              disabled={!newCandidate.name.trim() || addLoading}
              className="bg-indigo-600 px-6 py-3 text-base font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>

      <div className="border-2 border-slate-300 bg-white p-6">
        <h2 className="text-xl font-bold mb-3">Report Summary</h2>
        <p className="text-sm text-slate-500">
          Generated at: {new Date(report.generatedAt).toLocaleString("en-IN")}
        </p>
        <p className="text-base mt-2">
          <span className="font-bold">{report.totalVotes}</span> total votes across{" "}
          <span className="font-bold">{report.candidates.length}</span> candidates.
        </p>
      </div>
    </div>
  );
}
