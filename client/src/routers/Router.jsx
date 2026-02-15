import { lazy } from "react";
import { createBrowserRouter } from "react-router";

// Layouts (Loaded immediately)
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Guard Components
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import RiderRoute from "./RiderRoute";
import UserRoute from "./UserRoute";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

// Lazy Loaded Pages
// --- Public ---
const Home = lazy(() => import("../pages/Home/Home/Home"));
const Coverage = lazy(() => import("../pages/Coverage/Coverage"));
const Login = lazy(() => import("../pages/Authentication/Login/Login"));
const Register = lazy(
  () => import("../pages/Authentication/Register/Register"),
);

// --- Shared Dashboard ---
const DashboardHome = lazy(
  () => import("../pages/Dashboard/Shared/DashboardHome/DashboardHome"),
);
const Profile = lazy(() => import("../pages/Dashboard/Shared/Profile/Profile"));
const Forbidden = lazy(() => import("../pages/Dashboard/Forbidden/Forbidden"));

// --- User Dashboard ---
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

// --- Admin Dashboard ---
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

// --- Rider Dashboard ---
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
      { index: true, element: <Home /> },
      { path: "coverage", element: <Coverage /> },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <UserRoute>
              <SendParcel />
            </UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <UserRoute>
              <BeARider />
            </UserRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
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
      // Shared
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      { path: "forbidden", element: <Forbidden /> },

      // User Specific
      { path: "myParcels", element: <MyParcels /> },
      { path: "payment/:id", element: <Payment /> },
      { path: "paymentHistory", element: <PaymentHistory /> },
      { path: "track", element: <TrackParcel /> },

      // Admin Specific
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRiders />
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>
            <ActiveRiders />
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "assign-rider",
        element: (
          <AdminRoute>
            <AssignRider />
          </AdminRoute>
        ),
      },

      // Rider Specific
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoute>
            <CompletedDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "myEarnings",
        element: (
          <RiderRoute>
            <MyEarnings />
          </RiderRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage></ErrorPage>
  }
]);

export default Router;
