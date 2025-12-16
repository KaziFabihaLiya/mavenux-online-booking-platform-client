import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

// CREATE payment session
export const useCreatePaymentSession = () => {
  return useMutation({
    mutationFn: async (bookingId) => {
      const { data } = await axiosInstance.post("/api/payment/create-session", {
        bookingId,
      });
      return data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment session"
      );
    },
  });
};

// VERIFY payment
export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (sessionId) => {
      const { data } = await axiosInstance.post("/api/payment/verify", {
        sessionId,
      });
      return data;
    },
  });
};
