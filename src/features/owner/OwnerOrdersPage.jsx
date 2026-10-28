import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerOrders, updateOrderStatus } from '../../api/ownerOrderApi';
import OwnerPageShell from './OwnerPageShell';
import NavBackButton from '../../components/NavBackButton';
import toast from 'react-hot-toast';

const NEXT_STATUS = {
    PENDING: 'PREPARING',
    PREPARING: 'READY',
    READY: null,
};

const STATUS_FILTERS = ['ALL', 'PENDING', 'PREPARING', 'READY'];
const ACTIVE_STATUSES = new Set(['PENDING', 'PREPARING']);

export default function OwnerOrdersPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    async function loadOrders() {
        setIsLoading(true);

        try {
            const data = await getOwnerOrders({
                status: statusFilter === 'ALL' ? undefined : statusFilter,
            });

            setOrders(data.content);
        } catch {
            toast.error('Could not load orders.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAdvanceStatus(order) {
        const nextStatus = NEXT_STATUS[order.status];

        if (!nextStatus) return;

        setUpdatingOrderId(order.id);

        try {
            await updateOrderStatus(order.id, nextStatus);

            toast.success(`Order marked as ${nextStatus}.`);

            await loadOrders();
        } catch {
            toast.error('Could not update order status. Please try again.');
        } finally {
            setUpdatingOrderId(null);
        }
    }

    const activeOrdersCount = orders.filter((order) =>
        ACTIVE_STATUSES.has(order.status)
    ).length;

    const readyOrdersCount = orders.filter(
        (order) => order.status === 'READY'
    ).length;

    return (
        <OwnerPageShell
            title="Incoming Orders"
            subtitle="Track and progress orders quickly from pending to ready."
        >
            <div className="mb-5">
                <NavBackButton
                    onClick={() => navigate('/')}
                    label="Back to dashboard"
                    theme="owner"
                />
            </div>

            {/* Metrics */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <OwnerOrderMetric
                    label="Orders in View"
                    value={orders.length}
                />

                <OwnerOrderMetric
                    label="Active Orders"
                    value={activeOrdersCount}
                />

                <OwnerOrderMetric
                    label="Ready Orders"
                    value={readyOrdersCount}
                />
            </div>

            {/* Filters */}
            <section className="mb-6 rounded-3xl border border-[#D9D2C3] bg-white p-5 shadow-sm">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8A7960]">
                        Order Status
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-[#26343F]">
                        Filter incoming orders
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                statusFilter === status
                                    ? 'bg-[#263D4C] text-white shadow-md shadow-[#263D4C]/20'
                                    : 'border border-[#D9D2C3] bg-[#F8F6F1] text-[#596873] hover:bg-[#EEE9DF] hover:text-[#26343F]'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </section>

            {/* Orders */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((skeleton) => (
                        <div
                            key={skeleton}
                            className="h-28 animate-pulse rounded-3xl bg-[#EAE5DB]"
                        />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="rounded-3xl border border-[#D9D2C3] bg-white p-10 text-center shadow-sm">
                    <p className="text-lg font-semibold text-[#26343F]">
                        No orders found
                    </p>

                    <p className="mt-1 text-sm text-[#7A838A]">
                        There are no orders matching the selected status.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const nextStatus = NEXT_STATUS[order.status];
                        const statusTone = getOwnerStatusTone(order.status);

                        return (
                            <div
                                key={order.id}
                                className="group rounded-3xl border border-[#D9D2C3] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#C8BEAB] hover:shadow-lg"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Order information */}
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className={`h-2.5 w-2.5 rounded-full ${statusTone.dot}`}
                                            />

                                            <h3 className="font-bold text-[#26343F]">
                                                {order.orderNumber}
                                            </h3>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone.badge}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-[#69747D]">
                                            {order.restaurant.name}
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#26343F]">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/owner/orders/${order.id}`,
                                                    {
                                                        state: {
                                                            orderSummary: order,
                                                        },
                                                    }
                                                )
                                            }
                                            className="rounded-xl border border-[#CFC7B8] bg-white px-4 py-2.5 text-sm font-semibold text-[#4F606B] transition hover:bg-[#F4F1EA] hover:text-[#26343F]"
                                        >
                                            View Details
                                        </button>

                                        {nextStatus && (
                                            <button
                                                onClick={() =>
                                                    handleAdvanceStatus(order)
                                                }
                                                disabled={
                                                    updatingOrderId === order.id
                                                }
                                                className="rounded-xl bg-gradient-to-r from-[#263D4C] to-[#385565] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#263D4C]/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                                            >
                                                {updatingOrderId === order.id
                                                    ? 'Updating...'
                                                    : `Mark ${nextStatus}`}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Progress indicator */}
                                <div className="mt-5 border-t border-[#E9E4DA] pt-4">
                                    <div className="flex items-center gap-2">
                                        <StatusStep
                                            label="Pending"
                                            active={order.status === 'PENDING'}
                                            completed={
                                                order.status === 'PREPARING' ||
                                                order.status === 'READY'
                                            }
                                        />

                                        <div className="h-px flex-1 bg-[#DDD7CB]" />

                                        <StatusStep
                                            label="Preparing"
                                            active={order.status === 'PREPARING'}
                                            completed={order.status === 'READY'}
                                        />

                                        <div className="h-px flex-1 bg-[#DDD7CB]" />

                                        <StatusStep
                                            label="Ready"
                                            active={order.status === 'READY'}
                                            completed={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </OwnerPageShell>
    );
}

function OwnerOrderMetric({ label, value }) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-[#D9D2C3] bg-white p-5 shadow-sm">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#EEE9DF] blur-2xl" />

            <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A7960]">
                    {label}
                </p>

                <p className="mt-2 text-3xl font-bold text-[#26343F]">
                    {value}
                </p>
            </div>
        </div>
    );
}

function StatusStep({ label, active, completed }) {
    return (
        <div className="flex items-center gap-1.5">
            <div
                className={`h-2.5 w-2.5 rounded-full ${
                    active || completed
                        ? 'bg-[#263D4C]'
                        : 'bg-[#D9D4CA]'
                }`}
            />

            <span
                className={`text-[11px] font-semibold ${
                    active
                        ? 'text-[#263D4C]'
                        : completed
                            ? 'text-[#69747D]'
                            : 'text-[#A0A4A6]'
                }`}
            >
                {label}
            </span>
        </div>
    );
}

function getOwnerStatusTone(status) {
    if (status === 'READY') {
        return {
            dot: 'bg-emerald-500',
            badge: 'bg-emerald-50 text-emerald-700',
        };
    }

    if (status === 'PREPARING') {
        return {
            dot: 'bg-[#B08B52]',
            badge: 'bg-[#F1EDE5] text-[#756548]',
        };
    }

    if (status === 'PENDING') {
        return {
            dot: 'bg-sky-500',
            badge: 'bg-sky-50 text-sky-700',
        };
    }

    return {
        dot: 'bg-slate-400',
        badge: 'bg-slate-100 text-slate-700',
    };
}