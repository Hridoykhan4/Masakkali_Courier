import { NavLink, Outlet } from "react-router";
import useMyParcels from "../hooks/useMyParcels";
import MasakkaliLogo from "../pages/Shared/MasakkaliLogo/MasakkaliLogo";
import {
  HiOutlineUserCircle,
  HiOutlineBadgeCheck,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineViewGrid,
} from "react-icons/hi";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaMotorcycle,
  FaStripe,
  FaTasks,
  FaUserShield,
  FaWallet,
} from "react-icons/fa";

import usePaymentHistory from "../hooks/usePaymentHistory";
import useUserRole from "../hooks/useUserRole";
import ErrorLoadingState from "../components/ErrorLoadingState";

const DashboardLayout = () => {
  const { role, loading } = useUserRole();
  const { myParcels } = useMyParcels();
  const { data: payments = [] } = usePaymentHistory();

  if (loading) return <ErrorLoadingState isPending={loading} />;

  // Active Link Style Helper
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-primary text-primary-content font-bold shadow-md"
        : "hover:bg-base-300 text-base-content/80"
    }`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-base-200/50 min-h-screen">
        {/* Mobile Header */}
        <div className="navbar bg-base-100 lg:hidden shadow-sm border-b border-base-200">
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 font-bold uppercase tracking-widest text-sm opacity-70">
            {role} Dashboard
          </div>
        </div>

        {/* Dynamic Page Content */}
        <main className="p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Content */}
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>

        <aside className="w-64 sm:w-72 min-h-full bg-base-100 border-r border-base-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-base-200">
            <MasakkaliLogo />
            <div className="mt-2">
              <span className="badge badge-primary badge-outline font-mono text-[10px] uppercase">
                {role} Access
              </span>
            </div>
          </div>

          <ul className="menu p-4 gap-2 text-base">
            {/* 🟢 Common Links for Everyone */}
            <p className="text-[10px] font-bold uppercase text-gray-400 ml-4 mb-1">
              General
            </p>
            <li>
              <NavLink to="/dashboard/profile" className={navLinkClass}>
                <HiOutlineUserCircle className="text-xl" />
                Profile
              </NavLink>
            </li>

            {/* 🔵 User Specific Links */}
            {role === "user" && (
              <>
                <div className="divider opacity-50 my-1"></div>
                <p className="text-[10px] font-bold uppercase text-gray-400 ml-4 mb-1">
                  Parcel Management
                </p>
                <li>
                  <NavLink to="/dashboard/myParcels" className={navLinkClass}>
                    <FaBoxOpen className="text-xl" />
                    My Parcels
                    <span className="badge badge-sm badge-secondary ml-auto">
                      {myParcels?.length || 0}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/track" className={navLinkClass}>
                    <HiOutlineLocationMarker className="text-xl" />
                    Live Tracking
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/paymentHistory"
                    className={navLinkClass}
                  >
                    <FaStripe className="text-xl" />
                    Payments
                    <span className="badge badge-sm badge-secondary ml-auto">
                      {payments?.length || 0}
                    </span>
                  </NavLink>
                </li>
              </>
            )}

            {/* 🟠 Rider Specific Links */}
            {role === "rider" && (
              <>
                <div className="divider opacity-50 my-1"></div>
                <p className="text-[10px] font-bold uppercase text-gray-400 ml-4 mb-1">
                  Delivery Panel
                </p>
                <li>
                  <NavLink
                    to="/dashboard/pendingDeliveries"
                    className={navLinkClass}
                  >
                    <FaTasks className="text-xl" />
                    Task Board
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/completedDeliveries"
                    className={navLinkClass}
                  >
                    <FaCheckCircle className="text-xl" />
                    History
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/myEarnings" className={navLinkClass}>
                    <FaWallet className="text-xl" />
                    My Wallet
                  </NavLink>
                </li>
              </>
            )}

            {/* 🔴 Admin Specific Links */}
            {role === "admin" && (
              <>
                <div className="divider opacity-50 my-1"></div>
                <p className="text-[10px] font-bold uppercase text-gray-400 ml-4 mb-1">
                  Fleet Management
                </p>
                <li>
                  <NavLink
                    to="/dashboard/activeRiders"
                    className={navLinkClass}
                  >
                    <HiOutlineBadgeCheck className="text-xl text-success" />
                    Active Riders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/pendingRiders"
                    className={navLinkClass}
                  >
                    <HiOutlineClock className="text-xl text-warning" />
                    Pending Riders
                  </NavLink>
                </li>

                <div className="divider opacity-50 my-1"></div>
                <p className="text-[10px] font-bold uppercase text-gray-400 ml-4 mb-1">
                  Logistics & Auth
                </p>
                <li>
                  <NavLink
                    to="/dashboard/assign-rider"
                    className={navLinkClass}
                  >
                    <FaMotorcycle className="text-xl" />
                    Assign Parcels
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/makeAdmin" className={navLinkClass}>
                    <FaUserShield className="text-xl" />
                    Admin Controls
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Sidebar Footer Link */}
          <div className="mt-auto p-4 border-t border-base-200">
            <NavLink to="/" className="btn btn-outline btn-block btn-sm gap-2">
              <HiOutlineViewGrid /> Back to Site
            </NavLink>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
