import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../app/CartContext';
import { placeOrder } from '../../api/orderApi';
import CustomerPageShell from '../customer/CustomerPageShell';
import { MapPin, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, refreshCart } = useCart();

    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const order = await placeOrder(deliveryAddress);
            await refreshCart();

            toast.success('Order placed successfully!');
            navigate(`/orders/${order.id}`);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Could not place order. Please try again.';

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!cart || cart.items.length === 0) {
        return (
            <CustomerPageShell
                title="Checkout"
                subtitle="Finalize your order details."
            >
                <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] via-[#F8F6F0] to-[#EAF0F3] p-12 text-center shadow-[0_12px_40px_rgba(23,50,77,0.08)]">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF0F3] text-[#17324D] shadow-sm">
                        <ShoppingBag className="h-8 w-8" />
                    </div>

                    <h2 className="text-xl font-bold text-[#17212B]">
                        Your cart is empty
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#69747D]">
                        Add some delicious dishes to your cart before checking
                        out.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-[#17324D] to-[#234E70] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:from-[#122A41] hover:to-[#1D4564]"
                    >
                        Browse Restaurants
                    </Link>
                </div>
            </CustomerPageShell>
        );
    }

    return (
        <CustomerPageShell
            title="Checkout"
            subtitle="Review your order and add delivery details."
        >
            <div className="mx-auto max-w-3xl">
                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    {/* Order Summary */}
                    <div className="relative overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] via-[#FAF8F3] to-[#F0F4F6] p-6 shadow-[0_10px_35px_rgba(23,50,77,0.08)]">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#17324D]/5 blur-3xl" />

                        <div className="relative">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#17324D] to-[#234E70] text-[#E8D5AD] shadow-md">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-bold text-[#17212B]">
                                        Order Summary
                                    </h2>
                                    <p className="text-xs text-[#7B8389]">
                                        Review your delicious selection
                                    </p>
                                </div>
                            </div>

                            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#D8D2C6] bg-white/70 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0F3] text-[#17324D]">
                                    <UtensilsCrossed className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7B8389]">
                                        Restaurant
                                    </p>
                                    <p className="mt-0.5 font-semibold text-[#17212B]">
                                        {cart.restaurant.name}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {cart.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-2xl border border-[#E1DDD5] bg-white/60 px-4 py-3"
                                    >
                                        <div className="min-w-0 pr-4">
                                            <p className="truncate text-sm font-medium text-[#26343F]">
                                                {item.menuItem.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-[#7B8389]">
                                                ₹{item.unitPrice} × {item.quantity}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-sm font-bold text-[#17324D]">
                                            ₹{item.lineTotal}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 border-t border-[#D8D2C6] pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-[#69747D]">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-[#17324D]">
                                        ₹{cart.subtotal}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Details */}
                    <div className="relative overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#17324D] via-[#1C3D59] to-[#234E70] p-6 text-white shadow-[0_16px_45px_rgba(23,50,77,0.20)]">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C9A66B]/15 blur-3xl" />

                        <div className="relative">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#E8D5AD] ring-1 ring-white/10">
                                    <MapPin className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="font-bold">
                                        Delivery Details
                                    </h2>
                                    <p className="text-xs text-slate-300">
                                        Where should we deliver?
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                                        Delivery Address
                                    </label>

                                    <textarea
                                        required
                                        maxLength={300}
                                        rows={6}
                                        value={deliveryAddress}
                                        onChange={(e) =>
                                            setDeliveryAddress(e.target.value)
                                        }
                                        placeholder="Enter your complete delivery address..."
                                        className="w-full resize-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-[#C9A66B] focus:bg-white/15 focus:ring-2 focus:ring-[#C9A66B]/20"
                                    />

                                    <p className="mt-2 text-right text-xs text-slate-400">
                                        {deliveryAddress.length}/300
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-300">
                                            Amount to pay
                                        </span>

                                        <span className="text-xl font-bold text-[#F1DFB8]">
                                            ₹{cart.subtotal}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-2xl bg-gradient-to-r from-[#D8B878] to-[#C9A66B] py-3.5 text-sm font-bold text-[#17324D] shadow-lg transition hover:-translate-y-0.5 hover:from-[#E2C589] hover:to-[#D4B574] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? 'Placing your order...'
                                        : `Place Order · ₹${cart.subtotal}`}
                                </button>

                                <Link
                                    to="/cart"
                                    className="block text-center text-xs font-medium text-slate-300 transition hover:text-white"
                                >
                                    ← Back to cart
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerPageShell>
    );
}