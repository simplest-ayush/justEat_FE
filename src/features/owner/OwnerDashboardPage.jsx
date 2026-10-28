import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyRestaurants, deleteRestaurant } from '../../api/ownerRestaurantApi';
import OwnerPageShell from './OwnerPageShell';
import ConfirmModal from '../../components/ConfirmModal';
import { CircleX, Pencil, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnerDashboardPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    useEffect(() => {
        loadRestaurants();
    }, []);

    async function loadRestaurants() {
        setIsLoading(true);

        try {
            const data = await getMyRestaurants();
            setRestaurants(data);
        } catch {
            toast.error('Could not load your restaurants.');
        } finally {
            setIsLoading(false);
        }
    }

    function handleDeleteClick(id) {
        setDeleteModal({ open: true, id });
    }

    async function handleConfirmDelete() {
        const id = deleteModal.id;

        setDeleteModal({ open: false, id: null });

        try {
            await deleteRestaurant(id);

            setRestaurants((prev) => prev.filter((r) => r.id !== id));

            toast.success('Restaurant deleted successfully.');
        } catch {
            toast.error('Could not delete the restaurant. Please try again.');
        }
    }

    return (
        <>
            <OwnerPageShell
                title="Owner Dashboard"
                subtitle="Manage your restaurants, menus, and incoming orders with a focused control panel."
                actions={
                    <Link
                        to="/owner/restaurants/new"
                        className="rounded-2xl bg-[#17324D] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41]"
                    >
                        <Plus />
                    </Link>
                }
            >
                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                    <OwnerMetric
                        label="Total Restaurants"
                        value={restaurants.length}
                    />

                    <OwnerMetric
                        label="Active Cities"
                        value={
                            new Set(
                                restaurants
                                    .map((restaurant) => restaurant.city)
                                    .filter(Boolean)
                            ).size
                        }
                    />

                    <OwnerMetric
                        label="Cuisine Types"
                        value={
                            new Set(
                                restaurants
                                    .map((restaurant) => restaurant.cuisineType)
                                    .filter(Boolean)
                            ).size
                        }
                    />
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((skeleton) => (
                            <div
                                key={skeleton}
                                className="h-24 animate-pulse rounded-3xl bg-[#E8E3D9]"
                            />
                        ))}
                    </div>
                ) : restaurants.length === 0 ? (
                    <div className="rounded-3xl border border-[#D9D2C3] bg-white p-8 text-sm text-[#66717A] shadow-sm">
                        You haven&apos;t registered any restaurants yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {restaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="flex items-center justify-between rounded-3xl border border-[#D9D2C3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-[#26343F]">
                                        {restaurant.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-[#69747D]">
                                        {restaurant.cuisineType || 'Cuisine not specified'}
                                        {' · '}
                                        {restaurant.city || 'City not specified'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        to={`/owner/restaurants/${restaurant.id}/menu`}
                                        className="rounded-xl bg-[#F1EDE5] px-3 py-2 text-sm font-bold text-[#5E6670] transition hover:bg-[#E5DFD3]"
                                    >
                                        Manage Menu
                                    </Link>

                                    <Link
                                        to={`/owner/restaurants/${restaurant.id}/edit`}
                                        className="rounded-xl border border-[#CFC6B6] bg-[#FAF9F6] px-3 py-2 text-sm font-bold text-[#26343F] transition hover:bg-[#F1EDE5]"
                                    >
                                        <Pencil />
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleDeleteClick(restaurant.id)
                                        }
                                        className="rounded-xl border border-[#D9B8B3] bg-white px-3 py-2 text-sm font-bold text-[#9A4F48] transition hover:bg-[#FAEEEE]"
                                    >
                                        <CircleX />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </OwnerPageShell>

            <ConfirmModal
                open={deleteModal.open}
                title="Delete Restaurant?"
                message="This will permanently remove the restaurant and all its data. This action cannot be undone."
                confirmLabel="Yes, Delete"
                cancelLabel="Keep It"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() =>
                    setDeleteModal({ open: false, id: null })
                }
            />
        </>
    );
}

function OwnerMetric({ label, value }) {
    return (
        <div className="rounded-3xl border border-[#D9D2C3] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8A7047]">
                {label}
            </p>

            <p className="mt-2 text-3xl font-bold text-[#26343F]">
                {value}
            </p>
        </div>
    );
}