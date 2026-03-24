import { useState } from "react";

export default function LoginCorner({ onSignIn, user, pink }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    onSignIn({ email, password });
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {user ? (
        <button
          className="flex items-center px-3 py-1 text-sm bg-zinc-800 rounded-md hover:bg-zinc-700"
          onClick={() => setShowDropdown((v) => !v)}
        >
          <span className="mr-2">{user.email}</span>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline">
            <path stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>
      ) : (
        <button
          className={`px-4 py-1 text-sm font-semibold rounded-full transition shadow-md ${pink ? 'bg-pink-500 hover:bg-pink-400 text-white' : 'bg-indigo-600 hover:bg-indigo-500'}`}
          onClick={() => setShowDropdown((v) => !v)}
        >
          Sign In
        </button>
      )}
      {showDropdown && !user && (
        <form
          className="absolute right-0 mt-2 w-64 p-4 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-30"
          onSubmit={handleSignIn}
        >
          <div className="mb-2">
            <label className="block text-xs mb-1">Email</label>
            <input
              type="email"
              className="w-full px-2 py-1 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-xs mb-1">Password</label>
            <input
              type="password"
              className="w-full px-2 py-1 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-xs text-red-400 mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-1 mt-2 bg-indigo-600 rounded hover:bg-indigo-500 text-sm"
          >
            Sign In
          </button>
        </form>
      )}
      {showDropdown && user && (
        <div className="absolute right-0 mt-2 w-40 p-3 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-30">
          <button
            className={`w-full py-1 rounded text-sm font-semibold transition shadow-md ${pink ? 'bg-pink-500 hover:bg-pink-400 text-white' : 'bg-red-600 hover:bg-red-500'}`}
            onClick={() => {
              setShowDropdown(false);
              onSignIn(null);
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
