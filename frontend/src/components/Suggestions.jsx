export default function Suggestions({ suggestions }) {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#212536] to-[#23283a] shadow-lg p-8 mt-8">
      <h3 className="font-semibold text-lg text-indigo-400 mb-3">Suggestions</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions && suggestions.length > 0 ? (
          suggestions.map((item, idx) => (
            <li key={idx} className="cursor-pointer p-6 rounded-2xl bg-[#23283a] hover:border-pink-500 border border-transparent transition shadow group">
              <span className="block text-lg text-white/90 font-medium group-hover:text-pink-400 transition">{item}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-zinc-400">No suggestions available.</li>
        )}
      </ul>
    </section>
  );
}
