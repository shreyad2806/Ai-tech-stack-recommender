import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Maximize2, X } from 'lucide-react';

// Animated Loading Dots Component
const LoadingDots = () => {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-lg shadow-emerald-500/50"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 1, 0.4],
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Diagram Viewer Component
const DiagramViewer = ({ diagramUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!diagramUrl) return null;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = diagramUrl;
    link.download = 'architecture-diagram.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExpand = () => {
    setIsExpanded(true);
  };
  
  return (
    <>
      <motion.div 
        className="mt-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 shadow-xl hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-300">Architecture Diagram</h4>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleDownload}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-[1.05]"
              title="Download diagram"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 text-gray-300" />
            </motion.button>
            <motion.button
              onClick={handleExpand}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-[1.05]"
              title="Expand to full view"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Maximize2 className="w-4 h-4 text-gray-300" />
            </motion.button>
          </div>
        </div>
        
        <div className="relative group">
          <img
            src={diagramUrl}
            alt="Architecture Diagram"
            className="w-full h-auto rounded-lg border border-white/20 bg-white shadow-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg pointer-events-none"></div>
        </div>
      </motion.div>
      
      {/* Expanded View Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className="relative max-w-6xl max-h-[90vh] bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Architecture Diagram</h3>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleDownload}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-[1.05]"
                    title="Download diagram"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5 text-gray-300" />
                  </motion.button>
                  <motion.button
                    onClick={() => setIsExpanded(false)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-[1.05]"
                    title="Close"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </motion.button>
                </div>
              </div>
              
              <div className="overflow-auto max-h-[calc(90vh-120px)]">
                <img
                  src={diagramUrl}
                  alt="Architecture Diagram"
                  className="w-full h-auto rounded-lg border border-white/20 bg-white shadow-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Cost Estimate Component
const CostEstimate = ({ cost }) => {
  if (!cost || !cost.mvp || !cost.scale) return null;
  
  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-600/10 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.01]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <span className="text-white text-lg">💰</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Cost Estimate</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-emerald-500/20 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
          <div className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            MVP Launch
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {cost.mvp}
          </div>
          <div className="text-gray-400 text-sm leading-relaxed">
            Basic features & infrastructure to get you started
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-teal-500/20 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
          <div className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-2">
            Scale Ready
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {cost.scale}
          </div>
          <div className="text-gray-400 text-sm leading-relaxed">
            Full production setup for growth and scale
          </div>
        </div>
      </div>
    </div>
  );
};

// Reasoning Component
const Reasoning = ({ reasoning }) => {
  if (!reasoning || !Array.isArray(reasoning) || reasoning.length === 0) return null;
  
  return (
    <div className="bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-600/10 backdrop-blur-lg rounded-2xl p-6 border border-teal-500/20 shadow-2xl shadow-teal-500/10 hover:shadow-teal-500/20 transition-all duration-300 hover:scale-[1.01]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
          <span className="text-white text-lg">🧠</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Why this stack?</h3>
      </div>
      
      <div className="space-y-4">
        {reasoning.map((point, index) => (
          <motion.div 
            key={index} 
            className="flex gap-4 items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50"></div>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              {point}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Result Display Component
const ResultDisplay = ({ data }) => {
  if (!data || typeof data !== 'object') return null;
  
  const renderTechStack = (tech_stack) => {
    if (!tech_stack || typeof tech_stack !== 'object') return null;
    
    const entries = Object.entries(tech_stack).filter(([key, value]) => 
      Array.isArray(value) && value.length > 0
    );
    
    if (entries.length === 0) return null;
    
    return (
      <div className="space-y-6">
        {entries.map(([category, technologies]) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {category.replace('_', ' / ')}
            </h4>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, i) => (
                <motion.span
                  key={i}
                  className="px-4 py-2 text-sm rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gray-200 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.05] shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-8 mt-6">
      {/* Architecture */}
      {data.architecture && (
        <motion.div 
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.01]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Architecture</h3>
          <p className="text-gray-200 leading-relaxed">{data.architecture}</p>
        </motion.div>
      )}
      
      {/* Cost Estimate */}
      <CostEstimate cost={data.cost} />
      
      {/* Tech Stack */}
      {data.tech_stack && (
        <motion.div 
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.01]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Tech Stack</h3>
          {renderTechStack(data.tech_stack)}
        </motion.div>
      )}
      
      {/* Reasoning */}
      <Reasoning reasoning={data.reasoning} />
      
      {/* Deployment */}
      {data.deployment && (
        <motion.div 
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.01]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Deployment Strategy</h3>
          <p className="text-gray-200 leading-relaxed">{data.deployment}</p>
        </motion.div>
      )}
      
      {/* Roadmap */}
      {data.roadmap && Array.isArray(data.roadmap) && data.roadmap.length > 0 && (
        <motion.div 
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.01]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6">Implementation Roadmap</h3>
          <div className="space-y-4">
            {data.roadmap.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 border border-emerald-500/30 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0 mt-0.5 shadow-lg shadow-emerald-500/25">
                  {index + 1}
                </div>
                <p className="text-gray-200 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Main MessageBubble Component
const MessageBubble = ({ message, isLast, isTyping }) => {
  const isUser = message.role === 'user';
  
  if (message.loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start mb-6"
      >
        <div className="max-w-3xl mx-auto px-6 w-full">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-emerald-500/25">
              AI
            </div>
            <div className="flex-1">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 inline-block shadow-xl">
                <div className="flex items-center gap-3">
                  <LoadingDots />
                  <span className="text-gray-400 text-sm font-medium">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (message.role === 'assistant' && message.content) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-start mb-6"
      >
        <div className="max-w-3xl mx-auto px-6 w-full">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-emerald-500/25">
              AI
            </div>
            <div className="flex-1">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 inline-block shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <div className="text-gray-100 whitespace-pre-wrap leading-relaxed">
                  {isTyping ? (
                    <span>{message.content}</span>
                  ) : (
                    <span>{message.content}</span>
                  )}
                  {isTyping && (
                    <motion.span
                      className="inline-block w-2 h-5 bg-gradient-to-r from-emerald-400 to-teal-500 ml-1 rounded-full"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>
              
              {/* Show diagram after text generation is complete */}
              {!isTyping && message.data && message.data.diagram_url && (
                <DiagramViewer diagramUrl={message.data.diagram_url} />
              )}
              
              {/* Show structured sections */}
              {!isTyping && message.data && (
                <ResultDisplay data={message.data} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-6"
      >
        <div className="max-w-3xl mx-auto px-6 w-full">
          <div className="flex items-start gap-4 justify-end">
            <div className="flex-1">
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-lg border border-emerald-500/20 rounded-2xl rounded-tr-sm px-5 py-4 inline-block shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <div className="text-gray-100 font-medium">{message.content}</div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white text-sm font-medium shadow-lg">
              U
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default MessageBubble;
