import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOwnerOrder, updateOrderStatus } from '../../api/ownerOrderApi';
import OwnerPageShell from './OwnerPageShell';
import NavBackButton from '../../components/NavBackButton';
import toast from 'react-hot-toast';
import { MapPinHouse } from 'lucide-react';

const NEXT_STATUS = {
    PENDING: 'PREPARING',
    PREPARING: 'READY',
    READY: null,
};

export default function OwnerOrderDetailPage() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [isFallbackOrder, setIsFallbackOrder] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [id]);

    async function loadOrder() {
        setIsLoading(true);
        setError('');
        setIsFallbackOrder(false);

        try {
            const data = await getOwnerOrder(id);
            setOrder(data);
        } catch {
            const fallbackOrder = buildOwnerFallbackOrder(
                id,
                state?.orderSummary
            );

            if (fallbackOrder) {
                setOrder(fallbackOrder);
                setIsFallbackOrder(true);
                setError(
                    'Full order details are temporarily unavailable, so a summary view is shown.'
                );
            } else {
                toast.error('Could not load this order.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAdvance() {
        const nextStatus = NEXT_STATUS[order.status];

        if (!nextStatus) return;

        setIsUpdating(true);

        try {
            const updated = await updateOrderStatus(order.id, nextStatus);

            setOrder(updated);

            toast.success(`Order marked as ${nextStatus}.`);
        } catch {
            toast.error('Could not update order status.');
        } finally {
            setIsUpdating(false);
        }
    }

    if (isLoading) {
        return (
            <OwnerPageShell
                title="Order Details"
                subtitle="Loading order details..."
            >
                <div className="rounded-3xl border border-[#D9D2C3] bg-white p-8 text-center text-sm text-[#69747D] shadow-sm">
                    Loading...
                </div>
            </OwnerPageShell>
        );
    }

    if (!order) {
        return (
            <OwnerPageShell
                title="Order Details"
                subtitle="We could not load this order."
            >
                <div className="rounded-3xl border border-[#D9B8B3] bg-[#FAEEEE] p-8 text-center text-sm text-[#9A4F48]">
                    {error || 'Order not found.'}
                </div>
            </OwnerPageShell>
        );
    }

    const nextStatus = NEXT_STATUS[order.status];
    const statusTone = getOwnerStatusTone(order.status);

    return (
        <OwnerPageShell
            title={order.orderNumber}
            subtitle="Review order details and update preparation status."
        >
            <div className="mx-auto max-w-2xl">
                <div className="mb-5">
                    <NavBackButton
                        onClick={() => navigate('/owner/orders')}
                        label="Back to orders"
                        theme="owner"
                    />
                </div>

                {isFallbackOrder && error && (
                    <div className="mb-5 rounded-2xl border border-[#D9D2C3] bg-[#F5F1E8] px-4 py-3 text-sm text-[#756548]">
                        {error}
                    </div>
                )}

                {/* Order Header */}
                <div className="mb-5 overflow-hidden rounded-3xl border border-[#D9D2C3] bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-[#243746] to-[#314A5A] px-6 py-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9C7A2]">
                                    Order
                                </p>

                                <h1 className="mt-1 text-xl font-bold text-white">
                                    {order.orderNumber}
                                </h1>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${statusTone.badge}`}
                            >
                                {order.status}
                            </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-200">
                            {order.restaurant.name}
                        </p>
                    </div>
                </div>

                {/* Items */}
                <div className="mb-5 rounded-3xl border border-[#D9D2C3] bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-bold text-[#26343F]">
                            Order Items
                        </h2>

                        <span className="rounded-full bg-[#F1EDE5] px-3 py-1 text-xs font-bold text-[#756548]">
                            {order.items.length}{' '}
                            {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>

                    {order.items.length === 0 ? (
                        <div className="rounded-2xl bg-[#F8F6F1] p-4 text-sm text-[#69747D]">
                            Item-level details are not available for this order
                            right now.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-2xl bg-[#F8F6F1] px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-[#26343F]">
                                            {item.menuItem.name}
                                        </p>

                                        <p className="mt-0.5 text-xs text-[#7A838A]">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>

                                    <span className="text-sm font-bold text-[#26343F]">
                                        ₹{item.lineTotal}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-[#E5E0D6] pt-4">
                        <span className="font-semibold text-[#69747D]">
                            Total
                        </span>

                        <span className="text-xl font-bold text-[#26343F]">
                            ₹{order.totalAmount}
                        </span>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-5 rounded-3xl border border-[#D9D2C3] bg-white p-6 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-xl bg-[#F1EDE5] p-2 text-[#756548]">
                            <MapPinHouse size={18} />
                        </div>

                        <h2 className="font-bold text-[#26343F]">
                            Delivering To
                        </h2>
                    </div>

                    <div className="rounded-2xl bg-[#F8F6F1] px-4 py-3">
                        <p className="text-sm leading-6 text-[#69747D]">
                            {order.deliveryAddress || 'Address unavailable.'}
                        </p>
                    </div>
                </div>

                {/* Status Action */}
                {nextStatus && (
                    <button
                        onClick={handleAdvance}
                        disabled={isUpdating}
                        className="w-full rounded-2xl bg-gradient-to-r from-[#243746] to-[#314A5A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#243746]/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {isUpdating
                            ? 'Updating...'
                            : `Mark ${nextStatus}`}
                    </button>
                )}

                {error && !isFallbackOrder && (
                    <div className="mt-4 rounded-2xl border border-[#D9B8B3] bg-[#FAEEEE] px-4 py-3 text-sm text-[#9A4F48]">
                        {error}
                    </div>
                )}
            </div>
        </OwnerPageShell>
    );
}

function buildOwnerFallbackOrder(orderId, orderSummary) {
    if (!orderSummary) return null;

    return {
        id: orderSummary.id || orderId,
        orderNumber: orderSummary.orderNumber || 'Order',
        status: orderSummary.status,
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

function getOwnerStatusTone(status) {
    if (status === 'READY') {
        return {
            badge: 'bg-emerald-50 text-emerald-700',
        };
    }

    if (status === 'PREPARING') {
        return {
            badge: 'bg-[#F1EDE5] text-[#756548]',
        };
    }

    if (status === 'PENDING') {
        return {
            badge: 'bg-sky-50 text-sky-700',
        };
    }

    return {
        badge: 'bg-slate-100 text-slate-700',
    };
}