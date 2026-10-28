import axiosInstance from "./axiosInstance";

export function getCart() {
    return axiosInstance
        .get('/cart')
        .then((res) => res.data);
}

export function addCartItem(menuItemId, quantity) {
    return axiosInstance
        .post('/cart/items', { menuItemId, quantity })
        .then((res) => res.data);
}

export function updateCartItem(itemId, quantity) {
    return axiosInstance
        .put(`/cart/items/${itemId}`, { quantity })
        .then((res) => res.data);
}


export function removeCartItem(itemId) {
    return axiosInstance
        .delete(`/cart/items/${itemId}`)
        .then((res) => res.data);
}

export function clearCart() {
    return axiosInstance
        .delete('/cart')
        .then((res) => res.data);
}