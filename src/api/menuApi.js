import axiosInstance from "./axiosInstance";

export function getMenuItems(restaurantId, category) {
    return axiosInstance
        .get(`/restaurants/${restaurantId}/menu-items`, { params: { category } })
        .then((res) => res.data);
}