import { useQuery } from "@tanstack/react-query";
import useAuthValue from "./useAuthValue";
import useAxiosSecure from "./useAxiosSecure";

const useMyParcels = () => {
  const { user, loading } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const {
    data: myParcels = [],
    isPending,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return data;
    },
    enabled: !!user && !loading,
  });
  return { myParcels, isError, error, isPending, refetch };
};

export default useMyParcels;
