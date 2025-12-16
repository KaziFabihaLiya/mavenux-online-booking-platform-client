import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

// GET all tickets (admin)
export const useAdminTickets = () => {
  return useQuery({
    queryKey: ["admin", "tickets"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/admin/tickets");
      return data.data;
    },
  });
};

// APPROVE/REJECT ticket
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, status }) => {
      const { data } = await axiosInstance.put(
        `/api/admin/tickets/${ticketId}/status`,
        {
          status,
        }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["admin", "tickets"]);
      toast.success(`Ticket ${variables.status} successfully!`);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update ticket status"
      );
    },
  });
};

// TOGGLE advertisement
export const useToggleAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, isAdvertised }) => {
      const { data } = await axiosInstance.put(
        `/api/admin/tickets/${ticketId}/advertise`,
        {
          isAdvertised,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "tickets"]);
      toast.success("Advertisement status updated!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update advertisement"
      );
    },
  });
};

// GET all users
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/admin/users");
      return data.data;
    },
  });
};

// UPDATE user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }) => {
      const { data } = await axiosInstance.put(
        `/api/admin/users/${userId}/role`,
        {
          role,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]);
      toast.success("User role updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    },
  });
};

// MARK as fraud
export const useMarkFraud = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isFraud }) => {
      const { data } = await axiosInstance.put(
        `/api/admin/users/${userId}/fraud`,
        {
          isFraud,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "users"]);
      toast.success("Fraud status updated!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update fraud status"
      );
    },
  });
};
