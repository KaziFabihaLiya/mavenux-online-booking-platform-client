import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./useAxiosSecure";


export const useUserTransactions = (userId) => {
  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/transactions/user/${userId}`
      );
      return data.data;
    },
    enabled: !!userId,
  });
};
