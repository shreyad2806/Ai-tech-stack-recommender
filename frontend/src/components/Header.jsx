import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 w-full text-white">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          StackMind
        </Link>

        {/* Right: Navigation + buttons */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="#docs" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Docs
            </Link>
            <Link to="#contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/auth" 
              state={{ mode: "login" }}
              className="cursor-pointer border border-white/20 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
            <button
              onClick={() => navigate("/auth", { state: { mode: "signup" } })}
              className="cursor-pointer bg-linear-to-r from-[#6ef0c0] to-[#8b8bff] text-black rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90"
            >
              Try Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
