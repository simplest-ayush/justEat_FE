import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getMenuItems, deleteMenuItem, markSpecial } from '../../api/ownerMenuApi';
import OwnerPageShell from './OwnerPageShell';
import NavBackButton from '../../components/NavBackButton';
import ConfirmModal from '../../components/ConfirmModal';
import { CircleX, Pencil, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MenuManagementPage() {
    const { restaurantId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    useEffect(() => {
        loadItems();
    }, [restaurantId]);

    async function loadItems() {
        setIsLoading(true);

        try {
            const data = await getMenuItems(restaurantId);
            setItems(data);
        } catch {
            toast.error('Could not load menu items.');
        } finally {
            setIsLoading(false);
        }
    }

    function handleDeleteClick(itemId) {
        setDeleteModal({ open: true, id: itemId });
    }

    async function handleConfirmDelete() {
        const itemId = deleteModal.id;

        setDeleteModal({ open: false, id: null });

        try {
            await deleteMenuItem(restaurantId, itemId);

            setItems((prev) => prev.filter((i) => i.id !== itemId));

            toast.success('Menu item deleted successfully.');
        } catch {
            toast.error('Could not delete the item. Please try again.');
        }
    }

    async function handleToggleSpecial(item) {
        try {
            const updated = await markSpecial(restaurantId, item.id, {
                special: !item.special,
                specialUntil: null,
            });

            setItems((prev) =>
                prev.map((i) => (i.id === item.id ? updated : i))
            );

            toast.success(
                item.special
                    ? 'Item removed from specials.'
                    : 'Item marked as special.'
            );
        } catch {
            toast.error('Could not update special status.');
        }
    }

    return (
        <>
            <OwnerPageShell
                title="Menu Management"
                subtitle="Build an irresistible menu, mark specials, and keep offerings up to date."
                actions={
                    <Link
                        to={`/owner/restaurants/${restaurantId}/menu-items/new`}
                        className="rounded-2xl bg-[#17324D] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41]"
                    >
                        <Plus />
                    </Link>
                }
            >
                <div className="mb-6">
                    <NavBackButton
                        onClick={() => navigate('/')}
                        label="Back to dashboard"
                        theme="owner"
                    />
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((skeleton) => (
                            <div
                                key={skeleton}
                                className="h-24 animate-pulse rounded-2xl bg-[#E8E3D9]"
                            />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-3xl border border-[#D9D2C3] bg-white p-8 text-sm text-[#66717A] shadow-sm">
                        No menu items yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between rounded-3xl border border-[#D9D2C3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[#26343F]">
                                            {item.name}
                                        </h3>

                                        {item.special && (
                                            <span className="rounded-full bg-[#F1E8D7] px-2.5 py-1 text-xs font-bold text-[#8A7047]">
                                                Special
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-sm text-[#69747D]">
                                        {item.category || 'Uncategorized'} · ₹{item.price}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => handleToggleSpecial(item)}
                                        className="rounded-xl border border-[#CFC6B6] bg-[#FAF9F6] px-3 py-2 text-sm font-bold text-[#5E6670] transition hover:bg-[#F1EDE5]"
                                    >
                                        {item.special
                                            ? 'Unmark Special'
                                            : 'Mark Special'}
                                    </button>

                                    <Link
                                        to={`/owner/restaurants/${restaurantId}/menu-items/${item.id}/edit`}
                                        className="rounded-xl border border-[#CFC6B6] bg-[#FAF9F6] px-3 py-2 text-sm font-bold text-[#26343F] transition hover:bg-[#F1EDE5]"
                                    >
                                        <Pencil />
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleDeleteClick(item.id)
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
                title="Delete Menu Item?"
                message="This item will be permanently removed from the menu and cannot be recovered."
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