import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let accessToken = null;
let onRefreshSuccess = null; // AuthContext registers this - (newAccessToken) => void
let onRefreshFailure = null; // AuthContext registers this - () => void, forces logout

export function setAccessToken(token) {
    accessToken = token;
}

export function registerAuthHandlers(successHandler, failureHandler) {
    onRefreshSuccess = successHandler;
    onRefreshFailure = failureHandler;
}

axiosInstance.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let isRefreshing = false;
let pendingRequests = [];

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        const isAuthEndpoint = originalRequest.url?.includes('/auth/');

        if (status == 401 && !originalRequest._retry && !isAuthEndpoint) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({ resolve, reject, originalRequest })
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (!storedRefreshToken) {
                isRefreshing = false;
                onRefreshFailure?.();
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    { refreshToken: storedRefreshToken }
                );

                setAccessToken(data.accessToken);
                onRefreshSuccess?.(data.accessToken);

                pendingRequests.forEach(({ resolve, originalRequest: pendingReq }) => {
                    pendingReq.headers.Authorization = `Bearer ${data.accessToken}`;
                    resolve(axiosInstance(pendingReq));
                });
                pendingRequests = [];

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                pendingRequests.forEach(({ reject }) => reject(refreshError));
                pendingRequests = [];
                onRefreshFailure?.();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;