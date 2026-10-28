export default function NavBackButton({ onClick, label, theme = 'customer' }) {
    const themeClasses =
        theme === 'owner'
            ? 'border-amber-300 bg-white text-amber-900 hover:bg-amber-100 focus-visible:ring-amber-200'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:ring-red-200';

    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 ${themeClasses}`}
        >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-xs">←</span>
            <span>{label}</span>
        </button>
    );
}
