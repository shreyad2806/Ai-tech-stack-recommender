import { useState } from "react";
import Sidebar from "../components/Sidebar";
import InputBox from "../components/InputBox";
import { Share, Bell, Settings, LogOut, Eraser } from "lucide-react";

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#050508] flex font-sans overflow-hidden">
      
      {/* Left Sidebar Component */}
      <Sidebar />

      {/* Right Main Content Area (Flex-1) */}
      <main className="flex-1 h-screen relative flex flex-col overflow-y-auto">
        
        {/* Main Content Background Glow Effects */}
        <div className="fixed top-0 left-[260px] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
        <div className="fixed top-1/3 left-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        {/* Subtle star-like noise overlay */}
        <div className="fixed inset-0 bg-[url('https://transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-screen pointer-events-none -z-10"></div>
        
        {/* Content Wrapper */}
        <div className="w-full min-h-full flex flex-col relative z-10">
          
          {/* Dashboard Header */}
          <header className="w-full px-6 py-4 flex items-center justify-end gap-3 bg-white/2 backdrop-blur-md border-b border-white/5 z-50">
             
             {/* Share Button */}
             <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-colors text-sm font-semibold mr-1">
               <Share className="w-4 h-4" />
               Share
             </button>

             {/* Notification Bell */}
             <div className="relative">
               <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5">
                 <Bell className="w-4 h-4" />
               </button>
               {/* Notification Indication Dot */}
               <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-purple-500 border-2 border-[#151522] pointer-events-none"></div>
             </div>

             {/* User Profile Dropdown Container */}
             <div className="relative">
               <button 
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 className="flex flex-col items-center justify-center w-10 h-10 ml-2 rounded-full bg-purple-600/20 border border-purple-500/30 hover:border-purple-400/50 transition-colors focus:outline-none"
               >
                 <span className="text-[13px] font-bold text-purple-200">RK</span>
               </button>

               {/* Flyout Dropdown Menu */}
               {isDropdownOpen && (
                 <div className="absolute right-0 mt-3 w-48 bg-[#151522] border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/10 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                   <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                     <Eraser className="w-4 h-4 text-purple-400" />
                     Clear chats
                   </button>
                   <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium">
                     <Settings className="w-4 h-4 text-gray-500" />
                     Settings
                   </button>
                   
                   <div className="h-px w-full bg-white/5 my-1.5"></div>
                   
                   <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium">
                     <LogOut className="w-4 h-4 text-gray-500 hover:text-red-400" />
                     Logout
                   </button>
                 </div>
               )}
             </div>

          </header>

          {/* Main Dashboard Interactive Area */}
          <div className="flex-1 p-8 md:px-12 lg:px-16 overflow-y-auto no-scrollbar flex flex-col justify-center pb-20">
            
            <div className="w-full max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="mt-2 mb-8 flex flex-col items-start text-left shrink-0">
                <p className="text-gray-300 font-semibold mb-2 tracking-wide text-sm md:text-[15px]">
                  Good afternoon, Rahul
                </p>
                
                <h1 className="text-5xl lg:text-[4rem] font-extrabold text-white mb-4 leading-[1.1] tracking-tight">
                  What are you{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-300 via-[#a78bfa] to-blue-400">
                    building
                  </span>
                  <br />
                  today?
                </h1>
                
                <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
                  Describe your idea in plain language — StackMind will recommend your full tech stack, architecture, and deployment strategy in seconds.
                </p>
              </div>

              {/* Input Card */}
              <InputBox />
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
