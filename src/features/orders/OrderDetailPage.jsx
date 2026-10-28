import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOrder, getOrderStatus } from '../../api/orderApi';
import CustomerPageShell from '../customer/CustomerPageShell';
import NavBackButton from '../../components/NavBackButton';
import {
    Check,
    Clock3,
    MapPin,
    ShoppingBag,
    UtensilsCrossed,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['PENDING', 'PREPARING', 'READY'];

export default function OrderDetailPage() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFallbackOrder, setIsFallbackOrder] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [id]);

    async function loadOrder() {
        setIsLoading(true);
        setIsFallbackOrder(false);

        try {
            const data = await getOrder(id);
            setOrder(data);
        } catch {
            const fallbackOrder = await buildCustomerFallbackOrder(
                id,
                state?.orderSummary
            );

            if (fallbackOrder) {
                setOrder(fallbackOrder);
                setIsFallbackOrder(true);
            } else {
                toast.error('Could not load this order.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <CustomerPageShell
                title="Order Details"
                subtitle="Loading your order..."
            >
                <div className="mx-auto max-w-2xl rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F0F4F6] p-10 text-center shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF0F3] text-[#17324D]">
                        <Clock3 className="h-6 w-6 animate-pulse" />
                    </div>

                    <p className="text-sm font-medium text-[#69747D]">
                        Loading your order...
                    </p>
                </div>
            </CustomerPageShell>
        );
    }

    if (!order) {
        return (
            <CustomerPageShell
                title="Order Details"
                subtitle="We could not load your order."
            >
                <div className="mx-auto max-w-2xl rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F8F1ED] p-10 text-center shadow-[0_10px_35px_rgba(23,50,77,0.07)]">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8EFEC] text-[#75483E]">
                        <ShoppingBag className="h-6 w-6" />
                    </div>

                    <h2 className="text-lg font-bold text-[#17212B]">
                        Order not found
                    </h2>

                    <p className="mt-2 text-sm text-[#69747D]">
                        We couldn't retrieve the details for this order.
                    </p>

                    <button
                        onClick={() => navigate('/orders')}
                        className="mt-6 rounded-2xl bg-gradient-to-r from-[#17324D] to-[#234E70] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:from-[#122A41] hover:to-[#1D4564]"
                    >
                        Back to Orders
                    </button>
                </div>
            </CustomerPageShell>
        );
    }

    const currentStepIndex = STATUS_STEPS.indexOf(order.status);

    return (
        <CustomerPageShell
            title={`Order ${order.orderNumber}`}
            subtitle="Track your order progress and delivery details."
        >
            <div className="mx-auto max-w-2xl">
                {/* Back */}
                <div className="mb-6">
                    <NavBackButton
                        onClick={() => navigate('/orders')}
                        label="Back to orders"
                    />
                </div>

                {/* Fallback Notice */}
                {isFallbackOrder && (
                    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#D8C7A8] bg-[#F7F1E5] px-4 py-3 text-sm text-[#6F5B38]">
                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                            Full order details are temporarily unavailable,
                            so a summary view is being shown.
                        </span>
                    </div>
                )}

                {/* Order Header */}
                <div className="relative mb-5 overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#17324D] via-[#1C3D59] to-[#234E70] p-6 text-white shadow-[0_14px_40px_rgba(23,50,77,0.16)]">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C9A66B]/15 blur-3xl" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D8B878]">
                                Order
                            </p>

                            <h1 className="text-xl font-bold sm:text-2xl">
                                {order.orderNumber}
                            </h1>

                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                                <UtensilsCrossed className="h-4 w-4" />
                                <span>{order.restaurant.name}</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                Status
                            </p>
                            <p className="mt-1 text-xs font-bold text-[#F1DFB8]">
                                {order.status}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="mb-5 rounded-3xl border border-[#D8D2C6] bg-[#FFFEFB] p-6 shadow-[0_8px_28px_rgba(23,50,77,0.07)]">
                    <div className="mb-6">
                        <h2 className="font-bold text-[#17212B]">
                            Order Progress
                        </h2>
                        <p className="mt-1 text-xs text-[#7B8389]">
                            Track your meal from preparation to ready.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-[16.66%] right-[16.66%] top-5 h-0.5 bg-[#DDE3E6]" />

                        <div
                            className="absolute left-[16.66%] top-5 h-0.5 bg-[#C9A66B] transition-all duration-500"
                            style={{
                                width:
                                    currentStepIndex <= 0
                                        ? '0%'
                                        : currentStepIndex === 1
                                          ? '33.33%'
                                          : '66.66%',
                            }}
                        />

                        <div className="relative flex justify-between">
                            {STATUS_STEPS.map((step, index) => {
                                const completed = index <= currentStepIndex;
                                const active = index === currentStepIndex;

                                return (
                                    <div
                                        key={step}
                                        className="flex flex-1 flex-col items-center"
                                    >
                                        <div
                                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#FFFEFB] text-xs font-bold shadow-sm transition-all ${
                                                completed
                                                    ? 'bg-[#17324D] text-white'
                                                    : 'bg-[#E5EAED] text-[#7B8389]'
                                            } ${
                                                active
                                                    ? 'ring-4 ring-[#C9A66B]/20'
                                                    : ''
                                            }`}
                                        >
                                            {completed ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>

                                        <span
                                            className={`mt-3 text-xs font-semibold ${
                                                active
                                                    ? 'text-[#17324D]'
                                                    : completed
                                                      ? 'text-[#526572]'
                                                      : 'text-[#8A949A]'
                                            }`}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-5 overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F5F6F3] shadow-[0_8px_28px_rgba(23,50,77,0.07)]">
                    <div className="flex items-center gap-3 border-b border-[#E2DED6] px-6 py-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0F3] text-[#17324D]">
                            <ShoppingBag className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-bold text-[#17212B]">
                                Your Items
                            </h2>
                            <p className="text-xs text-[#7B8389]">
                                Everything in your order
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        {order.items.length === 0 ? (
                            <p className="rounded-2xl bg-[#F0F3F4] p-4 text-sm text-[#69747D]">
                                Item-level details are not available for this
                                order right now.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-2xl border border-[#E0DDD6] bg-white px-4 py-3"
                                    >
                                        <div className="min-w-0 pr-4">
                                            <p className="text-sm font-semibold text-[#26343F]">
                                                {item.menuItem.name}
                                            </p>
                                            <p className="mt-1 text-xs text-[#7B8389]">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        <span className="shrink-0 text-sm font-bold text-[#17324D]">
                                            ₹{item.lineTotal}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-5 flex items-center justify-between border-t border-[#D8D2C6] pt-5">
                            <span className="font-semibold text-[#69747D]">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-[#17324D]">
                                ₹{order.totalAmount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#17324D] via-[#1C3D59] to-[#234E70] p-6 text-white shadow-[0_14px_40px_rgba(23,50,77,0.15)]">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#E8D5AD] ring-1 ring-white/10">
                            <MapPin className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-bold">Delivering to</h2>

                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                {order.deliveryAddress ||
                                    'Address unavailable.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerPageShell>
    );
}

async function buildCustomerFallbackOrder(orderId, orderSummary) {
    if (!orderSummary) return null;

    let latestStatus = orderSummary.status;

    try {
        const statusResponse = await getOrderStatus(orderId);
        latestStatus =
            statusResponse.status ||
            statusResponse.newStatus ||
            statusResponse;
    } catch {
        latestStatus = orderSummary.status;
    }

    return {
        id: orderSummary.id || orderId,
        orderNumber: orderSummary.orderNumber || 'Order',
        status: latestStatus,
        totalAmount: orderSummary.totalAmount ?? 0,
        deliveryAddress: orderSummary.deliveryAddress || '',
        restaurant:
            orderSummary.restaurant || {
                name: 'Restaurant unavailable',
            },
        items: Array.isArray(orderSummary.items)
            ? orderSummary.items.filter(isRenderableOrderItem)
            : [],
    };
}

function isRenderableOrderItem(item) {
    return item && item.menuItem && item.menuItem.name;
}