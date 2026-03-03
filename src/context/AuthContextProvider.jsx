import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://taskssystems.runasp.net/api/Auth/login",
        {
          email,
          password,
        },
      );

      console.log("LOGIN RESPONSE:", res.data);

      setToken(res.data.token);
      setUser({ email });
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(
        "http://taskssystems.runasp.net/api/Auth/register",
        {
          name,
          email,
          password,
        },
      );
      return res.data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
