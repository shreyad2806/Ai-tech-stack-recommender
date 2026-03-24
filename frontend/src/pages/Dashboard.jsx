import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PromptBox from "../components/PromptBox";
import ExampleCards from "../components/ExampleCards";
import ResultPanel from "../components/ResultPanel";
import { useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState(null);

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto px-8 py-10">
          <div className="w-full max-w-4xl ml-6 space-y-8">
            <PromptBox setResult={setResult} />
            <ExampleCards />
            {result && <ResultPanel result={result} />}
          </div>
        </main>
      </div>
    </div>
  );
}
