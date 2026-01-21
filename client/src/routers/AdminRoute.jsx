import { Navigate, useLocation } from "react-router";
import useAuthValue from "../hooks/useAuthValue";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuthValue();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();
  if (loading || roleLoading)
    return <progress className="progress w-56"></progress>;
  if (user && role === "admin") return children;
  return <Navigate to="/dashboard/forbidden" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;
