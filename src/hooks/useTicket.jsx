// src/hooks/useTicket.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

// GET all tickets with filters
export const useTickets = (filters = {}) => {
  const axiosSecure = useAxiosSecure();
  const { from, to, transportType, sortBy, page = 1, limit = 9 } = filters;

  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (transportType) params.append("transportType", transportType);
      if (sortBy) params.append("sortBy", sortBy);
      params.append("page", page);
      params.append("limit", limit);

      const { data } = await axiosSecure.get(`/api/tickets?${params}`);
      return data;
    },
  });
};

// GET single ticket
export const useTicket = (ticketId) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/tickets/${ticketId}`);
      return data.data;
    },
    enabled: !!ticketId,
  });
};

// GET latest tickets
export const useLatestTickets = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["tickets", "latest"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/tickets/latest/all");
      return data.data;
    },
  });
};

// GET advertised tickets
export const useAdvertisedTickets = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["tickets", "advertised"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/tickets/advertised/all");
      return data.data;
    },
  });
};
