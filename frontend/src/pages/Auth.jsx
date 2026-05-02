import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

console.log("Auth.jsx - API URL:", API_URL);

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const modeFromNav = location.state?.mode || "login";

  const [mode, setMode] = useState(modeFromNav);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ================= SIGNUP =================
  const handleSignup = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    // ✅ validations
    if (!cleanEmail) return alert("Email required");
    if (!cleanPassword) return alert("Password required");

    if (cleanPassword !== cleanConfirm) {
      return alert("Passwords do not match");
    }

    if (cleanPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (cleanPassword.length > 50) {
      return alert("Password too long (max 50 chars)");
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok) {
        throw new Error(data?.detail || "Signup failed");
      }

      if (!data.success) {
        throw new Error(data?.detail || "Signup failed");
      }

      // ✅ SAVE AUTH
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return alert("Enter email & password");
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok) {
        throw new Error(data?.detail || "Login failed");
      }

      if (!data.success) {
        throw new Error(data?.detail || "Invalid credentials");
      }

      // ✅ SAVE AUTH
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ================= MAIN =================
  const handleAuth = async () => {
    if (mode === "signup") {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0a0a10]/80 p-10 rounded-2xl">

        <h1 className="text-2xl text-white mb-6 text-center">
          {mode === "login" ? "Login" : "Signup"}
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-black text-white"
        />

        {/* PASSWORD */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-black text-white"
        />

        {/* CONFIRM */}
        {mode === "signup" && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full mb-4 p-3 rounded bg-black text-white"
          />
        )}

        <button
          onClick={handleAuth}
          disabled={isLoading}
          className="w-full p-3 bg-green-400 text-black font-bold rounded"
        >
          {isLoading
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : "Signup"}
        </button>

        <div className="text-center mt-4 text-gray-400">
          {mode === "login" ? "No account?" : "Already have account?"}
          <button
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
            className="ml-2 text-blue-400"
          >
            {mode === "login" ? "Signup" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}