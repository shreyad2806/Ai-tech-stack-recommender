import { useState } from "react";
import axios from "axios";

function App() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔽 axios.post() goes HERE
  const handleGenerate = async () => {
    if (!description.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/recommend",
        {
          description: description, // this is userInput
        }
      );

      setResult(response.data.result);
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Describe your project..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleGenerate}>
        Generate Tech Stack
      </button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default App;


