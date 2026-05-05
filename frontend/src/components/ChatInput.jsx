import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Square } from 'lucide-react';

const ChatInput = ({ 
  input, 
  setInput, 
  onSend, 
  onStopGeneration, 
  isLoading, 
  isTyping 
}) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    } else if (e.key === 'Escape' && (isLoading || isTyping)) {
      e.preventDefault();
      onStopGeneration();
    }
  };

  return (
    <div className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex items-end gap-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-5 py-4 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/30 transition-all duration-300 hover:bg-white/10">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your project idea..."
            className="flex-1 bg-transparent outline-none resize-none text-gray-100 placeholder-gray-500 max-h-32 min-h-[24px] text-base leading-relaxed"
            rows={1}
            disabled={isLoading || isTyping}
          />
          <AnimatePresence mode="wait">
            {(isLoading || isTyping) ? (
              <motion.button
                key="stop"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onStopGeneration}
                className="p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.05]"
                title="Stop generating"
              >
                <Square className="w-5 h-5 text-white" />
              </motion.button>
            ) : (
              <motion.button
                key="send"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={onSend}
                disabled={!input.trim()}
                className="p-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.05] disabled:shadow-none disabled:hover:scale-100"
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className="text-xs text-gray-500 mt-3 text-center">
          Press Enter to send, Shift+Enter for new line
          {(isLoading || isTyping) && " • ESC to stop"}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
