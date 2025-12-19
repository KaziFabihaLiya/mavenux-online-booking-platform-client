// src/hooks/useBookings.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";

// GET user's bookings
// GET user's bookings - FIXED: No userId parameter needed
export const useUserBookings = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["bookings", "user"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/bookings/user/`);
      return data.data;
    },
    retry: 1,
    onError: (error) => {
      console.error("Failed to fetch bookings:", error);
    }
  });
};

// CREATE booking
export const useCreateBooking = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const { data } = await axiosSecure.post("/api/bookings", bookingData);
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
