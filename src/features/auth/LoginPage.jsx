import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useState } from 'react';
import AuthSplitLayout from './AuthSplitLayout';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await login(username, password);

            toast.success('Welcome back! Login successful.');
            navigate('/');
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'Login failed. Please try again.';

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthSplitLayout
            formTitle="Welcome Back"
            panelTitle="Taste The Best, Delivered Fast"
            panelDescription="Discover top-rated restaurants, favorite your go-to meals, and get delicious food delivered with a seamless experience."
            showTopLogo={false}
            footer={
                <>
                    <p className="text-center text-sm text-[#69747D]">
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/register"
                            className="font-bold text-[#8A7047] transition hover:text-[#6F5735]"
                        >
                            Create one
                        </Link>
                    </p>

                    <p className="mt-3 text-center text-sm">
                        <Link
                            to="/forgot-password"
                            className="font-medium text-[#7B858C] transition hover:text-[#17324D]"
                        >
                            Forgot password?
                        </Link>
                    </p>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Username
                    </label>

                    <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-2xl bg-[#17324D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </AuthSplitLayout>
    );
}