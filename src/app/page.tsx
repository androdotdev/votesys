import Link from "next/link";
import BallotIllustration from "@/components/BallotIllustration";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16 border-b-2 border-slate-300">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 sm:gap-12">
          {/* Left: Text + CTAs */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-[2rem] sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              PollForge
            </h1>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
              Secure, transparent, and accessible online voting for everyone.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center lg:justify-start">
              <Link
                href="/sign-in"
                className="bg-indigo-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white hover:bg-indigo-700 text-center"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="border-2 border-indigo-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-indigo-600 hover:bg-indigo-50 text-center"
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
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="border-2 border-slate-300 bg-white p-6 sm:p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-indigo-600 bg-indigo-50 text-2xl font-bold text-indigo-600 mb-4">
              1
            </span>
            <h3 className="text-xl font-bold">Browse Elections</h3>
            <p className="mt-2 text-base text-slate-500">
              Explore all active and upcoming elections.
            </p>
          </div>
          <div className="border-2 border-slate-300 bg-white p-6 sm:p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-indigo-600 bg-indigo-50 text-2xl font-bold text-indigo-600 mb-4">
              2
            </span>
            <h3 className="text-xl font-bold">Sign In Securely</h3>
            <p className="mt-2 text-base text-slate-500">
              Create an account or sign in to verify your identity.
            </p>
          </div>
          <div className="border-2 border-slate-300 bg-white p-6 sm:p-8 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 border-2 border-indigo-600 bg-indigo-50 text-2xl font-bold text-indigo-600 mb-4">
              3
            </span>
            <h3 className="text-xl font-bold">Cast Your Vote</h3>
            <p className="mt-2 text-base text-slate-500">
              Select your candidate and submit. Each election allows one vote.
            </p>
          </div>
        </div>
      </section>

      {/* Browse Elections CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14 text-center border-t-2 border-slate-300">
        <h2 className="text-2xl font-bold mb-4">Ready to Vote?</h2>
        <p className="text-lg text-slate-500 mb-8">
          Check out all available elections and cast your ballot.
        </p>
        <Link
          href="/elections"
          className="inline-block bg-indigo-600 px-8 py-4 text-lg font-bold text-white hover:bg-indigo-700"
        >
          Browse Elections
        </Link>
      </section>
    </div>
  );
}
