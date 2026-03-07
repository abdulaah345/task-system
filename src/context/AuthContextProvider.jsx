import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const BASE_URL = "http://systemtodo.runasp.net/api"; // تأكد من HTTPS للـ Production

// 🔥 Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json", // مهم للـ Production
  },
  withCredentials: false,
});

// 🔥 Interceptor علشان يبعت التوكن تلقائيًا لأي request بعد login
api.interceptors.request.use(
  (config) => {
    // مش للـ login أو register
    if (
      !config.url?.includes("/Auth/login") &&
      !config.url?.includes("/Auth/register")
    ) {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        config.headers.Authorization = `Bearer ${savedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // ممكن تحط email في localStorage بعد login لو عايز
    }
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/Auth/login", { email, password });
      console.log("LOGIN RESPONSE:", res.data);

      setToken(res.data.token);
      setUser({ email });
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/Auth/register", { name, email, password });
      console.log("REGISTER RESPONSE:", res.data);
      return res.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);
      throw error;
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register, api }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
