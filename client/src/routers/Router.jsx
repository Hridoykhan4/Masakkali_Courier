import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/User/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/User/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/User/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/User/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/User/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/Admin/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/Admin/ActiveRiders/ActiveRiders";
import MakeAdmin from "../pages/Dashboard/Admin/MakeAdmin/MakeAdmin";
import AdminRoute from "./AdminRoute";
import Forbidden from "../pages/Dashboard/Forbidden/Forbidden";
import AssignRider from "../pages/Dashboard/Admin/AssignRider/AssignRider";
import RiderRoute from "./RiderRoute";
import PendingDeliveries from "../pages/Dashboard/Rider/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../pages/Dashboard/Rider/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../pages/Dashboard/Rider/MyEarnings/MyEarnings";
import UserRoute from "./UserRoute";
import SendParcel from "../pages/Dashboard/User/SendParcel/SendParcel";
import DashboardHome from "../pages/Dashboard/Shared/DashboardHome/DashboardHome";
import Profile from "../pages/Dashboard/Shared/Profile/Profile";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        Component: Coverage,
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <UserRoute>
              <SendParcel></SendParcel>
            </UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <UserRoute>
              <BeARider></BeARider>
            </UserRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "myParcels",
        Component: MyParcels,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "payment/:id",
        Component: Payment,
      },
      {
        path: "paymentHistory",
        Component: PaymentHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      /* Admin routes */
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>
            <ActiveRiders></ActiveRiders>
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin></MakeAdmin>
          </AdminRoute>
        ),
      },
      {
        path: "assign-rider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
      /* Rider Router */
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoute>
            <CompletedDeliveries></CompletedDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "myEarnings",
        element: (
          <RiderRoute>
            <MyEarnings></MyEarnings>
          </RiderRoute>
        ),
      },

      /* Forbidden */
      {
        path: "forbidden",
        element: <Forbidden></Forbidden>,
      },
    ],
  },
]);

export default Router;
