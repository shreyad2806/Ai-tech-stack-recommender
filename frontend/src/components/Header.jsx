export default function Header() {
  return (
    <header className="h-16 bg-black border-b border-[#262626] flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-semibold text-white">
          AI Tech Stack Copilot
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Transform your ideas into production-ready tech stacks
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2V6M12 18V22M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M2 12H6M18 12H22M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.12831 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3509 11.8792 21.7563 11.2728 22.0329 10.6054C22.3094 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3094 7.0621 22.0329 6.39464C21.7563 5.72718 21.3509 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:from-pink-400 hover:to-pink-500 transition-all">
          <span className="text-sm font-medium text-white">U</span>
        </div>
      </div>
    </header>
  );
}

