import { Link } from "react-router-dom";
import { MessageCircle, Code, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-20 relative z-10 bg-[#09090f]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-6 h-6 rounded bg-linear-to-tr from-cyan-400 via-purple-500 to-pink-500">
              <div className="absolute inset-px bg-[#09090f] rounded-sm"></div>
              <div className="w-2.5 h-2.5 rounded-sm bg-linear-to-tr from-cyan-400 via-purple-500 to-pink-500 z-10"></div>
            </div>
            <span className="text-lg font-bold tracking-wide text-white">StackMind</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <Link to="#features" className="hover:text-white transition-colors duration-200">Features</Link>
            <Link to="#docs" className="hover:text-white transition-colors duration-200">Docs</Link>
            <Link to="#contact" className="hover:text-white transition-colors duration-200">Contact</Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-gray-500">
            <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Social">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200" aria-label="GitHub">
              <Code className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors duration-200" aria-label="Website">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Copyright - Centered */}
        <div className="text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} StackMind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
