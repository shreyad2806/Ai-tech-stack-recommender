import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PromptBox from "../components/PromptBox";
import ExampleCards from "../components/ExampleCards";
import ResultPanel from "../components/ResultPanel";
import { useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState(null);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Header />

        <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
          <PromptBox setResult={setResult} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <ExampleCards />
              {result && <ResultPanel result={result} />}
            </div>

            <aside className="card">
              <h4 className="font-semibold">Project Info</h4>
              <p className="mt-2 text-sm muted">Summary, constraints and notes will appear here.</p>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
