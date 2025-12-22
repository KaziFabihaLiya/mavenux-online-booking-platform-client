// src/hooks/useAxiosSecure.jsx - UPDATED FOR JWT
import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./useAuth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  // baseURL: "/api",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // intercept request
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          // FIX: getIdToken is a method, need to call it with ()
          if (user?.getIdToken) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          console.log("Token expired or invalid. Logging out...");

          try {
            await logOut();
            navigate("/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
        return Promise.reject(err);
      }
    );

    // Cleanup to prevent multiple interceptors on re-renders
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
