import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRestaurantById } from '../../api/restaurantApi';
import { getMenuItems } from '../../api/menuApi';
import { useCart } from '../../app/CartContext';
import { useAuth } from '../../app/AuthContext';
import { getPreferences, addFavorite, removeFavorite } from '../../api/preferenceApi';
import CustomerPageShell from '../customer/CustomerPageShell';
import NavBackButton from '../../components/NavBackButton';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

export default function RestaurantDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, addItem, forceAddItem, updateItemQuantity, removeItem, itemCount } = useCart();

    const [restaurant, setRestaurant] = useState(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCartBusy, setIsCartBusy] = useState(false);
    const [conflictModal, setConflictModal] = useState({ open: false, item: null });
    const [isFavorite, setIsFavorite] = useState(false);
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        Promise.all([getRestaurantById(id), getMenuItems(id), getPreferences(user.id)])
            .then(([restaurantData, itemsData, preferencesData]) => {
                setRestaurant(restaurantData);
                setItems(itemsData);
                const favorited = (preferencesData.favoriteRestaurants || []).some(
                    (fav) => fav.restaurant.id === id
                );
                setIsFavorite(favorited);
            })
            .catch(() => toast.error('Could not load this restaurant.'))
            .finally(() => setIsLoading(false));
    }, [id, user.id]);

    async function handleToggleFavorite() {
        setIsTogglingFavorite(true);

        try {
            if (isFavorite) {
                await removeFavorite(user.id, id);
                setIsFavorite(false);
                toast.success('Removed from favorites');
            } else {
                await addFavorite(user.id, id);
                setIsFavorite(true);
                toast.success('Added to favorites');
            }
        } catch {
            toast.error('Could not update favorites. Please try again.');
        } finally {
            setIsTogglingFavorite(false);
        }
    }

    async function handleAdd(item) {
        if (isCartBusy) return;

        setIsCartBusy(true);

        try {
            const result = await addItem(item.id, 1);

            if (result.conflict) {
                setConflictModal({ open: true, item });
            } else {
                toast.success(`${item.name} added to cart`);
            }
        } catch {
            toast.error('Could not add item to cart. Please try again.');
        } finally {
            setIsCartBusy(false);
        }
    }

    async function handleConfirmConflict() {
        const item = conflictModal.item;
        setConflictModal({ open: false, item: null });

        if (!item) return;

        setIsCartBusy(true);

        try {
            await forceAddItem(item.id, 1);
        } catch {
            toast.error('Could not add item to cart. Please try again.');
        } finally {
            setIsCartBusy(false);
        }
    }

    async function handleIncrease(item) {
        if (isCartBusy) return;

        const cartItem = getCartItemForMenuItem(cart, item.id);

        if (!cartItem) {
            await handleAdd(item);
            return;
        }

        setIsCartBusy(true);

        try {
            await updateItemQuantity(cartItem.id, cartItem.quantity + 1);
        } catch {
            toast.error('Could not update item quantity. Please try again.');
        } finally {
            setIsCartBusy(false);
        }
    }

    async function handleDecrease(item) {
        if (isCartBusy) return;

        const cartItem = getCartItemForMenuItem(cart, item.id);

        if (!cartItem) return;

        setIsCartBusy(true);

        try {
            if (cartItem.quantity <= 1) {
                await removeItem(cartItem.id);
            } else {
                await updateItemQuantity(cartItem.id, cartItem.quantity - 1);
            }
        } catch {
            toast.error('Could not update item quantity. Please try again.');
        } finally {
            setIsCartBusy(false);
        }
    }

    if (isLoading) {
        return (
            <CustomerPageShell
                title="Restaurant Menu"
                subtitle="Loading restaurant details..."
            >
                <div className="rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F2F5F6] p-10 text-center text-sm text-[#69747D] shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#D8D2C6] border-t-[#17324D]" />
                    Loading restaurant...
                </div>
            </CustomerPageShell>
        );
    }

    if (!restaurant) {
        return (
            <CustomerPageShell
                title="Restaurant Menu"
                subtitle="We could not load this restaurant."
            >
                <div className="rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F2F5F6] p-10 text-center text-sm text-[#69747D] shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                    Restaurant not found.
                </div>
            </CustomerPageShell>
        );
    }

    const itemsByCategory = groupByCategory(items);

    return (
        <>
            <CustomerPageShell
                title={restaurant.name}
                subtitle={`${restaurant.cuisineType} · ${restaurant.city}`}
            >
                {/* Restaurant Header */}
                <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] via-[#F8F6F0] to-[#EAF0F3] p-6 shadow-[0_12px_40px_rgba(23,50,77,0.10)]">
                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#17324D]/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#C9A66B]/15 blur-3xl" />

                    {/* Accent line */}
                    <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#17324D] via-[#C9A66B] to-[#234E70]" />

                    <div className="relative">
                        <div className="mb-5">
                            <NavBackButton
                                onClick={() => navigate('/')}
                                label="Back to restaurants"
                            />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-[#EAF0F3] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#234E70] ring-1 ring-[#D5E0E6]">
                                        {restaurant.cuisineType}
                                    </span>

                                    <span className="rounded-full bg-[#F3EBDD] px-3 py-1.5 text-xs font-semibold text-[#80663C] ring-1 ring-[#E5D6B9]">
                                        {restaurant.city}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold tracking-tight text-[#17212B] sm:text-3xl">
                                    {restaurant.name}
                                </h2>

                                {restaurant.description && (
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#69747D]">
                                        {restaurant.description}
                                    </p>
                                )}
                            </div>

                            {/* Favorite Button */}
                            <button
                                onClick={handleToggleFavorite}
                                disabled={isTogglingFavorite}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D8D2C6] bg-[#FFFEFB] shadow-md transition duration-200 hover:-translate-y-0.5 hover:border-[#C9A66B] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A66B]/40 disabled:opacity-50"
                            >
                                {isFavorite ? (
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#17324D] to-[#234E70] shadow-inner">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4 text-[#E8D5AD]"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 21s-6.716-4.35-9.193-8.008C.876 10.13 1.218 6.35 4.056 4.56c2.204-1.39 4.87-.648 6.315 1.03l1.629 1.89 1.629-1.89c1.445-1.678 4.111-2.42 6.315-1.03 2.838 1.79 3.18 5.57 1.249 8.432C18.716 16.65 12 21 12 21z" />
                                        </svg>
                                    </span>
                                ) : (
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF0F3]">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4 text-[#536575]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            aria-hidden="true"
                                        >
                                            <path d="M12 21s-6.716-4.35-9.193-8.008C.876 10.13 1.218 6.35 4.056 4.56c2.204-1.39 4.87-.648 6.315 1.03l1.629 1.89 1.629-1.89c1.445-1.678 4.111-2.42 6.315-1.03 2.838 1.79 3.18 5.57 1.249 8.432C18.716 16.65 12 21 12 21z" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                {items.length === 0 ? (
                    <div className="rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F2F5F6] p-10 text-center text-sm text-[#69747D] shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                        No menu items available.
                    </div>
                ) : (
                    Object.entries(itemsByCategory).map(([category, categoryItems]) => (
                        <div key={category} className="mb-10">
                            {/* Category heading */}
                            <div className="mb-4 flex items-center gap-3">
                                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-[#17324D] to-[#C9A66B]" />

                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-[#17212B]">
                                        {category}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-[#7B8389]">
                                        {categoryItems.length} item
                                        {categoryItems.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {categoryItems.map((item) => (
                                    (() => {
                                        const cartItem = getCartItemForMenuItem(cart, item.id);
                                        const quantity = cartItem?.quantity || 0;
                                        const isBusy = isCartBusy;

                                        return (
                                            <div
                                                key={item.id}
                                                className="group relative overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-r from-[#FFFEFB] via-[#FAF8F3] to-[#F0F4F6] p-5 shadow-[0_6px_24px_rgba(23,50,77,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A66B]/60 hover:shadow-[0_14px_35px_rgba(23,50,77,0.11)]"
                                            >
                                                {/* Decorative glow */}
                                                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#17324D]/5 blur-3xl transition-transform duration-500 group-hover:scale-125" />

                                                <div className="relative flex items-center justify-between gap-5">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="font-semibold text-[#17212B] transition-colors group-hover:text-[#234E70]">
                                                                {item.name}
                                                            </h3>

                                                            {item.special && (
                                                                <span className="rounded-full bg-[#F3EBDD] px-2.5 py-1 text-xs font-semibold text-[#80663C] ring-1 ring-[#E5D6B9]">
                                                                    Special
                                                                </span>
                                                            )}

                                                            {item.mostlyOrdered && (
                                                                <span className="rounded-full bg-[#EAF0F3] px-2.5 py-1 text-xs font-semibold text-[#234E70] ring-1 ring-[#D5E0E6]">
                                                                    Popular
                                                                </span>
                                                            )}
                                                        </div>

                                                        {item.description && (
                                                            <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#69747D]">
                                                                {item.description}
                                                            </p>
                                                        )}

                                                        <p className="mt-3 text-base font-bold text-[#17324D]">
                                                            ₹{item.price}
                                                        </p>
                                                    </div>

                                                    {quantity > 0 ? (
                                                        <div className="inline-flex shrink-0 items-center rounded-2xl border border-[#C9D5DC] bg-[#EAF0F3] p-1 shadow-sm">
                                                            <button
                                                                onClick={() => handleDecrease(item)}
                                                                disabled={isBusy}
                                                                aria-label={`Decrease quantity of ${item.name}`}
                                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFFEFB] text-lg font-bold text-[#234E70] transition hover:bg-[#DDE7EC] disabled:opacity-50"
                                                            >
                                                                −
                                                            </button>

                                                            <div className="min-w-14 px-3 text-center">
                                                                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#7B8389]">
                                                                    Qty
                                                                </span>

                                                                <span className="text-base font-bold text-[#17324D]">
                                                                    {isBusy ? '...' : quantity}
                                                                </span>
                                                            </div>

                                                            <button
                                                                onClick={() => handleIncrease(item)}
                                                                disabled={isBusy}
                                                                aria-label={`Increase quantity of ${item.name}`}
                                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#17324D] to-[#234E70] text-lg font-bold text-white shadow-md shadow-[#17324D]/20 transition hover:from-[#122A41] hover:to-[#1D4564] disabled:opacity-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAdd(item)}
                                                            disabled={isBusy}
                                                            className="shrink-0 rounded-2xl bg-gradient-to-r from-[#17324D] to-[#234E70] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17324D]/20 transition duration-200 hover:-translate-y-0.5 hover:from-[#122A41] hover:to-[#1D4564] hover:shadow-xl disabled:opacity-50"
                                                        >
                                                            {isBusy ? 'Adding...' : 'Add'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </CustomerPageShell>

            <ConfirmModal
                open={conflictModal.open}
                title="Replace Cart?"
                message={`Your cart has items from ${cart?.restaurant?.name || 'another restaurant'}. Adding "${conflictModal.item?.name}" will clear your current cart.`}
                confirmLabel="Yes, Replace Cart"
                cancelLabel="Keep Current Cart"
                variant="warning"
                onConfirm={handleConfirmConflict}
                onCancel={() => setConflictModal({ open: false, item: null })}
            />
        </>
    );
}

function groupByCategory(items) {
    return items.reduce((groups, item) => {
        const key = item.category || 'Other';

        if (!groups[key]) groups[key] = [];

        groups[key].push(item);

        return groups;
    }, {});
}

function getCartItemForMenuItem(cart, menuItemId) {
    return cart?.items?.find(
        (cartItem) => cartItem.menuItem?.id === menuItemId
    ) || null;
}