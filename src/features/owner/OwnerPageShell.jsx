import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { LayoutDashboard, LogOut, RotateCcwClock } from 'lucide-react';

const navLinkBase =
    'rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C7A2]';

export default function OwnerPageShell({
    title,
    subtitle,
    actions,
    children,
}) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-[#F5F3EE]">
            {/* Page Hero */}
            <section className="relative overflow-hidden border-b border-[#D9D2C3] bg-gradient-to-br from-[#E9E4DA] via-[#F3F0E9] to-[#E5E8E7]">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D6C7A9]/30 blur-3xl" />
                <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[#B8C5C9]/25 blur-3xl" />

                <div className="relative mx-auto max-w-6xl px-6 py-10">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#756548]">
                        Owner Studio
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#26343F] sm:text-4xl">
                        {title}
                    </h1>

                    {subtitle ? (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#69747D] sm:text-base">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
            </section>

            {/* Navigation */}
            <header className="sticky top-0 z-30 border-b border-[#D9D2C3]/80 bg-[#F8F6F1]/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
                    {/* Brand */}
                    <div className="mr-auto flex items-center gap-3">
                        <Link
                            to="/"
                            className="group flex items-center gap-2 rounded-xl px-2 py-1.5 transition"
                            title="Go to home"
                        >
                            <img
                                src="/logo.jpg"
                                alt="JustEat logo"
                                className="h-8 w-8 rounded-md object-cover"
                            />

                            <span className="text-sm font-bold text-[#26343F]">
                                JustEat
                            </span>
                        </Link>

                        <span className="rounded-full border border-[#D9D2C3] bg-[#EEE9DF] px-3 py-1 text-xs font-semibold text-[#756548]">
                            Hi, {user?.username}
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-wrap items-center gap-2">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `${navLinkBase} ${
                                    isActive
                                        ? 'bg-[#263D4C] text-white shadow-md shadow-[#263D4C]/20'
                                        : 'border border-[#D9D2C3] bg-white text-[#52616B] hover:bg-[#EEE9DF] hover:text-[#26343F]'
                                }`
                            }
                        >
                            <LayoutDashboard />
                        </NavLink>

                        <NavLink
                            to="/owner/orders"
                            className={({ isActive }) =>
                                `${navLinkBase} ${
                                    isActive
                                        ? 'bg-[#263D4C] text-white shadow-md shadow-[#263D4C]/20'
                                        : 'border border-[#D9D2C3] bg-white text-[#52616B] hover:bg-[#EEE9DF] hover:text-[#26343F]'
                                }`
                            }
                        >
                            <RotateCcwClock />
                        </NavLink>
                    </nav>

                    {/* Page Actions */}
                    {actions ? (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    ) : null}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-[#D2CCBF] bg-white px-4 py-2 text-sm font-semibold text-[#52616B] shadow-sm transition hover:bg-[#EEE9DF] hover:text-[#26343F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C7A2]"
                    >
                        <LogOut />
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto w-full max-w-6xl px-6 py-8">
                {children}
            </main>
        </div>
    );
}