import axiosInstance from "./axiosInstance";

export function getMyRestaurants() {
    return axiosInstance
        .get('/owner/restaurants')
        .then((res) => res.data);
}

export function createRestaurant(payload) {
    return axiosInstance
        .post('owner/restaurants', payload)
        .then((res) => res.data);
}

export function updateRestaurant(id, payload) {
    return axiosInstance
        .put(`/owner/restaurants/${id}`, payload)
        .then((res) => res.data);
}

export function deleteRestaurant(id) {
    return axiosInstance
        .delete(`/owner/restaurants/${id}`)
        .then((res) => res.data);
}