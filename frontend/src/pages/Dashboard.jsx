import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ FIXED IMPORT (make sure file name matches exactly)
import Sidebar from "../components/Sidebar";
import InputBox from "../components/InputBox";

import { Share, Bell, Settings, LogOut, Eraser, Loader2 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  if (import.meta.env.DEV) console.log("Dashboard: Rendering", { user, isLoading, authChecked });

  // Auth check on mount
  useEffect(() => {
    if (import.meta.env.DEV) console.log("Dashboard: Checking auth...");
    const token = localStorage.getItem("token");

    if (!token) {
      if (import.meta.env.DEV) console.log("Dashboard: No token found, redirecting to auth");
      navigate("/auth");
      return;
    }

    const raw = localStorage.getItem("user") || "null";
    try {
      const parsedUser = JSON.parse(raw);
      if (import.meta.env.DEV) console.log("Dashboard: User loaded:", parsedUser);
      setUser(parsedUser);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Dashboard: Error parsing user data:", error);
      setUser(null);
    }
    
    setAuthChecked(true);
    setIsLoading(false);
  }, [navigate]);

  // Load saved data
  useEffect(() => {
    if (!authChecked) return;
    
    if (import.meta.env.DEV) console.log("Dashboard: Loading saved data...");
    
    const saved = localStorage.getItem("lastStack");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResult(parsed);
        if (import.meta.env.DEV) console.log("Dashboard: Restored stack from localStorage:", parsed);
      } catch (e) {
        if (import.meta.env.DEV) console.error("Dashboard: Failed to load saved stack", e);
      }
    }

    const savedIdea = localStorage.getItem("lastIdea");
    if (savedIdea) {
      setInput(savedIdea);
      if (import.meta.env.DEV) console.log("Dashboard: Restored idea from localStorage:", savedIdea);
    }
  }, [authChecked]);

  // Dynamic greeting function
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Show loading state while checking auth
  if (isLoading) {
    if (import.meta.env.DEV) console.log("Dashboard: Showing loading state");
    return (
      <div className="min-h-screen w-full bg-[#050508] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#6ef0c0] animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after auth check, show error or redirect
  if (!user) {
    if (import.meta.env.DEV) console.log("Dashboard: No user found after auth check");
    return (
      <div className="min-h-screen w-full bg-[#050508] flex items-center justify-center">
        <div className="bg-[#111827] border border-red-800 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to access the dashboard.</p>
          <button
            onClick={() => navigate("/auth")}
            className="px-6 py-3 bg-[#6ef0c0] text-black font-bold rounded-xl hover:bg-[#5dd0a8] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (import.meta.env.DEV) console.log("Dashboard: Rendering main content", { userEmail: user?.email });

  return (
    <div className="min-h-screen w-full bg-[#050508] flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="relative flex flex-col flex-1 h-screen overflow-y-auto">

        {/* Header */}
        <header className="flex justify-end w-full gap-3 px-6 py-4 border-b border-white/5">

          <button className="flex items-center gap-2 px-4 py-2 text-gray-400 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <Share className="w-4 h-4" />
            Share
          </button>

          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <Bell className="w-4 h-4" />
          </button>

          <div className="relative user-dropdown">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600/20 hover:bg-purple-600/30 transition-colors"
            >
              <span className="text-sm font-bold text-purple-200">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#151522] rounded-xl py-2 border border-white/10 shadow-xl z-50">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-white text-sm truncate">{user?.email || "user@example.com"}</p>
                </div>
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Eraser className="w-4 h-4" />
                  Clear chats
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5 transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/auth");
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </header>

        {/* Content */}
        <div className="flex flex-col justify-center flex-1 p-8">

          <div className="w-full max-w-4xl mx-auto">

            <p className="mb-2 text-gray-400">
              {getGreeting()}
            </p>

            <h1 className="mb-4 text-5xl font-bold text-white leading-tight">
              What are you <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">building</span> today?
            </h1>

            <p className="text-gray-400 mt-2 max-w-2xl">
              Describe your idea in plain language — StackMind will recommend your full tech stack, architecture, and deployment strategy in seconds.
            </p>

            {/* Debug: Show user data structure in development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-4 text-xs text-gray-500">
                <summary>Debug user data</summary>
                <pre className="mt-2 p-2 bg-[#0a0a0f] rounded overflow-auto max-h-32">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </details>
            )}

            <InputBox input={input} setInput={setInput} result={result} setResult={setResult} />

          </div>

        </div>

      </main>
    </div>
  );
}