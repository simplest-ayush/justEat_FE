import axiosInstance from './axiosInstance';

export function placeOrder(deliveryAddress) {
    return axiosInstance
        .post('/orders', { deliveryAddress })
        .then((res) => res.data);
}

export function getOrder(orderId) {
    return axiosInstance
        .get(`/orders/${orderId}`)
        .then((res) => res.data);
}

export function getOrderStatus(orderId) {
    return axiosInstance
        .get(`/orders/${orderId}/status`)
        .then((res) => res.data);
}

export function getOrderHistory({ from, to, status, page = 0, size = 10 } = {}) {
    return axiosInstance
        .get('/orders', { params: { from, to, status, page, size } })
        .then((res) => res.data);
}