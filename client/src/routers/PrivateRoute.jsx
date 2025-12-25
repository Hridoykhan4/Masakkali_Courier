import { Navigate, useLocation } from "react-router";
import useAuthValue from "../hooks/useAuthValue";

const PrivateRoute = ({ children }) => {
    const location = useLocation()
  const { loading, user } = useAuthValue();
  if (loading) return <span className="loading loading-dots loading-xl"></span>;
  if (user) return children;
  return <Navigate to="/login" state={{from: location}} replace></Navigate>
};

export default PrivateRoute;
