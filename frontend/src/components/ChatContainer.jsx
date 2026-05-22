import { useState } from "react";
import ChatInput from "./ChatInput";
import ResultView from "./ResultView";

export default function ChatContainer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleGenerate = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: input,
        }),
      });

      const data = await response.json();

      console.log("API RESULT:", data);

      setResult(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setInput("");
    setResult(null);
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-black">

      {/* HEADER */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-5">

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 font-bold text-black rounded-full bg-emerald-400">
              S
            </div>

            <h1 className="text-3xl font-bold">
              StackMind AI
            </h1>
          </div>

          <button
            onClick={handleNewChat}
            className="px-5 py-3 transition border rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">

        {/* EMPTY STATE */}
        {!result && (
          <div className="flex flex-col items-center justify-center min-h-[85vh] px-6">

            <div className="w-full max-w-4xl text-center">

              <h1 className="mb-8 text-6xl font-bold leading-tight">
                Design Production-Ready
                <span className="text-emerald-400">
                  {" "}AI Systems
                </span>
              </h1>

              <p className="text-xl leading-relaxed text-gray-400 mb-14">
                Describe your startup, SaaS, AI workflow, or platform idea.
                StackMind generates a scalable system design,
                architecture, workflows, deployment strategy,
                and production tech stack.
              </p>

              {/* CENTER INPUT */}
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  input={input}
                  setInput={setInput}
                  onSend={handleGenerate}
                  isLoading={loading}
                  centered
                />
              </div>

            </div>
          </div>
        )}

        {/* RESULT DASHBOARD */}
        {result && (
          <div className="px-10 py-10">

            {/* TOP IDEA CARD */}
            <div className="max-w-6xl mx-auto mb-10">

              <div className="p-8 border rounded-3xl border-emerald-500/20 bg-emerald-500/5">

                <div className="mb-4 text-sm tracking-widest uppercase text-emerald-400">
                  Generated System Design For
                </div>

                <div className="text-3xl font-semibold leading-relaxed">
                  {input}
                </div>

              </div>
            </div>

            {/* RESULT TABS */}
            <div className="max-w-6xl mx-auto">
              <ResultView data={result} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
