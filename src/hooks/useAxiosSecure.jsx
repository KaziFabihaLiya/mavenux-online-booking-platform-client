// src/hooks/useAxiosSecure.jsx - UPDATED FOR JWT
import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./useAuth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { user, logOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // Add request interceptor
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
    }
  }, [user, loading, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
