import { useAuth } from "../../app/AuthContext";
import { LogOut, UserRound, UtensilsCrossed } from "lucide-react";

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F1F4F5] via-[#F8F6F1] to-[#E7EEF2] px-4 py-8 sm:px-6">
            {/* Decorative background */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#17324D]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#C9A66B]/15 blur-3xl" />

            <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
                <div className="w-full overflow-hidden rounded-3xl border border-[#D8D2C6] bg-[#FFFEFB]/95 shadow-[0_20px_60px_rgba(23,50,77,0.12)] backdrop-blur-xl">
                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#17324D] via-[#1C3D59] to-[#234E70] px-6 py-8 text-white">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C9A66B]/15 blur-3xl" />

                        <div className="relative">
                            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#E8D5AD] ring-1 ring-white/10">
                                <UtensilsCrossed className="h-7 w-7" />
                            </div>

                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D8B878]">
                                JustEat
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight">
                                Welcome, {user.username}
                            </h1>

                            <p className="mt-2 text-sm text-slate-300">
                                Your account is ready. Let's get something
                                delicious.
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="mb-6 rounded-2xl border border-[#D8D2C6] bg-gradient-to-br from-[#F8F6F1] to-[#EDF2F4] p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17324D] text-white shadow-md">
                                    <UserRound className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7B8389]">
                                        Account Type
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-[#17324D]">
                                        {user.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[#D8D2C6] bg-white p-4">
                                <p className="text-xs text-[#7B8389]">
                                    Username
                                </p>
                                <p className="mt-1 truncate text-sm font-semibold text-[#17212B]">
                                    {user.username}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#D8D2C6] bg-white p-4">
                                <p className="text-xs text-[#7B8389]">
                                    Role
                                </p>
                                <p className="mt-1 truncate text-sm font-semibold text-[#17212B]">
                                    {user.role}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D1C6BE] bg-[#FAF5F2] py-3 text-sm font-semibold text-[#75483E] transition hover:border-[#B77968] hover:bg-[#F8EFEC] hover:shadow-md"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}