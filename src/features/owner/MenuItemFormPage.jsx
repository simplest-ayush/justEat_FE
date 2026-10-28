import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createMenuItem, updateMenuItem, getMenuItems } from '../../api/ownerMenuApi';
import OwnerPageShell from './OwnerPageShell';
import NavBackButton from '../../components/NavBackButton';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
    name: '',
    description: '',
    price: '',
    category: '',
};

export default function MenuItemFormPage() {
    const { restaurantId, itemId } = useParams();
    const isEditMode = Boolean(itemId);
    const navigate = useNavigate();

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isEditMode) return;

        getMenuItems(restaurantId)
            .then((items) => {
                const match = items.find((i) => i.id === itemId);

                if (match) {
                    setFormData({
                        name: match.name,
                        description: match.description || '',
                        price: match.price,
                        category: match.category || '',
                    });
                } else {
                    toast.error('Menu item not found.');
                }
            })
            .catch(() => {
                toast.error('Could not load item details.');
            })
            .finally(() => setIsLoading(false));
    }, [restaurantId, itemId, isEditMode]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
        };

        try {
            if (isEditMode) {
                await updateMenuItem(restaurantId, itemId, payload);
                toast.success('Menu item updated successfully.');
            } else {
                await createMenuItem(restaurantId, payload);
                toast.success('Menu item added successfully.');
            }

            navigate(`/owner/restaurants/${restaurantId}/menu`);
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
                title="Menu Item"
                subtitle="Loading menu item details..."
            >
                <div className="rounded-2xl border border-[#D9D2C3] bg-white p-8 text-center text-sm text-[#66717A] shadow-sm">
                    Loading...
                </div>
            </OwnerPageShell>
        );
    }

    return (
        <OwnerPageShell
            title={isEditMode ? 'Edit Menu Item' : 'Add Menu Item'}
            subtitle="Create mouth-watering listings with clear details and pricing."
        >
            <div className="mb-6">
                <NavBackButton
                    onClick={() =>
                        navigate(`/owner/restaurants/${restaurantId}/menu`)
                    }
                    label="Back to menu"
                    theme="owner"
                />
            </div>

            <div className="mx-auto max-w-xl rounded-3xl border border-[#D9D2C3] bg-white p-8 shadow-sm">

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#26343F]">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            maxLength={100}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Butter Chicken"
                            className="w-full rounded-2xl border border-[#D9D2C3] bg-[#F8F7F3] px-4 py-3.5 text-sm text-[#26343F] outline-none transition placeholder:text-[#9AA1A5] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#26343F]">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            maxLength={500}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the dish..."
                            className="w-full resize-none rounded-2xl border border-[#D9D2C3] bg-[#F8F7F3] px-4 py-3.5 text-sm text-[#26343F] outline-none transition placeholder:text-[#9AA1A5] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#26343F]">
                            Price
                        </label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g. 249"
                            className="w-full rounded-2xl border border-[#D9D2C3] bg-[#F8F7F3] px-4 py-3.5 text-sm text-[#26343F] outline-none transition placeholder:text-[#9AA1A5] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#26343F]">
                            Category
                        </label>
                        <input
                            name="category"
                            type="text"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Main Course"
                            className="w-full rounded-2xl border border-[#D9D2C3] bg-[#F8F7F3] px-4 py-3.5 text-sm text-[#26343F] outline-none transition placeholder:text-[#9AA1A5] focus:border-[#17324D] focus:bg-white focus:ring-4 focus:ring-[#17324D]/10"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-2xl bg-[#17324D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? 'Saving...'
                            : isEditMode
                                ? 'Save Changes'
                                : 'Add Item'}
                    </button>

                </form>
            </div>
        </OwnerPageShell>
    );
}