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

      <section className="text-center py-24 px-6">

        <p className="bg-blue-100 text-blue-600 inline-block px-4 py-2 rounded-full mb-6">
          AI Verified Platform
        </p>

        <h1 className="text-6xl font-bold leading-tight">

          Where Creators Meet

          <span className="text-blue-600 block">
            Opportunities
          </span>

        </h1>

        <p className="text-gray-500 mt-8 text-xl max-w-2xl mx-auto">

          Connect Creators, Recruiters and Viewers
          in one powerful ecosystem.

        </p>

       <div className="flex justify-center gap-4 mt-10 flex-wrap">

<Link to="/choose-role">

  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
    Join as Creator
  </button>

</Link>

 <Link to="/choose-role">

  <button className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition">
    Hire Talent
  </button>

</Link>

  <Link to="/choose-role">

  <button className="border px-6 py-3 rounded-xl hover:bg-gray-100 transition">
    Browse Creators
  </button>

</Link>

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

{/* CTA SECTION */}

<section className="px-10 py-24">

  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-16 text-center text-white">

    <h1 className="text-5xl font-bold">
      Ready to join?
    </h1>

    <p className="text-xl mt-6 text-blue-100 max-w-2xl mx-auto leading-8">

Join thousands of creators and companies already on VIVIDWe.

    </p>

    <div className="flex justify-center gap-5 mt-10 flex-wrap">

      <Link to="/choose-role">

  <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition">
    Get Started Free
  </button>

</Link>

    </div>

  </div>

</section>

{/* FOOTER */}

<footer className="border-t px-10 py-10">

  <div className="flex flex-col md:flex-row justify-between items-center gap-6">

    <div>

      <h1 className="text-3xl font-bold text-blue-600">
        VIVIDWe
      </h1>

      <p className="text-gray-500 mt-3">
        Connecting creators with opportunities.
      </p>

    </div>

    <div className="flex gap-8 text-gray-600 font-medium">

      <a href="#" className="hover:text-blue-600 transition">
        Home
      </a>

      <a href="#" className="hover:text-blue-600 transition">
        Features
      </a>

      <a href="#" className="hover:text-blue-600 transition">
        Creators
      </a>

      <a href="#" className="hover:text-blue-600 transition">
        Contact
      </a>

    </div>

  </div>

  <div className="border-t mt-8 pt-6 text-center text-gray-500">

    © 2025 VIVIDWe. All rights reserved.

  </div>

</footer>

    </div>
  );
}