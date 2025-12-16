import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

// GET user's bookings
export const useUserBookings = (userId) => {
  return useQuery({
    queryKey: ["bookings", "user", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/bookings/user/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

// GET vendor's bookings
export const useVendorBookings = (vendorId) => {
  return useQuery({
    queryKey: ["bookings", "vendor", vendorId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/bookings/vendor/${vendorId}`
      );
      return data.data;
    },
    enabled: !!vendorId,
  });
};

// CREATE booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const { data } = await axiosInstance.post("/api/bookings", bookingData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking created successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });
};

// UPDATE booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const { data } = await axiosInstance.put(
        `/api/bookings/${bookingId}/status`,
        { status }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking status updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update booking");
    },
  });
};

