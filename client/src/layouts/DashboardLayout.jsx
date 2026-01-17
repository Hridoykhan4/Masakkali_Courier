import { NavLink, Outlet } from "react-router";
import useTheme from "../hooks/useTheme";
import useMyParcels from "../hooks/useMyParcels";
import MasakkaliLogo from "../pages/Shared/MasakkaliLogo/MasakkaliLogo";
import {
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineBadgeCheck,
  HiOutlineClock,
  HiOutlineLocationMarker,
} from "react-icons/hi";

import { FaBoxOpen, FaStripe } from "react-icons/fa";

import usePaymentHistory from "../hooks/usePaymentHistory";
const DashboardLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const { theme } = useTheme();
  const { myParcels } = useMyParcels();
  const { data: payments = [] } = usePaymentHistory();
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        <div className="flex-end justify-start items-center flex lg:hidden">
          <label
            htmlFor="my-drawer-3"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <div className="px-2">Dashboard</div>
        </div>

        <div className="p-2 lg:p-5">
          <Outlet></Outlet>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-56 sm:w-80 p-4">
          <div className="pb-3 border-b-2">
            <MasakkaliLogo></MasakkaliLogo>
          </div>
          <li>
            <NavLink
              to="/dashboard/myParcels"
              className="flex items-center gap-2"
            >
              <HiOutlineHome className="text-lg" />
              My Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/myParcels"
              className="flex items-center gap-2"
            >
              <FaBoxOpen className="text-lg" />
              My Parcels ( {myParcels?.length || 0} )
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/paymentHistory"
              className="flex items-center gap-2"
            >
              <FaStripe className="text-lg" />
              Payment History ( {payments?.length || 0} )
            </NavLink>
          </li>

          <li>
            <NavLink to="/dashboard/track" className="flex items-center gap-2">
              <HiOutlineLocationMarker className="text-lg" />
              Track a Package
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/profile"
              className="flex items-center gap-2"
            >
              <HiOutlineUserCircle className="text-lg" />
              Update Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/activeRiders"
              className="flex items-center gap-2"
            >
              <HiOutlineBadgeCheck className="text-lg text-success" />
              Active Riders
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/pendingRiders"
              className="flex items-center gap-2"
            >
              <HiOutlineClock className="text-lg text-warning" />
              Pending Riders
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
