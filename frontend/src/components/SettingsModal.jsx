import { X } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function SettingsModal({ open, onClose }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const panel = isLight
    ? "bg-white border-zinc-200 text-zinc-900 shadow-xl"
    : "bg-[#151522] border-white/10 text-white shadow-2xl";
  const muted = isLight ? "text-zinc-500" : "text-gray-500";
  const sub = isLight ? "text-zinc-600" : "text-gray-300";
  const card = isLight ? "border-zinc-200 bg-zinc-50" : "border-white/5";
  const titleSm = isLight ? "text-zinc-900" : "text-white";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close settings"
      />
      <div className={`relative w-full max-w-md rounded-2xl border p-6 ${panel}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 id="settings-title" className="text-lg font-bold">
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-2 transition-colors ${isLight ? "hover:bg-zinc-100 text-zinc-500" : "hover:bg-white/10 text-gray-400"}`}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`space-y-4 text-sm ${sub}`}>
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`font-semibold mb-1 ${titleSm}`}>Notifications</p>
            <p className={`text-xs ${muted}`}>Manage alerts (local only — no backend).</p>
          </div>
          <div className={`rounded-xl border p-4 ${card}`}>
            <p className={`font-semibold mb-1 ${titleSm}`}>Appearance</p>
            <p className={`text-xs ${muted}`}>
              Use the sun / moon button in the sidebar to switch light or dark theme. Your choice is saved in
              this browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
