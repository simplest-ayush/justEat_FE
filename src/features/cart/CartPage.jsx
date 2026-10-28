import { useNavigate } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import CustomerPageShell from '../customer/CustomerPageShell';
import NavBackButton from '../../components/NavBackButton';
import { Trash2, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
    const navigate = useNavigate();
    const {
        cart,
        updateItemQuantity,
        removeItem,
        clearCurrentCart,
        isLoading,
    } = useCart();

    const totalItems =
        cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    async function handleQuantityChange(itemId, newQuantity) {
        if (newQuantity < 1) return;

        try {
            await updateItemQuantity(itemId, newQuantity);
        } catch {
            toast.error('Could not update item quantity.');
        }
    }

    if (isLoading) {
        return (
            <CustomerPageShell
                title="Your Cart"
                subtitle="Review your selections before checkout."
            >
                <div className="rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F0F4F6] p-10 text-center text-sm text-[#69747D] shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[#D8D2C6] border-t-[#17324D]" />
                    Loading your cart...
                </div>
            </CustomerPageShell>
        );
    }

    return (
        <CustomerPageShell
            title="Your Cart"
            subtitle="Review your selections before checkout."
        >
            <div className="mb-7">
                <NavBackButton
                    onClick={() => navigate('/')}
                    label="Continue Shopping"
                />
            </div>

            {!cart || cart.items.length === 0 ? (
                <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] via-[#F8F6F0] to-[#EAF0F3] p-12 text-center shadow-[0_12px_40px_rgba(23,50,77,0.08)]">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF0F3] text-[#17324D] shadow-sm">
                        <ShoppingBag className="h-8 w-8" />
                    </div>

                    <h2 className="text-xl font-bold text-[#17212B]">
                        Your cart is empty
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#69747D]">
                        Discover something delicious and add your favorite dishes
                        to your cart.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 rounded-2xl bg-gradient-to-r from-[#17324D] to-[#234E70] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:from-[#122A41] hover:to-[#1D4564] hover:shadow-xl"
                    >
                        Explore Restaurants
                    </button>
                </div>
            ) : (
                <div className="grid gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
                    {/* Cart Items */}
                    <section>
                        {/* Restaurant */}
                        <div className="relative mb-5 overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F0F4F6] p-5 shadow-[0_8px_28px_rgba(23,50,77,0.07)]">
                            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#17324D]/5 blur-2xl" />

                            <div className="relative flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#17324D] to-[#234E70] text-[#E8D5AD] shadow-md">
                                    <UtensilsCrossed className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7B8389]">
                                        Ordering from
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-[#17212B]">
                                        {cart.restaurant.name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-r from-[#FFFEFB] via-[#FAF8F3] to-[#F0F4F6] p-5 shadow-[0_6px_24px_rgba(23,50,77,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A66B]/60 hover:shadow-[0_14px_35px_rgba(23,50,77,0.10)]"
                                >
                                    <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#17324D]/5 blur-3xl transition-transform duration-500 group-hover:scale-125" />

                                    <div className="relative">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-base font-semibold text-[#17212B] transition-colors group-hover:text-[#234E70]">
                                                    {item.menuItem.name}
                                                </h3>

                                                <p className="mt-1 text-sm text-[#69747D]">
                                                    ₹{item.unitPrice} each
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-base font-bold text-[#17324D]">
                                                ₹{item.lineTotal}
                                            </p>
                                        </div>

                                        <div className="mt-5 flex items-center justify-between">
                                            {/* Quantity */}
                                            <div className="inline-flex items-center rounded-2xl border border-[#C9D5DC] bg-[#EAF0F3] p-1 shadow-sm">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={item.quantity <= 1}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFFEFB] text-lg font-bold text-[#234E70] transition hover:bg-[#DDE7EC] disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    −
                                                </button>

                                                <div className="min-w-14 px-3 text-center">
                                                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#7B8389]">
                                                        Qty
                                                    </span>

                                                    <span className="text-sm font-bold text-[#17324D]">
                                                        {item.quantity}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#17324D] to-[#234E70] text-lg font-bold text-white shadow-md shadow-[#17324D]/20 transition hover:from-[#122A41] hover:to-[#1D4564]"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await removeItem(item.id);
                                                        toast.success(
                                                            'Item removed from cart.'
                                                        );
                                                    } catch {
                                                        toast.error(
                                                            'Could not remove item from cart.'
                                                        );
                                                    }
                                                }}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E0D5CC] bg-[#FFFEFB] text-[#8A5B50] transition hover:border-[#B77968] hover:bg-[#F8EFEC] hover:text-[#75483E]"
                                                title="Remove item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Order Summary */}
                    <aside className="lg:sticky lg:top-28 lg:self-start">
                        <div className="relative overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#17324D] via-[#1C3D59] to-[#234E70] p-6 text-white shadow-[0_16px_45px_rgba(23,50,77,0.20)]">
                            {/* Decorative glow */}
                            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C9A66B]/15 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

                            <div className="relative">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                                        <ShoppingBag className="h-5 w-5 text-[#E8D5AD]" />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold">
                                            Order Summary
                                        </h2>
                                        <p className="text-xs text-slate-300">
                                            Your delicious selection
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-300">
                                            Total items
                                        </span>

                                        <span className="font-semibold text-white">
                                            {totalItems}
                                        </span>
                                    </div>

                                    <div className="my-4 h-px bg-white/10" />

                                    <div className="flex items-end justify-between">
                                        <span className="text-sm text-slate-300">
                                            Total price
                                        </span>

                                        <span className="text-2xl font-bold text-[#F1DFB8]">
                                            ₹{cart.subtotal}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-[#D8B878] to-[#C9A66B] py-3.5 text-sm font-bold text-[#17324D] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:from-[#E2C589] hover:to-[#D4B574] hover:shadow-xl"
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={async () => {
                                        try {
                                            await clearCurrentCart();
                                            toast.success(
                                                'Cart cleared successfully.'
                                            );
                                        } catch {
                                            toast.error(
                                                'Could not clear cart.'
                                            );
                                        }
                                    }}
                                    className="mt-3 w-full rounded-2xl border border-white/20 bg-white/5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </CustomerPageShell>
    );
}