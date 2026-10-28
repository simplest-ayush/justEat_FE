import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useCart } from '../../app/CartContext';
import {
    Globe,
    LogOut,
    RotateCcwClock,
    Settings2,
    ShoppingCart,
} from 'lucide-react';

const navLinkBase =
    'rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A66B]/40';

export default function CustomerPageShell({ title, subtitle, children }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { itemCount } = useCart();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    const getNavClass = (isActive) =>
        `${navLinkBase} ${
            isActive
                ? 'bg-gradient-to-r from-[#17324D] to-[#234E70] text-white shadow-lg shadow-[#17324D]/20'
                : 'bg-[#EEF2F4] text-[#40515D] hover:bg-[#E1E8EC] hover:text-[#17324D]'
        }`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F1F4F5] via-[#F7F6F2] to-[#E8EEF1]">
            {/* Hero */}
            <section className="relative overflow-hidden bg-[#122A41]">
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        backgroundImage:
                            "linear-gradient(120deg, rgba(18, 42, 65, 0.94), rgba(35, 78, 112, 0.55)), url('/home.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Decorative glow */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#C9A66B]/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#6D9BB8]/10 blur-3xl" />

                <div className="relative mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D8B878]">
                        JustEat Experience
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {title}
                    </h1>

                    {subtitle ? (
                        <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
            </section>

            {/* Navigation */}
            <header className="sticky top-0 z-30 border-b border-[#D5DDE1] bg-[#FFFEFB]/95 shadow-[0_4px_20px_rgba(23,50,77,0.06)] backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
                    {/* Logo + User */}
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

                            <span className="text-sm font-bold text-[#17324D]">
                                JustEat
                            </span>
                        </Link>

                        <span className="rounded-full border border-[#D8D2C6] bg-[#F3F0E8] px-3 py-1 text-xs font-semibold text-[#234E70]">
                            Hi, {user?.username}
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-wrap items-center gap-2">
                        <NavLink
                            to="/"
                            end
                            title="Browse Restaurants"
                            className={({ isActive }) =>
                                getNavClass(isActive)
                            }
                        >
                            <Globe className="h-5 w-5" />
                        </NavLink>

                        <NavLink
                            to="/orders"
                            title="My Orders"
                            className={({ isActive }) =>
                                getNavClass(isActive)
                            }
                        >
                            <RotateCcwClock className="h-5 w-5" />
                        </NavLink>

                        <NavLink
                            to="/preferences"
                            title="Preferences"
                            className={({ isActive }) =>
                                getNavClass(isActive)
                            }
                        >
                            <Settings2 className="h-5 w-5" />
                        </NavLink>

                        <NavLink
                            to="/cart"
                            title="Shopping Cart"
                            className={({ isActive }) =>
                                getNavClass(isActive)
                            }
                        >
                            <span className="relative inline-flex">
                                <ShoppingCart className="h-5 w-5" />

                                {itemCount > 0 && (
                                    <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#FFFEFB] bg-[#C9A66B] px-1 text-[10px] font-bold text-[#17324D] shadow-sm">
                                        {itemCount}
                                    </span>
                                )}
                            </span>
                        </NavLink>
                    </nav>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="rounded-xl border border-[#C9D4DA] bg-white px-4 py-2 text-sm font-semibold text-[#40515D] shadow-sm transition hover:border-[#B77968] hover:bg-[#F8EFEC] hover:text-[#75483E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A66B]/40"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Page Content */}
            <main className="mx-auto w-full max-w-6xl px-6 py-8">
                {children}
            </main>
        </div>
    );
}