import axiosInstance from './axiosInstance';

export function getPreferences(customerId) {
    return axiosInstance
        .get(`/customers/${customerId}/preferences`)
        .then((res) => res.data);
}

export function updatePreferences(customerId, payload) {
    return axiosInstance
        .put(`/customers/${customerId}/preferences`, payload)
        .then((res) => res.data);
}

export function addFavorite(customerId, restaurantId) {
    return axiosInstance
        .post(`/customers/${customerId}/preferences/favorites/${restaurantId}`)
        .then((res) => res.data);
}

export function removeFavorite(customerId, restaurantId) {
    return axiosInstance
        .delete(`/customers/${customerId}/preferences/favorites/${restaurantId}`)
        .then((res) => res.data);
}