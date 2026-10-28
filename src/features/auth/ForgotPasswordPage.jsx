import { useState } from 'react';
import { forgotPassword } from '../../api/authApi';
import AuthSplitLayout from './AuthSplitLayout';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await forgotPassword(email);

            setSubmitted(true);
            toast.success('Reset link sent! Check your inbox.');
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthSplitLayout
            formTitle="Reset Password"
            panelTitle="Secure Your Account"
            panelDescription="No worries. Enter your email and we will send you reset instructions to get you back in quickly."
            bottomLink={{ to: '/login', label: 'Back to login' }}
            showTopLogo={false}
        >
            {submitted ? (
                <div className="rounded-2xl border border-[#D8D2C6] bg-gradient-to-br from-[#F3F6F4] to-[#EAF0F3] p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#17324D] text-[#E8D5AD]">
                        ✓
                    </div>

                    <h3 className="font-bold text-[#26343F]">
                        Check your inbox
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#68747C]">
                        If that email exists, a reset link has been sent.
                        Check your inbox to continue.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#26343F]">
                            Email Address
                        </label>

                        <p className="mb-3 text-xs text-[#7B858C]">
                            Enter the email associated with your JustEat account.
                        </p>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-1 w-full rounded-2xl bg-[#17324D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? 'Sending reset link...'
                            : 'Send Reset Link'}
                    </button>
                </form>
            )}
        </AuthSplitLayout>
    );
}