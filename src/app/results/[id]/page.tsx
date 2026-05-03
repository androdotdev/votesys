"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface CandidateResult {
  candidateId: string;
  candidateName: string;
  voteCount: number;
  percentage: number;
}

interface ResultsData {
  candidates: CandidateResult[];
  totalVotes: number;
}

interface Election {
  id: string;
  status: string;
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  const [results, setResults] = useState<ResultsData | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const [resultsRes, electionRes] = await Promise.all([
        fetch(`/api/elections/${id}/results`),
        fetch(`/api/elections/${id}`),
      ]);
      const resultsData = await resultsRes.json();
      const electionData = await electionRes.json();
      setResults(resultsData);
      setElection(electionData);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    if (election?.status === "open") {
      const interval = setInterval(fetchResults, 10000);
      return () => clearInterval(interval);
    }
  }, [election?.status, fetchResults]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="text-lg">Loading results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="text-lg">Results not found</p>
        <Link href="/" className="mt-4 inline-block text-lg font-bold text-teal-700">
          Back to elections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Results</h1>
        {election?.status === "open" && (
          <span className="inline-block border-2 border-blue-600 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800 uppercase tracking-wide">
            Live Results
          </span>
        )}
      </div>

      <p className="text-lg mb-6">
        Total votes cast: <span className="font-bold">{results.totalVotes}</span>
      </p>

      <div className="space-y-6">
        {results.candidates.map((candidate) => (
          <div key={candidate.candidateId} className="border-2 border-gray-400 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <span className="text-lg font-bold text-gray-800">{candidate.candidateName}</span>
              <span className="text-base font-bold text-gray-600">
                {candidate.voteCount} votes ({candidate.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-4 w-full border border-gray-400 bg-gray-100">
              <div
                className="h-full bg-teal-700"
                style={{ width: `${candidate.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link href="/" className="mt-8 inline-block text-lg font-bold text-teal-700">
        Back to elections
      </Link>
    </div>
  );
}
