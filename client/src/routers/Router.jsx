import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";

// Layouts (Loaded immediately for instant Shell)
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Guard Components
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import RiderRoute from "./RiderRoute";
import UserRoute from "./UserRoute";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ErrorLoadingState from "../components/ErrorLoadingState";

// Helper: Standardized Loading Wrapper
const Loadable = (Component) => (props) => (
  <Suspense fallback={<ErrorLoadingState isPending={true} />}>
    <Component {...props} />
  </Suspense>
);

// --- Lazy Loaded Pages ---
const Home = lazy(() => import("../pages/Home/Home/Home"));
const Coverage = lazy(() => import("../pages/Coverage/Coverage"));
const Login = lazy(() => import("../pages/Authentication/Login/Login"));
const Register = lazy(
  () => import("../pages/Authentication/Register/Register"),
);
const DashboardHome = lazy(
  () => import("../pages/Dashboard/Shared/DashboardHome/DashboardHome"),
);
const Profile = lazy(() => import("../pages/Dashboard/Shared/Profile/Profile"));
const Forbidden = lazy(() => import("../pages/Dashboard/Forbidden/Forbidden"));
const MyParcels = lazy(
  () => import("../pages/Dashboard/User/MyParcels/MyParcels"),
);
const SendParcel = lazy(
  () => import("../pages/Dashboard/User/SendParcel/SendParcel"),
);
const Payment = lazy(() => import("../pages/Dashboard/User/Payment/Payment"));
const PaymentHistory = lazy(
  () => import("../pages/Dashboard/User/PaymentHistory/PaymentHistory"),
);
const TrackParcel = lazy(
  () => import("../pages/Dashboard/User/TrackParcel/TrackParcel"),
);
const BeARider = lazy(
  () => import("../pages/Dashboard/User/BeARider/BeARider"),
);
const PendingRiders = lazy(
  () => import("../pages/Dashboard/Admin/PendingRiders/PendingRiders"),
);
const ActiveRiders = lazy(
  () => import("../pages/Dashboard/Admin/ActiveRiders/ActiveRiders"),
);
const MakeAdmin = lazy(
  () => import("../pages/Dashboard/Admin/MakeAdmin/MakeAdmin"),
);
const AssignRider = lazy(
  () => import("../pages/Dashboard/Admin/AssignRider/AssignRider"),
);
const PendingDeliveries = lazy(
  () => import("../pages/Dashboard/Rider/PendingDeliveries/PendingDeliveries"),
);
const CompletedDeliveries = lazy(
  () =>
    import("../pages/Dashboard/Rider/CompletedDeliveries/CompletedDeliveries"),
);
const MyEarnings = lazy(
  () => import("../pages/Dashboard/Rider/MyEarnings/MyEarnings"),
);

const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <Home />
          </Suspense>
        ),
      },
      { path: "coverage", element: React.createElement(Loadable(Coverage)) },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <UserRoute>{React.createElement(Loadable(SendParcel))}</UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <UserRoute>{React.createElement(Loadable(BeARider))}</UserRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: React.createElement(Loadable(Login)) },
      { path: "register", element: React.createElement(Loadable(Register)) },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: React.createElement(Loadable(DashboardHome)) },
      { path: "profile", element: React.createElement(Loadable(Profile)) },
      { path: "forbidden", element: React.createElement(Loadable(Forbidden)) },
      { path: "myParcels", element: React.createElement(Loadable(MyParcels)) },
      { path: "payment/:id", element: React.createElement(Loadable(Payment)) },
      {
        path: "paymentHistory",
        element: React.createElement(Loadable(PaymentHistory)),
      },
      { path: "track", element: React.createElement(Loadable(TrackParcel)) },
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            {React.createElement(Loadable(PendingRiders))}
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>{React.createElement(Loadable(ActiveRiders))}</AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>{React.createElement(Loadable(MakeAdmin))}</AdminRoute>
        ),
      },
      {
        path: "assign-rider",
        element: (
          <AdminRoute>{React.createElement(Loadable(AssignRider))}</AdminRoute>
        ),
      },
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoute>
            {React.createElement(Loadable(PendingDeliveries))}
          </RiderRoute>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoute>
            {React.createElement(Loadable(CompletedDeliveries))}
          </RiderRoute>
        ),
      },
      {
        path: "myEarnings",
        element: (
          <RiderRoute>{React.createElement(Loadable(MyEarnings))}</RiderRoute>
        ),
      },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default Router;
