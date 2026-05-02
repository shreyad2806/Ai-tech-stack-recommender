import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

// Debug: Log API URL
console.log('Auth.jsx - API URL:', API_URL);

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const modeFromNav = location.state?.mode || "login";

  const [mode, setMode] = useState(modeFromNav);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ FIX
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ================= SIGNUP =================
  const handleSignup = async () => {
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const cleanConfirm = confirmPassword.trim();

      // ✅ validation
      if (cleanPassword !== cleanConfirm) {
        alert("Passwords do not match");
        return;
      }

      if (cleanPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      if (cleanPassword.length > 50) {
        alert("Password too long (max ~50 characters)");
        return;
      }

      console.log("Signup payload:", {
        email: cleanEmail,
        passwordLength: cleanPassword.length
      });

      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword
        })
      });

      let data = {};
      try {
        data = await res.json();
        console.log("Signup response:", data);
      } catch (e) {
        console.error("Invalid JSON in signup response:", e);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data?.detail || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      if (!data.success) {
        throw new Error(
          Array.isArray(data.detail)
            ? data.detail[0].msg
            : data.detail || "Signup failed"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Signup successful!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message || "Signup failed");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      if (cleanPassword.length > 50) {
        alert("Password too long (max ~50 characters)");
        return;
      }

      console.log("Login payload:", {
        email: cleanEmail,
        passwordLength: cleanPassword.length
      });

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword
        })
      });

      let data = {};
      try {
        data = await res.json();
        console.log("Login response:", data);
      } catch (e) {
        console.error("Invalid JSON in login response:", e);
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data?.detail || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      if (!data.success) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed");
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    if (mode === "signup") {
      await handleSignup();
    } else {
      await handleLogin();
    }
    setIsLoading(false);
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-black text-white"
        />

        {/* CONFIRM PASSWORD */}
        {mode === "signup" && (
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full mb-4 p-3 rounded bg-black text-white"
          />
        )}

        <button
          onClick={handleAuth}
          className="w-full p-3 bg-green-400 text-black font-bold rounded"
        >
          {mode === "login" ? "Login" : "Signup"}
        </button>

        <div className="text-center mt-4 text-gray-400">
          {mode === "login" ? "No account?" : "Already have account?"}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="ml-2 text-blue-400"
          >
            {mode === "login" ? "Signup" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
