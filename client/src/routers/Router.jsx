import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "./PrivateRoute";
import SendParcel from "../pages/SendParcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/User/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/User/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/User/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/User/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/Rider/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/Rider/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/Rider/ActiveRiders/ActiveRiders";

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
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
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
        path: "myParcels",
        Component: MyParcels,
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
      {
        path: 'pendingRiders',
        element: <PendingRiders></PendingRiders>
      },
      {
        path: 'activeRiders',
        element: <ActiveRiders></ActiveRiders>
      }
    ],
  },
]);

export default Router;
