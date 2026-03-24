const examples = [
  {
    title: "AI Resume Screening",
    desc: "LLM-powered candidate ranking system",
    icon: "🤖",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    title: "Fintech Fraud Detection", 
    desc: "Real-time transaction anomaly detection",
    icon: "💳",
    gradient: "from-green-500 to-emerald-600"
  },
  {
    title: "Healthcare Platform",
    desc: "Scalable booking and patient management",
    icon: "🏥",
    gradient: "from-red-500 to-pink-600"
  },
  {
    title: "E-commerce Marketplace",
    desc: "Multi-vendor platform with real-time inventory",
    icon: "🛒",
    gradient: "from-orange-500 to-yellow-600"
  },
  {
    title: "Social Media Analytics",
    desc: "AI-driven sentiment analysis dashboard",
    icon: "📊",
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    title: "EdTech Learning Platform",
    desc: "Personalized course recommendation system",
    icon: "🎓",
    gradient: "from-cyan-500 to-blue-600"
  }
];

export default function ExampleCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {examples.map((example, index) => (
        <div
          key={example.title}
          className="group relative bg-[#1a1a1a] border border-[#262626] rounded-xl p-6 cursor-pointer
                     transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/50
                     hover:shadow-lg hover:shadow-pink-500/10"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Gradient border effect on hover */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               style={{
                 backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                 '--tw-gradient-from': `rgb(${example.gradient.includes('blue') ? '59, 130, 246' : 
                                         example.gradient.includes('green') ? '34, 197, 94' :
                                         example.gradient.includes('red') ? '239, 68, 68' :
                                         example.gradient.includes('orange') ? '249, 115, 22' :
                                         example.gradient.includes('purple') ? '168, 85, 247' :
                                         '6, 182, 212'})`,
                 '--tw-gradient-to': `rgb(${example.gradient.includes('purple') ? '168, 85, 247' :
                                        example.gradient.includes('emerald') ? '16, 185, 129' :
                                        example.gradient.includes('pink') ? '236, 72, 153' :
                                        example.gradient.includes('yellow') ? '245, 158, 11' :
                                        example.gradient.includes('indigo') ? '99, 102, 241' :
                                        '37, 99, 235'})`
               }}>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${example.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-2xl">{example.icon}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors duration-300">
              {example.title}
            </h3>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              {example.desc}
            </p>
            
            <div className="mt-4 flex items-center text-pink-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Try this example</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
