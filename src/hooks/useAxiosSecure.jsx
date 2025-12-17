// src/hooks/useAxiosSecure.jsx - UPDATED FOR JWT
import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import useAuth from "./useAuth";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
        // intercept request
        const requestInterceptor = axiosInstance.interceptors.request.use(
          async (config) => {
            config.headers.Authorization = `Bearer ${await user?.getIdToken}`;
            return config;
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
