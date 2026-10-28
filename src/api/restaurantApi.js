import axiosInstance from './axiosInstance';

export function browseRestaurants({ query, cuisine, city, page = 0, size = 12 } = {}) {
    return axiosInstance
        .get('/restaurants', { params: { query, cuisine, city, page, size } })
        .then((res) => res.data);
}

export function getRestaurantById(id) {
    return axiosInstance
        .get(`/restaurants/${id}`)
        .then((res) => res.data);
}