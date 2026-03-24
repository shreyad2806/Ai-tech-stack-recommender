export default function ResultPanel({ result }) {
  const formatCategoryName = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const renderTechItems = (value) => {
    if (typeof value === 'string') {
      // Split by commas and clean up
      const items = value.split(',').map(item => item.trim()).filter(item => item);
      return (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-pink-600/20 
                         border border-pink-500/30 rounded-full text-sm text-pink-300
                         hover:from-pink-500/30 hover:to-pink-600/30 transition-all"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-pink-600/20 
                         border border-pink-500/30 rounded-full text-sm text-pink-300
                         hover:from-pink-500/30 hover:to-pink-600/30 transition-all"
            >
              {typeof item === 'object' ? item.name || item.title || JSON.stringify(item) : item}
            </span>
          ))}
        </div>
      );
    }
    
    return <p className="text-gray-300 text-sm leading-relaxed">{String(value)}</p>;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'frontend': '🎨',
      'backend': '⚙️',
      'database': '🗄️',
      'ai': '🤖',
      'deployment': '🚀',
      'architecture': '🏗️',
      'tools': '🛠️'
    };
    
    const lowerCategory = category.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerCategory.includes(key)) return icon;
    }
    return '📋';
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Your Recommended Tech Stack
        </h2>
        <p className="text-gray-400">
          AI-powered recommendations tailored to your project requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(result).map(([key, value]) => (
          <div
            key={key}
            className="bg-black border border-[#262626] rounded-xl p-6 hover:border-pink-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-lg">{getCategoryIcon(key)}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">
                {formatCategoryName(key)}
              </h3>
            </div>
            
            <div className="space-y-3">
              {renderTechItems(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-medium hover:from-pink-400 hover:to-pink-500 transition-all transform hover:scale-[1.02] flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M8 12H16M12 8V16M3 12C3 13.1046 3.20933 14.2034 3.62189 15.2361C4.03444 16.2689 4.64252 17.2165 5.41301 18.0201C6.1835 18.8236 7.10045 19.4688 8.10896 19.8961C9.11747 20.3234 10.2019 20.5247 11.2859 20.4891C12.3699 20.4535 13.4415 20.1818 14.4239 19.6893C15.4063 19.1968 16.2832 18.4929 17.0038 17.6416C17.7244 16.7903 18.2741 15.8083 18.6224 14.749C18.9706 13.6897 19.1105 12.5735 19.034 11.4615C18.9575 10.3495 18.666 9.26336 18.1761 8.26343C17.6862 7.2635 17.007 6.36923 16.1732 5.63293C15.3395 4.89663 14.3669 4.33168 13.313 3.96558C12.2591 3.59948 11.1445 3.43948 10.0308 3.49339C8.9171 3.5473 7.82411 3.81413 6.81238 4.27967C5.80065 4.74521 4.88955 5.40046 4.12811 6.20803" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refine Recommendations
        </button>
        
        <button className="px-6 py-3 bg-[#262626] text-white rounded-xl font-medium hover:bg-[#333333] transition-all flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export Stack
        </button>
      </div>
    </div>
  );
}
