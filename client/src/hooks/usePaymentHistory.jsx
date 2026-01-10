import { useQuery } from "@tanstack/react-query";
import useAuthValue from "./useAuthValue";
import useAxiosSecure from "./useAxiosSecure";

const usePaymentHistory = () => {
    const {user, loading} = useAuthValue();
    const axiosSecure = useAxiosSecure()
    return useQuery({
        queryKey: ["my-payments", user?.email],
        queryFn: async () => {
          const { data } = await axiosSecure.get(`/payments?email=${user?.email}`);
          return data;
        },
        enabled: !!user && !loading,
        staleTime: 1000 * 60 * 5,
      });
};

export default usePaymentHistory;