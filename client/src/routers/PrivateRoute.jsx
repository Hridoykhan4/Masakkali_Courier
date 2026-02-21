import { Navigate, useLocation } from "react-router";
import useAuthValue from "../hooks/useAuthValue";
import ErrorLoadingState from "../components/ErrorLoadingState";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { loading, user } = useAuthValue();
   if (loading) {
     return <ErrorLoadingState isPending={true} />;
   }
  if (user) return children;
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;
