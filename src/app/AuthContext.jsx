import { createContext, useContext, useEffect, useState } from "react";
import { registerAuthHandlers, setAccessToken } from "../api/axiosInstance";
import { decodeJwt } from "../utils/jwt";
import {
  login as loginApi,
  register as registerApi,
  refreshToken as refreshApi,
  logout as logoutApi,
} from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function applyToken(accessToken) {
    setAccessToken(accessToken);
    const claims = decodeJwt(accessToken);
    if (claims) {
      setUser({ id: claims.sub, username: claims.username, role: claims.role });
    }
  }

  function clearAuth() {
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  useEffect(() => {
    registerAuthHandlers(
      (newAccessToken) => applyToken(newAccessToken),
      () => clearAuth()
    );

    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      setIsLoading(false);
      return;
    }

    refreshApi(storedRefreshToken)
      .then((data) => {
        localStorage.setItem("refreshToken", data.refreshToken);
        applyToken(data.accessToken);
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(username, password) {
    const data = await loginApi({ username, password });
    localStorage.setItem("refreshToken", data.refreshToken);
    applyToken(data.accessToken);
    return data;
  }

  async function register(payload) {
    const data = await registerApi(payload);
    localStorage.setItem("refreshToken", data.refreshToken);
    applyToken(data.accessToken);
    return data;
  }

  async function logout() {
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedRefreshToken) {
      try {
        await logoutApi(storedRefreshToken);
      } catch {
        // Server-side revoke failed or token already invalid - still clear local
        // state, since the user's intent to log out should always succeed locally.
      }
    }
    clearAuth();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}