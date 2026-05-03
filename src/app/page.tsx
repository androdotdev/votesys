import Link from "next/link";
import BallotIllustration from "@/components/BallotIllustration";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-b-2 border-gray-400">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Left: Text + CTAs */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-800">
              VoteSys
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Secure, transparent, and accessible online voting for everyone.
            </p>
            <div className="mt-8 flex gap-6 justify-center lg:justify-start">
              <Link
                href="/sign-in"
                className="bg-teal-700 px-8 py-4 text-lg font-bold text-white hover:bg-teal-800"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="border-2 border-teal-700 px-8 py-4 text-lg font-bold text-teal-700 hover:bg-teal-50"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="w-48 h-48 lg:w-80 lg:h-80 flex-shrink-0">
            <BallotIllustration />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="border-2 border-gray-400 bg-white p-6 sm:p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-teal-700 bg-teal-50 text-2xl font-bold text-teal-700 mb-4">
              1
            </span>
            <h3 className="text-xl font-bold">Browse Elections</h3>
            <p className="mt-2 text-base text-gray-500">
              Explore all active and upcoming elections.
            </p>
          </div>
          <div className="border-2 border-gray-400 bg-white p-6 sm:p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-teal-700 bg-teal-50 text-2xl font-bold text-teal-700 mb-4">
              2
            </span>
            <h3 className="text-xl font-bold">Sign In Securely</h3>
            <p className="mt-2 text-base text-gray-500">
              Create an account or sign in to verify your identity.
            </p>
          </div>
          <div className="border-2 border-gray-400 bg-white p-6 sm:p-8 text-center">
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

      {/* Browse Elections CTA */}
      <section className="mx-auto max-w-4xl px-6 py-14 text-center border-t-2 border-gray-400">
        <h2 className="text-2xl font-bold mb-4">Ready to Vote?</h2>
        <p className="text-lg text-gray-500 mb-8">
          Check out all available elections and cast your ballot.
        </p>
        <Link
          href="/elections"
          className="inline-block bg-teal-700 px-8 py-4 text-lg font-bold text-white hover:bg-teal-800"
        >
          Browse Elections
        </Link>
      </section>
    </div>
  );
}
