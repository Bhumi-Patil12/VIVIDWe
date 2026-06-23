import React, { createContext, useContext, useState } from "react";
import {
  ClerkProvider as RealClerkProvider,
  SignedIn as RealSignedIn,
  SignedOut as RealSignedOut,
  UserButton as RealUserButton,
  SignIn as RealSignIn,
  SignUp as RealSignUp,
  useUser as useRealUser,
  useSession as useRealSession,
} from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

const AuthContext = createContext(null);

function MockClerkProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState({
    firstName: "Demo",
    lastName: "User",
    username: "demo",
    fullName: "Demo User",
    imageUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=256&q=80",
  });

  const [session] = useState({
    getToken: async () => "mock-token",
  });

  const login = ({ email }) => {
    const localPart = email?.split("@")[0] || "demo";
    const name = localPart.charAt(0).toUpperCase() + localPart.slice(1);
    setUser({
      firstName: name,
      lastName: "User",
      username: localPart,
      fullName: `${name} User`,
      imageUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(localPart)}`,
    });
    setSignedIn(true);
  };

  const logout = () => {
    setSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ signedIn, user: signedIn ? user : null, session: signedIn ? session : null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ publishableKey, children }) {
  if (publishableKey) {
    return <RealClerkProvider publishableKey={publishableKey}>{children}</RealClerkProvider>;
  }

  return <MockClerkProvider>{children}</MockClerkProvider>;
}

export function SignedIn({ children }) {
  const auth = useAuthContext();
  if (auth) {
    return auth.signedIn ? <>{children}</> : null;
  }
  return <RealSignedIn>{children}</RealSignedIn>;
}

export function SignedOut({ children }) {
  const auth = useAuthContext();
  if (auth) {
    return !auth.signedIn ? <>{children}</> : null;
  }
  return <RealSignedOut>{children}</RealSignedOut>;
}

export function UserButton({ afterSignOutUrl = "/" }) {
  const auth = useAuthContext();
  if (auth) {
    if (!auth.signedIn) return null;
    return (
      <button
        type="button"
        className="h-11 px-5 flex items-center justify-center font-medium rounded-xl border border-slate-300 hover:bg-slate-100 transition"
        onClick={() => {
          auth.logout();
          window.location.href = afterSignOutUrl;
        }}
      >
        Sign Out
      </button>
    );
  }
  return <RealUserButton afterSignOutUrl={afterSignOutUrl} />;
}

export function SignIn() {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  if (!auth) {
    return <RealSignIn />;
  }

  if (auth.signedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="max-w-md w-full rounded-3xl bg-white p-10 shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">You are already signed in</h1>
          <p className="text-gray-600 mb-6">Continue to your profile or sign out to use a different account.</p>
          <div className="flex gap-3 justify-center">
            <button className="px-5 py-3 rounded-xl bg-blue-600 text-white" onClick={() => navigate("/creator-profile")}>Go to Profile</button>
            <button className="px-5 py-3 rounded-xl border border-gray-300" onClick={() => auth.logout()}>Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold mb-4">Mock Sign In</h1>
        <p className="text-gray-600 mb-6">Enter any email to continue in demo mode.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            auth.login({ email });
            navigate("/creator-profile");
          }}
          className="space-y-5"
        >
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="demo@example.com"
            />
          </label>
          <button type="submit" className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition">
            Sign In
          </button>
          <div className="text-sm text-gray-500">
            Demo sign in is only available when Clerk is not configured.
          </div>
          <div className="text-right text-sm">
            <Link to="/">Back to Home</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SignUp({ forceRedirectUrl }) {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  if (!auth) {
    return <RealSignUp forceRedirectUrl={forceRedirectUrl} />;
  }

  if (auth.signedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="max-w-md w-full rounded-3xl bg-white p-10 shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Already signed in</h1>
          <p className="text-gray-600 mb-6">Continue to your profile or sign out to use a different account.</p>
          <div className="flex gap-3 justify-center">
            <button className="px-5 py-3 rounded-xl bg-blue-600 text-white" onClick={() => navigate("/creator-profile")}>Go to Profile</button>
            <button className="px-5 py-3 rounded-xl border border-gray-300" onClick={() => auth.logout()}>Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-md">
        <h1 className="text-3xl font-bold mb-4">Mock Sign Up</h1>
        <p className="text-gray-600 mb-6">Enter any email to create a demo account.</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            auth.login({ email });
            navigate(forceRedirectUrl || "/creator-profile");
          }}
          className="space-y-5"
        >
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="demo@example.com"
            />
          </label>
          <button type="submit" className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition">
            Sign Up
          </button>
          <div className="text-sm text-gray-500">
            This mock sign up only works when Clerk is not configured.
          </div>
          <div className="text-right text-sm">
            <Link to="/">Back to Home</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export function useUser() {
  const auth = useAuthContext();
  if (auth) {
    return { user: auth.user };
  }
  return useRealUser();
}

export function useSession() {
  const auth = useAuthContext();
  if (auth) {
    return { session: auth.session };
  }
  return useRealSession();
}
