import { Link } from "react-router-dom";

export default function Header() {
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
              className="border border-white/20 rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/dashboard" 
              className="bg-gradient-to-r from-[#6ef0c0] to-[#8b8bff] text-black rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90"
            >
              Try Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
