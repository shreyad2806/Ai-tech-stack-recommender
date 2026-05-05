import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const HeroInput = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const suggestions = [
    'Startup MVP',
    'AI App',
    'SaaS Platform',
    'E-commerce',
    'Social Network',
    'Fintech',
    'Healthcare',
    'Education',
  ];

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Focus the textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          What are you building today?
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Describe your idea and let AI design your perfect tech stack
        </p>
      </motion.div>

      {/* Input Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="I want to build a..."
            className="w-full bg-transparent text-white text-lg placeholder-white/30 outline-none resize-none px-4 py-4 min-h-[120px] max-h-[200px]"
            rows={1}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="text-xs text-white/40">
              Press Enter to generate
            </div>
            <motion.button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:shadow-none disabled:hover:scale-100"
              whileHover={{ scale: input.trim() && !isLoading ? 1.02 : 1 }}
              whileTap={{ scale: input.trim() && !isLoading ? 0.98 : 1 }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Tech Stack</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 rounded-full text-sm text-white/70 hover:text-white transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default HeroInput;
