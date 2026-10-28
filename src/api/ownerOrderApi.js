import axiosInstance from './axiosInstance';

export function getOwnerOrders({ restaurantId, status, page = 0, size = 10 } = {}) {
    return axiosInstance
        .get('/owner/orders', { params: { restaurantId, status, page, size } })
        .then((res) => res.data);
}

export function getOwnerOrder(orderId) {
    return axiosInstance
        .get(`/owner/orders/${orderId}`)
        .then((res) => res.data);
}

export function updateOrderStatus(orderId, newStatus) {
    return axiosInstance
        .patch(`/owner/orders/${orderId}/status`, { newStatus })
        .then((res) => res.data);
}