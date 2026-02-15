import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import useUserRole from "../../../../hooks/useUserRole";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";

const DashboardHome = () => {
  const { role, loading } = useUserRole();
  if (loading) return <ErrorLoadingState isPending={true}></ErrorLoadingState>;
  if (role === "user") return <UserDashboard></UserDashboard>;
  if (role === "admin") return <AdminDashboard></AdminDashboard>;
  if (role === "rider") return <RiderDashboard></RiderDashboard>;
  return (
    <div className="text-center text-red-500 font-medium">
      Unauthorized or unknown role
    </div>
  );
};

export default DashboardHome;
