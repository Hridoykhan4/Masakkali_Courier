import { useQuery } from "@tanstack/react-query";
import useAuthValue from "./useAuthValue";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
    const {user, loading: authLoading} = useAuthValue()
    const axiosSecure = useAxiosSecure()

    const {data: role = 'user', isLoading: roleLoading, refetch} = useQuery({
        queryKey: ['user-role', user?.email],
        queryFn: async() => {
            try {
                const {data} = await axiosSecure.get(`/users/${user?.email}/role`);
                return data?.role || 'user'; 
            } catch (error) {
                console.error("Role fetch error", error);
                return 'user'; 
            }
        },
        enabled: !authLoading && !!user?.email
    })

    return {role, loading: authLoading || roleLoading, refetch}
};
export default useUserRole;

