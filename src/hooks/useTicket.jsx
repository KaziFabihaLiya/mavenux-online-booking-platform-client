import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

// GET all tickets with filters
export const useTickets = (filters = {}) => {
  const { from, to, transportType, sortBy, page, limit } = filters;

  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (transportType) params.append("transportType", transportType);
      if (sortBy) params.append("sortBy", sortBy);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const { data } = await axiosInstance.get(`/api/tickets?${params}`);
      return data;
    },
  });
};

// GET single ticket
export const useTicket = (ticketId) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/tickets/${ticketId}`);
      return data.data;
    },
    enabled: !!ticketId,
  });
};

// GET latest tickets
export const useLatestTickets = () => {
  return useQuery({
    queryKey: ["tickets", "latest"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/tickets/latest/all");
      return data.data;
    },
  });
};

// GET advertised tickets
export const useAdvertisedTickets = () => {
  return useQuery({
    queryKey: ["tickets", "advertised"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/tickets/advertised/all");
      return data.data;
    },
  });
};

// GET vendor's tickets
export const useVendorTickets = (vendorId) => {
  return useQuery({
    queryKey: ["tickets", "vendor", vendorId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/tickets/vendor/${vendorId}`
      );
      return data.data;
    },
    enabled: !!vendorId,
  });
};

// CREATE ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketData) => {
      const { data } = await axiosInstance.post("/api/tickets", ticketData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("Ticket created successfully! Waiting for admin approval.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create ticket");
    },
  });
};

// UPDATE ticket
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, ticketData }) => {
      const { data } = await axiosInstance.put(
        `/api/tickets/${ticketId}`,
        ticketData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("Ticket updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update ticket");
    },
  });
};

// DELETE ticket
export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticketId) => {
      const { data } = await axiosInstance.delete(`/api/tickets/${ticketId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tickets"]);
      toast.success("Ticket deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete ticket");
    },
  });
};
