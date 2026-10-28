import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    createRestaurant,
    updateRestaurant,
    getMyRestaurants,
} from '../../api/ownerRestaurantApi';
import OwnerPageShell from './OwnerPageShell';
import NavBackButton from '../../components/NavBackButton';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
    name: '',
    cuisineType: '',
    description: '',
    address: '',
    city: '',
    phone: '',
};

export default function RestaurantFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;

        getMyRestaurants()
            .then((restaurants) => {
                const match = restaurants.find((r) => r.id === id);

                if (match) {
                    setFormData({
                        name: match.name,
                        cuisineType: match.cuisineType || '',
                        description: match.description || '',
                        address: match.address,
                        city: match.city || '',
                        phone: match.phone || '',
                    });
                } else {
                    toast.error('Restaurant not found.');
                }
            })
            .catch(() => toast.error('Could not load restaurant details.'))
            .finally(() => setIsLoading(false));
    }, [id, isEditMode]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isEditMode) {
                await updateRestaurant(id, formData);
                toast.success('Restaurant updated successfully.');
            } else {
                await createRestaurant(formData);
                toast.success('Restaurant registered successfully.');
            }

            navigate('/');
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Something went wrong. Please try again.';

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <OwnerPageShell
                title="Restaurant Setup"
                subtitle="Loading restaurant details..."
            >
                <div className="rounded-3xl border border-[#D9D2C3] bg-white p-8 text-center text-sm text-[#69747D] shadow-sm">
                    Loading...
                </div>
            </OwnerPageShell>
        );
    }

    return (
        <OwnerPageShell
            title={isEditMode ? 'Edit Restaurant' : 'Register a New Restaurant'}
            subtitle="Create a compelling restaurant profile so customers can discover and order quickly."
        >
            <div className="mb-5">
                <NavBackButton
                    onClick={() => navigate('/')}
                    label="Back to dashboard"
                    theme="owner"
                />
            </div>

            <div className="mx-auto max-w-2xl">
                <div className="overflow-hidden rounded-3xl border border-[#D9D2C3] bg-white shadow-sm">

                    {/* Form Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#263D4C] via-[#304B5B] to-[#3B5867] px-7 py-6">
                        <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#D6C7A9]/15 blur-2xl" />
                        <div className="absolute -bottom-20 left-20 h-36 w-36 rounded-full bg-white/5 blur-2xl" />

                        <div className="relative">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D9C7A2]">
                                {isEditMode
                                    ? 'Restaurant Profile'
                                    : 'New Restaurant'}
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-white">
                                {isEditMode
                                    ? 'Update your restaurant'
                                    : 'Tell customers about your restaurant'}
                            </h2>

                            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-200">
                                Keep your restaurant information clear and
                                inviting so customers know what to expect.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 p-7"
                    >
                        <FormField
                            label="Restaurant Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            placeholder="e.g. Spice Garden"
                        />

                        <FormField
                            label="Cuisine Type"
                            name="cuisineType"
                            value={formData.cuisineType}
                            onChange={handleChange}
                            placeholder="e.g. North Indian, Chinese"
                        />

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#3E4C55]">
                                Description
                            </label>

                            <textarea
                                name="description"
                                rows={4}
                                maxLength={500}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell customers what makes your restaurant special..."
                                className="w-full resize-none rounded-2xl border border-[#D9D2C3] bg-[#F8F6F1] px-4 py-3 text-sm leading-6 text-[#26343F] outline-none transition placeholder:text-[#9A9B99] focus:border-[#8B9CA5] focus:bg-white focus:ring-4 focus:ring-[#263D4C]/5"
                            />

                            <div className="mt-1.5 text-right text-xs text-[#9A9B99]">
                                {formData.description.length}/500
                            </div>
                        </div>

                        <div className="border-t border-[#E9E4DA] pt-5">
                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#8A7960]">
                                Location & Contact
                            </p>

                            <div className="space-y-5">
                                <FormField
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    maxLength={200}
                                    placeholder="Restaurant street address"
                                />

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <FormField
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="e.g. Delhi"
                                    />

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-[#3E4C55]">
                                            Phone
                                        </label>

                                        <input
                                            name="phone"
                                            type="tel"
                                            pattern="[0-9]{10}"
                                            maxLength={10}
                                            title="Phone number must be exactly 10 digits"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit number"
                                            className="w-full rounded-2xl border border-[#D9D2C3] bg-[#F8F6F1] px-4 py-3 text-sm text-[#26343F] outline-none transition placeholder:text-[#9A9B99] focus:border-[#8B9CA5] focus:bg-white focus:ring-4 focus:ring-[#263D4C]/5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="border-t border-[#E9E4DA] pt-5">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-2xl bg-gradient-to-r from-[#263D4C] to-[#385565] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#263D4C]/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : isEditMode
                                        ? 'Save Changes'
                                        : 'Register Restaurant'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </OwnerPageShell>
    );
}

function FormField({
    label,
    name,
    value,
    onChange,
    required = false,
    maxLength,
    placeholder,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-[#3E4C55]">
                {label}
                {required && (
                    <span className="ml-1 text-[#8A7960]">*</span>
                )}
            </label>

            <input
                name={name}
                type="text"
                required={required}
                maxLength={maxLength}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-[#D9D2C3] bg-[#F8F6F1] px-4 py-3 text-sm text-[#26343F] outline-none transition placeholder:text-[#9A9B99] focus:border-[#8B9CA5] focus:bg-white focus:ring-4 focus:ring-[#263D4C]/5"
            />
        </div>
    );
}