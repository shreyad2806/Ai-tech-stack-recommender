import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PromptBox from "../components/PromptBox";
import ExampleCards from "../components/ExampleCards";
import ResultPanel from "../components/ResultPanel";
import { useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState(null);

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Build Your Next Project with AI
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Describe your project idea and get instant recommendations for the perfect tech stack, architecture, and deployment strategy.
                </p>
              </div>

              {/* Input Section */}
              <PromptBox setResult={setResult} />

              {/* Examples Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">
                  Popular Project Ideas
                </h3>
                <ExampleCards />
              </div>

              {/* Results Section */}
              {result && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Your Recommended Tech Stack
                  </h3>
                  <ResultPanel result={result} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
