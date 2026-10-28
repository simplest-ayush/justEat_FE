import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useState } from 'react';
import AuthSplitLayout from './AuthSplitLayout';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phone: '',
        role: 'CUSTOMER',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await register(formData);

            toast.success('Account created successfully!');
            navigate('/');
        } catch (error) {
            const message =
                error.response?.data?.message ||
                'Registration failed. Please try again.';

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthSplitLayout
            formTitle="Create Account"
            panelTitle="Join The Flavor Journey"
            panelDescription="Create your JustEat account to explore cuisines, save favorite restaurants, and place orders in just a few taps."
            showTopLogo={false}
            footer={
                <p className="text-center text-sm text-[#69747D]">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-bold text-[#8A7047] transition hover:text-[#6F5735]"
                    >
                        Log in
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Username */}
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Username
                    </label>

                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        minLength={4}
                        maxLength={50}
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />
                </div>

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
                        title="At least 8 characters, with upper, lower, digit, and special character"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />

                    <p className="mt-1.5 text-xs text-[#899198]">
                        8+ characters with uppercase, lowercase, number and special character.
                    </p>
                </div>

                {/* Full Name */}
                <div>
                    <label
                        htmlFor="fullName"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Full Name
                    </label>

                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        Phone
                    </label>

                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        title="Phone number must be exactly 10 digits"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    />
                </div>

                {/* Role */}
                <div>
                    <label
                        htmlFor="role"
                        className="mb-2 block text-sm font-bold text-[#26343F]"
                    >
                        I am a
                    </label>

                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-[#D7D3CA] bg-[#F8F8F6] px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                    >
                        <option value="CUSTOMER">Customer</option>
                        <option value="RESTAURANT_OWNER">
                            Restaurant Owner
                        </option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-2xl bg-[#17324D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting
                        ? 'Creating account...'
                        : 'Create Account'}
                </button>
            </form>
        </AuthSplitLayout>
    );
}