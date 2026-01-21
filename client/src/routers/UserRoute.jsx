import { Navigate, useLocation } from "react-router";

import useAuthValue from "../hooks/useAuthValue";
import useUserRole from "../hooks/useUserRole";
import ErrorLoadingState from "../components/ErrorLoadingState";

const UserRoute = ({ children }) => {
  const { user, loading } = useAuthValue();
  const { role, isRoleLoading } = useUserRole();
  const location = useLocation();

  if (loading || isRoleLoading) {
    return <ErrorLoadingState isPending />;
  }

  if (user && role === "user") {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default UserRoute;
