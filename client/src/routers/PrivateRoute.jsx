import { Navigate, useLocation } from "react-router";
import useAuthValue from "../hooks/useAuthValue";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { loading, user } = useAuthValue();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-50">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }
  if (user) return children;
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
