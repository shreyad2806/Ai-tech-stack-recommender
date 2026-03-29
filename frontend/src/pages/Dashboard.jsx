import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ FIXED IMPORT (make sure file name matches exactly)
import Sidebar from "../components/Sidebar";
import InputBox from "../components/InputBox";

import { Share, Bell, Settings, LogOut, Eraser } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    const raw = localStorage.getItem("user") || "null";
    try {
      setUser(JSON.parse(raw));
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser(null);
    }
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem("lastStack");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResult(parsed);
        console.log("Restored stack from localStorage:", parsed);
      } catch (e) {
        console.error("Failed to load saved stack");
      }
    }
  }, []);

  useEffect(() => {
    const savedIdea = localStorage.getItem("lastIdea");
    if (savedIdea) {
      setInput(savedIdea);
      console.log("Restored idea from localStorage:", savedIdea);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050508] flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="relative flex flex-col flex-1 h-screen overflow-y-auto">

        {/* Header */}
        <header className="flex justify-end w-full gap-3 px-6 py-4 border-b border-white/5">

          <button className="flex items-center gap-2 px-4 py-2 text-gray-400 rounded-lg bg-white/5">
            <Share className="w-4 h-4" />
            Share
          </button>

          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5">
            <Bell className="w-4 h-4" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600/20"
            >
              <span className="text-sm font-bold text-purple-200">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#151522] rounded-xl py-2">
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5">
                  Clear chats
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5">
                  Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10">
                  Logout
                </button>
              </div>
            )}
          </div>

        </header>

        {/* Content */}
        <div className="flex flex-col justify-center flex-1 p-8">

          <div className="w-full max-w-4xl mx-auto">

            <p className="mb-2 text-gray-300">
              Good afternoon, {user?.email || "User"}
            </p>

            <h1 className="mb-4 text-5xl font-bold text-white">
              What are you building today?
            </h1>

            <InputBox input={input} setInput={setInput} result={result} setResult={setResult} />

          </div>

        </div>

      </main>
    </div>
  );
}