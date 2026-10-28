export default function ConfirmModal({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
}) {
    if (!open) return null;

    const isDanger = variant === 'danger';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Card */}
            <div
                className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
            >

                <div className="p-6">
                    {/* Icon */}
                    <div
                        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDanger ? 'bg-red-50' : 'bg-amber-50'
                            }`}
                    >
                        {isDanger ? (
                            /* Trash icon */
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-7 w-7 text-red-500"
                                aria-hidden="true"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                        ) : (
                            /* Switch / swap icon for cart conflict */
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-7 w-7 text-amber-500"
                                aria-hidden="true"
                            >
                                <path d="M17 1l4 4-4 4" />
                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <path d="M7 23l-4-4 4-4" />
                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                        )}
                    </div>

                    {/* Text */}
                    <h2
                        id="confirm-modal-title"
                        className="text-center text-lg font-semibold text-slate-900"
                    >
                        {title}
                    </h2>
                    {message && (
                        <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
                            {message}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
                        <button
                            onClick={onCancel}
                            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white shadow-lg transition ${isDanger
                                    ? 'bg-red-600 shadow-red-600/20 hover:bg-red-700'
                                    : 'bg-amber-500 shadow-amber-400/25 hover:bg-amber-600'
                                }`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
