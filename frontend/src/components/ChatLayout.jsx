import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, User, Sparkles } from 'lucide-react';
import HeroInput from './HeroInput';
import ResultView from './ResultView';

export default function ChatLayout({ history, onNewChat, onHistoryClick }) {
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // Debug logging
  console.log("CHATLAYOUT RENDER - resultData:", resultData);
  console.log("CHATLAYOUT RENDER - isLoading:", isLoading);

  const handleSubmit = useCallback(async (idea) => {
    if (!idea.trim() || isLoading) return;

    console.log("CHATLAYOUT: Submitting idea:", idea);
    setIsLoading(true);
    setResultData(null);

    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      console.log("CHATLAYOUT: API response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("CHATLAYOUT: API RESPONSE:", data);
      console.log("CHATLAYOUT: RESPONSE KEYS:", Object.keys(data));

      // Normalize data to handle different key names (exclude diagram for async loading)
      const safeData = {
        idea: idea,
        tech_stack: data?.tech_stack || {},
        architecture: data?.architecture || "No architecture provided",
        deployment: data?.deployment || "",
        roadmap: data?.roadmap || [],
        // Handle multiple possible cost key names
        cost: data?.cost || data?.costEstimate || data?.cost_estimate || null,
        reasoning: data?.reasoning || data?.reason || []
      };

      console.log("CHATLAYOUT: NORMALIZED DATA:", safeData);
      console.log("CHATLAYOUT: TECH_STACK KEYS:", Object.keys(safeData.tech_stack || {}));
      console.log("CHATLAYOUT: TECH_STACK VALUES:", safeData.tech_stack);
      
      // Show result immediately
      setResultData(safeData);
      
      // Save to history
      const historyItem = {
        idea: idea,
        result: safeData,
        timestamp: Date.now()
      };
      
      // Update history in localStorage
      const updatedHistory = [historyItem, ...history].slice(0, 10);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
      
      // Notify parent component
      onHistoryClick(historyItem);
    } catch (err) {
      console.error("CHATLAYOUT: API ERROR:", err);
      setResultData({ 
        error: "Failed to generate tech stack. Please try again.",
        idea: idea
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, API_URL, history, onHistoryClick]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#0a0a0f]">
      {/* Top Navbar */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-semibold text-white">StackMind AI</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-xl text-sm text-white/80 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </motion.button>
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-xl text-sm text-white/80 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section with Input */}
        <section className="flex-1 flex flex-col items-center justify-center py-12 md:py-20 px-6">
          <AnimatePresence mode="wait">
            {!resultData ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <HeroInput onSubmit={handleSubmit} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-8"
              >
                {/* Compact Input (always visible when results exist) */}
                <div className="w-full max-w-4xl mx-auto px-6 mb-8">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span className="text-white/80">Generated tech stack for:</span>
                    </div>
                    <div className="mt-2 text-white text-lg font-medium">
                      {resultData?.idea || "Your project"}
                    </div>
                  </div>
                </div>

                {/* Results - Always pass an object, never undefined */}
                <ResultView 
                  data={resultData || {}} 
                  isLoading={isLoading}
                />

                {/* New Generation Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center pt-8 pb-12"
                >
                  <motion.button
                    onClick={() => {
                      setResultData(null);
                      onNewChat();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate Another Stack
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
