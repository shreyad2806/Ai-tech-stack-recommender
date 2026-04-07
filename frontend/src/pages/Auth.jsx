import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";

// 🌐 API Configuration
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, ''); // Remove trailing slash
console.log("API URL:", API_URL);
console.log("Final signup URL:", `${API_URL}/auth/signup`);

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const modeFromNav = location.state?.mode || "login";
  const [mode, setMode] = useState(modeFromNav);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      const signupRes = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Signup response status:", signupRes.status);

      let signupData;
      try {
        signupData = await signupRes.json();
      } catch (e) {
        if (import.meta.env.DEV) console.error("Invalid JSON response during signup", e);
        throw new Error("Invalid response from server");
      }

      if (!signupRes.ok || !signupData.success) {
        throw new Error(signupData.detail || "Signup failed");
      }

      // Store token and user from signup response
      localStorage.setItem("token", signupData.token);
      localStorage.setItem("user", JSON.stringify(signupData.user));

      navigate("/dashboard");

    } catch (err) {
      if (import.meta.env.DEV) console.error("Signup error:", err);
      alert(err.message || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login response status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch (e) {
        if (import.meta.env.DEV) console.error("Invalid JSON response during login", e);
        throw new Error("Invalid response from server");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

    } catch (err) {
      if (import.meta.env.DEV) console.error("Login error:", err);
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
    <div className="min-h-screen bg-[#050508] flex items-center justify-center relative overflow-hidden p-6 font-sans">
      {/* Background Glow Effects (Space/Nebula vibe) */}
      <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Subtle star-like noise overlay (optional for texture) */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none"></div>

      {/* Deep Card Backglow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm h-[400px] bg-linear-to-tr from-emerald-500/20 to-purple-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-[#0a0a10]/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-4xl p-10 relative z-10 flex flex-col items-center transition-all duration-500">
        
        {/* Subtle top border gradient edge */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-purple-500/50 to-transparent"></div>
        {/* Subtle bottom border gradient edge for glow effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent"></div>

        {/* Text Headers */}
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide text-center mt-2 transition-all duration-500">
          {mode === "login" ? "Login to StackMind" : "Create your account"}
        </h1>
        <p className="text-sm text-gray-400 text-center mb-10 transition-all duration-500">
          {mode === "login" ? "Welcome back! Sign in to generate your ideal tech stack" : "Join us and start building your perfect tech stack"}
        </p>

        {/* Form */}
        <div className="w-full space-y-5 transition-all duration-500">
          
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#6ef0c0] transition-colors duration-300" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" 
              className="w-full bg-[#0d0d14] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ef0c0]/50 focus:border-[#6ef0c0]/50 hover:border-white/20 transition-all duration-300 font-medium"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#6ef0c0] transition-colors duration-300" />
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-[#0d0d14] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ef0c0]/50 focus:border-[#6ef0c0]/50 hover:border-white/20 transition-all duration-300 font-medium"
            />
            {showPassword ? (
              <Eye onClick={() => setShowPassword(false)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-white transition-colors duration-200" />
            ) : (
              <EyeOff onClick={() => setShowPassword(true)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-white transition-colors duration-200" />
            )}
          </div>

          {/* Confirm Password Input (Signup only) */}
          <div className={`relative group overflow-hidden transition-all duration-500 ease-in-out ${mode === "login" ? 'max-h-0 opacity-0 -mt-5' : 'max-h-24 opacity-100'}`}>
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#6ef0c0] transition-colors duration-300" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password" 
                className="w-full bg-[#0d0d14] border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6ef0c0]/50 focus:border-[#6ef0c0]/50 hover:border-white/20 transition-all duration-300 font-medium"
              />
              {showPassword ? (
                <Eye onClick={() => setShowPassword(false)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-white transition-colors duration-200" />
              ) : (
                <EyeOff onClick={() => setShowPassword(true)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer hover:text-white transition-colors duration-200" />
              )}
          </div>

          {/* Login / Signup Button */}
          <button 
            onClick={handleAuth}
            disabled={isLoading}
            className={`w-full bg-linear-to-r from-[#6ef0c0] to-[#8b8bff] text-black font-extrabold text-lg py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(139,139,255,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer ${mode === "login" ? 'mt-8' : 'mt-10'} disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
          >
             {mode === "login" ? "Login" : "Create Account"}
          </button>

          {/* Forgot Password */}
          <div className={`text-center overflow-hidden transition-all duration-500 ease-in-out ${mode === "login" ? 'max-h-10 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'}`}>
            <Link to="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300">
              Forgot your password?
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mt-8 mb-8 opacity-60">
            <div className="h-px w-full bg-white/20"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
            <div className="h-px w-full bg-white/20"></div>
          </div>

          {/* Sign up / Login Toggle */}
          <div className="text-center text-sm font-medium text-gray-400 mb-2">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={(e) => {
                e.preventDefault();
                setMode(mode === "login" ? "signup" : "login");
              }} 
              className="text-[#8b8bff] hover:text-white hover:drop-shadow-[0_0_10px_rgba(139,139,255,0.8)] transition-all duration-300 font-extrabold border-none bg-transparent cursor-pointer p-0 ml-1 tracking-wide"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </div>

        </div>
        
      </div>
    </div>
  );
}
