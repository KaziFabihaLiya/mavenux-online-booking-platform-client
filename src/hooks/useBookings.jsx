// src/hooks/useBookings.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";

// GET user's bookings
export const useUserBookings = (userId) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["bookings", "user", userId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/bookings/user/${userId}`);
      return data.data;
    },
    enabled: !!userId,
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
