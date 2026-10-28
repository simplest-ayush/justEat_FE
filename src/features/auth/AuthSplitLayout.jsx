import { Link } from 'react-router-dom';

export default function AuthSplitLayout({
    formTitle,
    panelTitle,
    panelDescription,
    children,
    footer,
    bottomLink,
    showTopLogo = true,
}) {
    return (
        <div className="min-h-screen bg-[#F3F2EE] lg:grid lg:grid-cols-2">
            {/* Mobile Logo */}
            {showTopLogo ? (
                <div className="flex items-center justify-center border-b border-[#DDD9D1] bg-[#FFFEFB] px-5 py-5 lg:hidden">
                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17324D] text-sm font-bold text-[#E8D5AD] shadow-md">
                            J
                        </div>

                        <span className="text-lg font-bold tracking-tight text-[#17324D]">
                            JustEat
                        </span>
                    </Link>
                </div>
            ) : null}

            <section
                className="relative hidden overflow-hidden lg:flex"
                style={{
                    backgroundImage:
                        "linear-gradient(135deg, rgba(10, 22, 35, 0.88), rgba(23, 50, 77, 0.68)), url('/home.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Decorative gradients */}
                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#C9A66B]/15 blur-3xl" />
                <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#17324D]/40 blur-3xl" />

                <div className="relative flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">
                    <Link
                        to="/"
                        className="flex w-fit items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E8D5AD]/30 bg-white/10 text-lg font-bold text-[#E8D5AD] backdrop-blur-sm">
                            J
                        </div>

                        <span className="text-xl font-bold tracking-tight text-white">
                            JustEat
                        </span>
                    </Link>

                    <div className="max-w-lg">
                        <div className="mb-5 h-1 w-12 rounded-full bg-[#C9A66B]" />

                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#D8BE8A]">
                            JustEat Experience
                        </p>

                        <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                            {panelTitle}
                        </h1>

                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 xl:text-base">
                            {panelDescription}
                        </p>
                    </div>

                    <p className="text-xs text-slate-400">
                        Good food. Great places. One seamless experience.
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="flex items-center justify-center bg-[#F3F2EE] px-5 py-8 sm:px-8 lg:px-12">
                <div className="w-full max-w-md">
                    <div className="overflow-hidden rounded-3xl border border-[#D8D2C6] bg-[#FFFEFB] shadow-[0_20px_60px_rgba(23,50,77,0.10)]">
                        <div className="h-1.5 bg-gradient-to-r from-[#17324D] via-[#C9A66B] to-[#17324D]" />

                        <div className="p-6 sm:p-8">
                            <div className="mb-8 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17324D] text-lg font-bold text-[#E8D5AD] shadow-lg shadow-[#17324D]/20">
                                    J
                                </div>

                                <p className="text-xl font-bold tracking-tight text-[#17324D]">
                                    JustEat
                                </p>

                                <div className="mx-auto mt-3 h-px w-10 bg-[#C9A66B]" />
                            </div>

                            <h2 className="text-2xl font-bold text-[#17212B]">
                                {formTitle}
                            </h2>

                            <div className="mt-6">
                                {children}
                            </div>

                            {footer ? (
                                <div className="mt-6">
                                    {footer}
                                </div>
                            ) : null}

                            {bottomLink ? (
                                <p className="mt-6 border-t border-[#E5E1D9] pt-5 text-center text-sm text-[#69747D]">
                                    <Link
                                        to={bottomLink.to}
                                        className="font-bold text-[#8A7047] transition hover:text-[#6F5735]"
                                    >
                                        {bottomLink.label}
                                    </Link>
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <p className="mt-5 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-[#9A9FA2]">
                        A better way to discover food
                    </p>
                </div>
            </section>
        </div>
    );
}