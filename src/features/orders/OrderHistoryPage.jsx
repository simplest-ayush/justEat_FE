import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderHistory } from '../../api/orderApi';
import CustomerPageShell from '../customer/CustomerPageShell';
import NavBackButton from '../../components/NavBackButton';
import { Clock3, PackageCheck, ReceiptText } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['ALL', 'PENDING', 'PREPARING', 'READY'];
const ACTIVE_STATUSES = new Set(['PENDING', 'PREPARING']);

export default function OrderHistoryPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    async function loadOrders() {
        setIsLoading(true);

        try {
            const data = await getOrderHistory({
                status: statusFilter === 'ALL' ? undefined : statusFilter,
            });

            setOrders(data.content);
        } catch {
            toast.error('Could not load order history.');
        } finally {
            setIsLoading(false);
        }
    }

    const activeOrdersCount = orders.filter((order) =>
        ACTIVE_STATUSES.has(order.status)
    ).length;

    const totalSpend = orders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0
    );

    return (
        <CustomerPageShell
            title="My Orders"
            subtitle="Track your recent and active orders in one place."
        >
            <div className="mb-6">
                <NavBackButton
                    onClick={() => navigate('/')}
                    label="Back to browse"
                />
            </div>

            {/* Summary Cards */}
            <div className="mb-7 grid gap-4 sm:grid-cols-3">
                <SummaryCard
                    icon={<ReceiptText className="h-5 w-5" />}
                    label="Total Orders"
                    value={orders.length}
                />

                <SummaryCard
                    icon={<Clock3 className="h-5 w-5" />}
                    label="Active Orders"
                    value={activeOrdersCount}
                />

                <SummaryCard
                    icon={<PackageCheck className="h-5 w-5" />}
                    label="Total Spend"
                    value={`₹${totalSpend}`}
                />
            </div>

            {/* Filters */}
            <section className="mb-6 overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F3F5F3] p-5 shadow-[0_8px_28px_rgba(23,50,77,0.07)]">
                <div className="mb-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A7047]">
                        Order History
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-[#17212B]">
                        Filter by status
                    </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                statusFilter === status
                                    ? 'bg-[#17324D] text-white shadow-lg shadow-[#17324D]/20'
                                    : 'border border-[#D6D2C9] bg-white text-[#59656E] hover:border-[#B9B2A5] hover:bg-[#F4F1EB]'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </section>

            {/* Orders */}
            <section className="overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] to-[#F4F5F3] p-5 shadow-[0_8px_28px_rgba(23,50,77,0.07)] sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A7047]">
                            Your Activity
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-[#17212B]">
                            Orders
                        </h2>
                    </div>

                    <span className="rounded-full bg-[#E8EDF0] px-3 py-1.5 text-xs font-bold text-[#526572]">
                        {orders.length}
                    </span>
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((skeleton) => (
                            <div
                                key={skeleton}
                                className="h-24 animate-pulse rounded-2xl bg-[#E8ECEE]"
                            />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-2xl border border-[#DDD9D1] bg-white p-10 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF0F3] text-[#17324D]">
                            <ReceiptText className="h-6 w-6" />
                        </div>

                        <h3 className="font-bold text-[#26343F]">
                            No orders found
                        </h3>

                        <p className="mt-1 text-sm text-[#7B8389]">
                            {statusFilter === 'ALL'
                                ? 'Your completed and active orders will appear here.'
                                : `No ${statusFilter.toLowerCase()} orders found.`}
                        </p>

                        {statusFilter === 'ALL' && (
                            <button
                                onClick={() => navigate('/')}
                                className="mt-5 rounded-xl bg-[#17324D] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#17324D]/20 transition hover:-translate-y-0.5 hover:bg-[#122A41]"
                            >
                                Browse Restaurants
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => {
                            const statusTone = getStatusTone(order.status);

                            return (
                                <button
                                    key={order.id}
                                    onClick={() =>
                                        navigate(`/orders/${order.id}`, {
                                            state: {
                                                orderSummary: order,
                                            },
                                        })
                                    }
                                    className="group flex w-full items-center justify-between rounded-2xl border border-[#DDD9D1] bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#C9A66B] hover:shadow-[0_10px_30px_rgba(23,50,77,0.10)]"
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div
                                            className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${statusTone.dot}`}
                                        />

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-[#26343F]">
                                                    {order.orderNumber}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusTone.badge}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-[#69747D]">
                                                {order.restaurant.name}
                                            </p>

                                            <p className="mt-2 text-xs font-semibold text-[#8A7047] transition group-hover:text-[#6F5735]">
                                                Track order →
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-4 shrink-0 text-right">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A949A]">
                                            Amount
                                        </p>

                                        <p className="mt-1 text-base font-bold text-[#17324D]">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>
        </CustomerPageShell>
    );
}

function SummaryCard({ icon, label, value }) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-[#D8D2C6] bg-gradient-to-br from-[#FFFEFB] via-[#F8F7F3] to-[#EEF2F3] p-5 shadow-[0_8px_28px_rgba(23,50,77,0.07)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(23,50,77,0.10)]">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#C9A66B]/10 blur-2xl transition group-hover:bg-[#C9A66B]/20" />

            <div className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#17324D] text-[#E8D5AD] shadow-md shadow-[#17324D]/15">
                    {icon}
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7B8389]">
                    {label}
                </p>

                <p className="mt-1 text-2xl font-bold text-[#17324D]">
                    {value}
                </p>
            </div>
        </div>
    );
}

function getStatusTone(status) {
    if (status === 'READY') {
        return {
            dot: 'bg-[#4E8066]',
            badge: 'bg-[#E8F1EB] text-[#37644D]',
        };
    }

    if (status === 'PREPARING') {
        return {
            dot: 'bg-[#B18A4A]',
            badge: 'bg-[#F4EEDF] text-[#80652F]',
        };
    }

    if (status === 'PENDING') {
        return {
            dot: 'bg-[#52758E]',
            badge: 'bg-[#EAF0F3] text-[#3F6075]',
        };
    }

    return {
        dot: 'bg-[#8A949A]',
        badge: 'bg-[#EEF0F1] text-[#59656E]',
    };
}