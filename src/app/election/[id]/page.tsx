"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Candidate {
  id: string;
  name: string;
  description: string | null;
}

interface Election {
  id: string;
  title: string;
  status: string;
  startsAt: string;
  endsAt: string;
  candidates: Candidate[];
}

export default function ElectionPage() {
  const params = useParams();
  const id = params.id as string;

  const [election, setElection] = useState<Election | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/elections/${id}`).then((res) => res.json()),
      fetch(`/api/votes/me/${id}`).then((res) => res.json()),
    ])
      .then(([electionData, voteStatus]) => {
        setElection(electionData);
        setHasVoted(voteStatus.hasVoted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    setVoting(true);
    setError(null);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionId: id, candidateId: selectedCandidate }),
      });

      if (res.status === 401) {
        setError("Please sign in to cast your vote");
      } else if (res.status === 409) {
        setError("You have already voted in this election");
        setHasVoted(true);
      } else if (res.status === 400) {
        setError("Invalid selection. Please choose a candidate and try again");
      } else if (res.status === 404) {
        setError("This election is no longer available");
      } else if (res.ok) {
        setSuccess(true);
        setHasVoted(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again later");
      }
    } catch {
      setError("Unable to connect. Please check your internet and try again");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="text-lg">Loading election...</p>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="text-lg">Election not found</p>
        <Link href="/" className="mt-4 inline-block text-lg font-bold text-teal-700">
          Back to elections
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

  if (election.status === "closed") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="border-2 border-gray-400 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold">{election.title}</h1>
          <span className="mt-3 inline-block border-2 border-gray-500 bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700 uppercase tracking-wide">
            Voting Closed
          </span>
          <p className="mt-4 text-lg text-gray-500">This election has ended.</p>
          <Link
            href={`/results/${election.id}`}
            className="mt-6 inline-block bg-teal-700 px-6 py-3 text-lg font-bold text-white hover:bg-teal-800 no-underline"
          >
            View Results
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="border-2 border-emerald-600 bg-emerald-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-800">Your vote has been recorded</h1>
          <p className="mt-3 text-lg text-emerald-700">Thank you for participating in {election.title}.</p>
          <div className="mt-6 flex gap-6 justify-center">
            <Link href="/" className="text-lg font-bold text-teal-700">Back to elections</Link>
            <Link href={`/results/${election.id}`} className="text-lg font-bold text-teal-700">View results</Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="border-2 border-gray-400 bg-gray-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-700">You have already voted</h1>
          <p className="mt-3 text-lg text-gray-600">Your vote in {election.title} has been recorded. Results are anonymous.</p>
          <div className="mt-6 flex gap-6 justify-center">
            <Link href="/" className="text-lg font-bold text-teal-700">Back to elections</Link>
            <Link href={`/results/${election.id}`} className="text-lg font-bold text-teal-700">View results</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">{election.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-base text-gray-600">
        <span>Opens: {formatDate(election.startsAt)}</span>
        <span>Closes: {formatDate(election.endsAt)}</span>
        <span className="inline-block border-2 border-emerald-600 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800 uppercase tracking-wide">
          {election.status}
        </span>
      </div>

      <h2 className="mt-10 text-xl font-bold">Choose a Candidate</h2>
      <div className="mt-6 grid gap-4">
        {election.candidates.map((candidate) => (
          <label
            key={candidate.id}
            className={`flex cursor-pointer items-start gap-5 border-2 p-6 transition-colors ${
              selectedCandidate === candidate.id
                ? "border-teal-600 bg-teal-50"
                : "border-gray-400 bg-white hover:border-teal-500"
            }`}
          >
            <input
              type="radio"
              name="candidate"
              value={candidate.id}
              checked={selectedCandidate === candidate.id}
              onChange={() => setSelectedCandidate(candidate.id)}
              className="mt-1 w-5 h-5 accent-teal-700"
            />
            <div>
              <span className="text-lg font-bold text-gray-800">{candidate.name}</span>
              {candidate.description && (
                <p className="mt-1 text-base text-gray-500">{candidate.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-base font-bold text-red-700">{error}</p>
      )}

      <button
        onClick={handleVote}
        disabled={!selectedCandidate || voting}
        className="mt-6 w-full bg-teal-700 px-6 py-4 text-lg font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {voting ? "Casting vote..." : "Confirm Your Vote"}
      </button>
    </div>
  );
}
