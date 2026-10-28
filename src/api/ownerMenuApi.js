import axiosInstance from "./axiosInstance";

export function getMenuItems(restaurantId) {
    return axiosInstance
        .get(`/restaurants/${restaurantId}/menu-items`)
        .then((res) => res.data);
}

export function createMenuItem(restaurantId, payload) {
    return axiosInstance
        .post(`/owner/restaurants/${restaurantId}/menu-items`, payload)
        .then((res) => res.data);
}

export function updateMenuItem(restaurantId, itemId, payload) {
    return axiosInstance
        .put(`/owner/restaurants/${restaurantId}/menu-items/${itemId}`, payload)
        .then((res) => res.data);
}

export function deleteMenuItem(restaurantId, itemId) {
    return axiosInstance
        .delete(`/owner/restaurants/${restaurantId}/menu-items/${itemId}`)
        .then((res) => res.data);
}

export function markSpecial(restaurantId, itemId, payload) {
    return axiosInstance
        .patch(`/owner/restaurants/${restaurantId}/menu-items/${itemId}/special`, payload)
        .then((res) => res.data);
}