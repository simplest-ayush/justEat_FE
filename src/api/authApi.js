import axiosInstance from "./axiosInstance";

export function register(payload) {
  return axiosInstance
    .post('/auth/register', payload)
    .then((res) => res.data)
}

export function login(payload) {
  return axiosInstance
    .post('/auth/login', payload)
    .then((res) => res.data)
}

export function refreshToken(refreshToken) {
  return axiosInstance
    .post('/auth/refresh', { refreshToken })
    .then((res) => res.data);
}

export function logout(refreshToken) {
  return axiosInstance
    .post('/auth/logout', { refreshToken })
    .then((res) => res.data);
}

export function forgotPassword(email) {
  return axiosInstance
    .post('/auth/forgot-password', { email })
    .then((res) => res.data);
}

export function resetPassword(token, newPassword) {
  return axiosInstance
    .post('/auth/reset-password', { token, newPassword })
    .then((res) => res.data);
}