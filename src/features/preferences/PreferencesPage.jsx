import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import {
    getPreferences,
    updatePreferences,
    removeFavorite,
} from '../../api/preferenceApi';
import CustomerPageShell from '../customer/CustomerPageShell';
import NavBackButton from '../../components/NavBackButton';
import { Check, Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DIETARY_OPTIONS = [
    'VEGETARIAN',
    'VEGAN',
    'GLUTEN_FREE',
    'LACTOSE_FREE',
    'NUT_FREE',
];

export default function PreferencesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [preferredCuisines, setPreferredCuisines] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    async function loadPreferences() {
        setIsLoading(true);

        try {
            const data = await getPreferences(user.id);

            setPreferredCuisines(
                (data.preferredCuisines || []).join(', ')
            );

            setDietaryRestrictions(data.dietaryRestrictions || []);
            setFavorites(data.favoriteRestaurants || []);
        } catch {
            toast.error('Could not load preferences.');
        } finally {
            setIsLoading(false);
        }
    }

    function toggleDietary(option) {
        setDietaryRestrictions((prev) =>
            prev.includes(option)
                ? prev.filter((d) => d !== option)
                : [...prev, option]
        );
    }

    async function handleSave(e) {
        e.preventDefault();
        setIsSaving(true);

        const cuisinesArray = preferredCuisines
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

        try {
            await updatePreferences(user.id, {
                preferredCuisines: cuisinesArray,
                dietaryRestrictions,
            });

            toast.success('Preferences saved successfully.');
        } catch {
            toast.error('Could not save preferences.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleRemoveFavorite(restaurantId) {
        try {
            await removeFavorite(user.id, restaurantId);

            setFavorites((prev) =>
                prev.filter((f) => f.restaurant.id !== restaurantId)
            );

            toast.success('Removed from favorites.');
        } catch {
            toast.error('Could not remove favorite.');
        }
    }

    if (isLoading) {
        return (
            <CustomerPageShell
                title="Your Preferences"
                subtitle="Loading your food preferences..."
            >
                <div className="rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F1F3F2] p-10 text-center text-sm text-[#68747C] shadow-[0_8px_28px_rgba(23,50,77,0.07)]">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D8D2C6] border-t-[#17324D]" />
                    Loading your preferences...
                </div>
            </CustomerPageShell>
        );
    }

    return (
        <CustomerPageShell
            title="Your Preferences"
            subtitle="Customize your cuisine tastes, dietary needs, and favorite restaurants."
        >
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <NavBackButton
                        onClick={() => navigate('/')}
                        label="Back"
                    />
                </div>

                {/* Preferences Card */}
                <div className="relative mb-6 overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] via-[#F8F7F3] to-[#EEF2F3] p-6 shadow-[0_10px_35px_rgba(23,50,77,0.08)] sm:p-8">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C9A66B]/10 blur-3xl" />

                    <div className="relative">
                        <div className="mb-7 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17324D] text-[#E8D5AD] shadow-lg shadow-[#17324D]/15">
                                <Heart className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A7047]">
                                    Personalization
                                </p>
                                <h1 className="text-xl font-bold text-[#17212B]">
                                    Food Preferences
                                </h1>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-7">
                            {/* Cuisines */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#26343F]">
                                    Preferred Cuisines
                                </label>

                                <p className="mb-3 text-xs text-[#7B858C]">
                                    Add your favorite cuisines separated by commas.
                                </p>

                                <input
                                    type="text"
                                    value={preferredCuisines}
                                    onChange={(e) =>
                                        setPreferredCuisines(e.target.value)
                                    }
                                    placeholder="Italian, Chinese, Mexican"
                                    className="w-full rounded-2xl border border-[#D7D3CA] bg-white px-4 py-3.5 text-sm text-[#26343F] shadow-sm outline-none transition placeholder:text-[#A1A7AA] focus:border-[#17324D] focus:ring-4 focus:ring-[#17324D]/10"
                                />
                            </div>

                            {/* Dietary Restrictions */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-[#26343F]">
                                    Dietary Restrictions
                                </label>

                                <p className="mb-3 text-xs text-[#7B858C]">
                                    Select any dietary preferences that apply to you.
                                </p>

                                <div className="flex flex-wrap gap-2.5">
                                    {DIETARY_OPTIONS.map((option) => {
                                        const selected =
                                            dietaryRestrictions.includes(option);

                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() =>
                                                    toggleDietary(option)
                                                }
                                                className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                                                    selected
                                                        ? 'bg-[#17324D] text-white shadow-md shadow-[#17324D]/20'
                                                        : 'border border-[#D7D3CA] bg-white text-[#59656E] hover:border-[#B9B2A5] hover:bg-[#F3F0EA]'
                                                }`}
                                            >
                                                {selected && (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}

                                                {option.replace(/_/g, ' ')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Save */}
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full rounded-2xl bg-[#17324D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving
                                    ? 'Saving preferences...'
                                    : 'Save Preferences'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Favorites */}
                <div className="overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F1F3F2] p-6 shadow-[0_10px_35px_rgba(23,50,77,0.08)] sm:p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0E7D6] text-[#8A7047]">
                                <Heart className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A7047]">
                                    Saved Places
                                </p>
                                <h2 className="text-xl font-bold text-[#17212B]">
                                    Favorite Restaurants
                                </h2>
                            </div>
                        </div>

                        <span className="rounded-full bg-[#E8EDF0] px-3 py-1.5 text-xs font-bold text-[#526572]">
                            {favorites.length}
                        </span>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#D3CEC4] bg-white/70 p-8 text-center">
                            <Heart className="mx-auto mb-3 h-7 w-7 text-[#B4B8BA]" />

                            <p className="font-semibold text-[#59656E]">
                                No favorites yet.
                            </p>

                            <p className="mt-1 text-xs text-[#8A949A]">
                                Restaurants you save will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {favorites.map((fav) => (
                                <div
                                    key={fav.restaurant.id}
                                    className="group flex items-center justify-between rounded-2xl border border-[#DDD9D1] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C9A66B] hover:shadow-md"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF0F3] text-[#17324D]">
                                            <Heart className="h-4 w-4 fill-current" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-bold text-[#26343F]">
                                                {fav.restaurant.name}
                                            </p>

                                            {fav.restaurant.city && (
                                                <p className="mt-0.5 text-xs text-[#818A90]">
                                                    {fav.restaurant.city}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleRemoveFavorite(
                                                fav.restaurant.id
                                            )
                                        }
                                        className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8B6A6A] transition hover:bg-[#F6EAEA] hover:text-[#A54B4B]"
                                        title="Remove favorite"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerPageShell>
    );
}