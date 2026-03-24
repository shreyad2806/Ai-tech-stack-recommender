const examples = [
  {
    title: "AI Resume Screening",
    desc: "LLM-powered candidate ranking system",
  },
  {
    title: "Fintech Fraud Detection",
    desc: "Real-time transaction anomaly detection",
  },
  {
    title: "Healthcare Appointment System",
    desc: "Scalable booking and patient management",
  },
];

export default function ExampleCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {examples.map((ex) => (
        <div
          key={ex.title}
          className="p-5 transition border cursor-pointer bg-slate-900 border-slate-800 rounded-xl hover:border-indigo-500"
        >
          <h3 className="mb-1 font-medium">{ex.title}</h3>
          <p className="text-sm text-slate-400">{ex.desc}</p>
        </div>
      ))}
    </div>
  );
}
