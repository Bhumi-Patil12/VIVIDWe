import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignIn, useAuth } from "../auth";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    auth.login({ email, password });
    navigate("/creator-profile?role=recruiter");
  };

  if (!auth) {
    return <SignIn />;
  }

  if (auth.signedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
        <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">Already signed in</h2>
          <p className="text-slate-600 mb-6">You are already logged in. Go to your profile or sign out to use another account.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate("/creator-profile?role=recruiter")}
              className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 transition"
            >
              Go to Profile
            </button>
            <button
              type="button"
              onClick={() => auth.logout()}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 hover:bg-slate-50 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Recruiter login</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Welcome back</h1>
          <p className="mt-3 text-slate-600">Enter your credentials to access your recruiter dashboard.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="you@company.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your password"
            />
          </label>
          {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">{error}</div>}
          <button className="w-full rounded-3xl bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-700 transition">
            Continue to profile
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-600">
          New here? <Link to="/signup?role=recruiter" className="font-semibold text-blue-600 hover:underline">Create a recruiter account</Link>.
        </p>
      </div>
    </div>
  );
}
