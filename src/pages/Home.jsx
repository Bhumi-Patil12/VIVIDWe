import { Link } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  UserButton
} from "../auth";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      <nav className="flex justify-between items-center px-10 py-6 border-b">

        <h1 className="text-3xl font-bold text-blue-600">
            VIVIDWe
        </h1>

       <div className="flex items-center gap-4">

  <SignedOut>
    <Link to="/login">
      <button className="h-11 px-5 flex items-center justify-center font-medium rounded-xl hover:bg-gray-100 transition">
        Sign In
      </button>
    </Link>

    <Link to="/choose-role">
      <button className="h-11 px-5 flex items-center justify-center bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition">
        Get Started
      </button>
    </Link>
  </SignedOut>

  <SignedIn>
    <UserButton afterSignOutUrl="/" />
  </SignedIn>

</div>

      </nav>

      <section className="relative overflow-hidden bg-slate-950 text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.3),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.25),_transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-cyan-400" /> AI Verified Platform
          </p>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-white md:text-7xl">
            Where Creators Meet
            <span className="text-cyan-300 block">Opportunity &amp; Growth</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Connect creators, recruiters, and viewers through reels, profiles, and shared opportunities in a modern creative marketplace.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup?role=creator" className="inline-flex rounded-full bg-cyan-400 px-8 py-4 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-300">
              Join as Creator
            </Link>
            <Link to="/signup?role=recruiter" className="inline-flex rounded-full border border-cyan-400 bg-slate-950/90 px-8 py-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:text-white">
              Hire Talent
            </Link>
            <Link to="/signup?role=viewer" className="inline-flex rounded-full border border-slate-700 bg-slate-950/70 px-8 py-4 text-sm font-semibold text-slate-100 transition hover:border-slate-400">
              Browse Creators
            </Link>
          </div>

          <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:justify-center">
            <button onClick={() => document.getElementById("hero-cta")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Ready to join?
            </button>
            <Link to="/reels" className="inline-flex items-center justify-center rounded-full border border-slate-700 px-8 py-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-800">
              Browse Reels
            </Link>
          </div>
        </div>
      </section>
      {/* FEATURES SECTION */}

{/* HOW IT WORKS */}

<section className="px-10 py-24">

  <div className="text-center mb-20">

    <h1 className="text-5xl font-bold">
      How It Works
    </h1>

    <p className="text-gray-500 text-lg mt-5">
      Start building opportunities in a few simple steps.
    </p>

  </div>

  <div className="grid md:grid-cols-3 gap-10">

    {/* STEP 1 */}

    <div className="bg-white border rounded-3xl p-10 text-center hover:shadow-xl transition">

      <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8">
        1
      </div>

      <h2 className="text-3xl font-bold mb-5">
        Create Profile
      </h2>

      <p className="text-gray-500 leading-8">
        Sign up as creator, recruiter, or user and build your profile.
      </p>

    </div>

    {/* STEP 2 */}

    <div className="bg-white border rounded-3xl p-10 text-center hover:shadow-xl transition">

      <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8">
        2
      </div>

      <h2 className="text-3xl font-bold mb-5">
        Upload & Discover
      </h2>

      <p className="text-gray-500 leading-8">
        Upload projects, discover creators, and explore opportunities.
      </p>

    </div>

    {/* STEP 3 */}

    <div className="bg-white border rounded-3xl p-10 text-center hover:shadow-xl transition">

      <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8">
        3
      </div>

      <h2 className="text-3xl font-bold mb-5">
        Connect & Collaborate
      </h2>

      <p className="text-gray-500 leading-8">
        Recruiters and creators connect together for real opportunities.
      </p>

    </div>

  </div>

</section>

{/* STARTER CTA SECTION */}

<section id="hero-cta" className="px-6 py-24 sm:px-10">
  <div className="rounded-[36px] bg-slate-950/95 p-12 text-center shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
    <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Get started</p>
    <h1 className="mt-5 text-5xl font-bold text-white sm:text-6xl">Ready to join the VIVIDWe creator economy?</h1>
    <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
      Create your profile, browse creator reels, or hire talent with AI-verified trust signals.
    </p>
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Link to="/signup?role=creator" className="inline-flex rounded-full bg-cyan-400 px-8 py-4 text-sm font-semibold text-slate-950 hover:bg-cyan-300 transition">
        Join as Creator
      </Link>
      <Link to="/signup?role=recruiter" className="inline-flex rounded-full border border-cyan-400 px-8 py-4 text-sm font-semibold text-cyan-100 hover:bg-slate-800 transition">
        Hire Talent
      </Link>
      <Link to="/reels" className="inline-flex rounded-full border border-slate-700 px-8 py-4 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition">
        Browse Reels
      </Link>
    </div>
  </div>
</section>

{/* FOOTER */}

<footer className="border-t border-slate-800 bg-slate-950 px-6 py-10 text-slate-400 sm:px-10">
  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h1 className="text-3xl font-bold text-cyan-300">VIVIDWe</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        A creative marketplace for reels, profiles, and verified opportunities.
      </p>
    </div>
    <div className="flex flex-wrap gap-6 text-sm text-slate-500">
      <Link to="/" className="hover:text-white transition">Home</Link>
      <a href="#hero-cta" className="hover:text-white transition">Join</a>
      <Link to="/reels" className="hover:text-white transition">Reels</Link>
      <Link to="/choose-role" className="hover:text-white transition">Choose Role</Link>
    </div>
  </div>
  <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
    © 2025 VIVIDWe. All rights reserved.
  </div>
</footer>

    </div>
  );
}