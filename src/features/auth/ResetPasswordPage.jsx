import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import AuthSplitLayout from './AuthSplitLayout';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tokenFromUrl = searchParams.get('token') || '';

    const [token, setToken] = useState(tokenFromUrl);
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await resetPassword(token, newPassword);

            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Could not reset password. The link may have expired.';

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthSplitLayout
            formTitle="Set New Password"
            panelTitle="One Step Away"
            panelDescription="Choose a strong new password to keep your JustEat account safe and continue exploring your favorite meals."
            bottomLink={{ to: '/login', label: 'Back to login' }}
            showTopLogo={false}
        >
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Reset Token */}
                <div>
                    <label
                        htmlFor="token"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Reset Token
                    </label>

                    <input
                        id="token"
                        type="text"
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste the token from your email"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />
                </div>

                {/* New Password */}
                <div>
                    <label
                        htmlFor="newPassword"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        New Password
                    </label>

                    <input
                        id="newPassword"
                        type="password"
                        required
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
                        title="At least 8 characters, with upper, lower, digit, and special character"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />

                    <p className="mt-1.5 text-xs text-[#899198]">
                        8+ characters with uppercase, lowercase, number and special character.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-2xl bg-[#17324D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </AuthSplitLayout>
    );
}