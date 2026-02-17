import { Link } from "react-router";
import {
  FaArrowRight,
  FaBoxOpen,
  FaMotorcycle,
  FaChartLine,
} from "react-icons/fa";
import useAuthValue from "../../hooks/useAuthValue";
import useUserRole from "../../hooks/useUserRole";

const ActionPortal = ({ variant = "default" }) => {
  const { user } = useAuthValue();
  const { role } = useUserRole();

  /**
   * 📱 RESPONSIVE STRATEGY:
   * 1. btn-md on mobile (48px height) -> btn-lg on desktop (64px height)
   * 2. w-full on mobile -> w-auto on desktop
   * 3. px-6 on mobile -> px-10 on desktop (prevents text overflow)
   */
  const sharedClasses =
    "btn-md md:btn-lg px-6 md:px-10 gap-2 w-full sm:w-auto justify-center flex items-center";

  // --- GUEST VIEW ---
  if (!user) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link to="/register" className={`btn-main ${sharedClasses}`}>
          Start Shipping <FaArrowRight />
        </Link>
        <Link
          to="/login"
          className={`btn rounded-2xl transition-all duration-300 ${sharedClasses} ${
            variant === "banner"
              ? "text-white border-white/20 hover:bg-white/10 backdrop-blur-md"
              : "text-base-content hover:bg-base-content/5 border-base-content/10 bg-transparent"
          }`}
        >
          Login to Account
        </Link>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  if (role === "admin") {
    return (
      <Link
        to="/dashboard/activeRiders"
        className={`btn-main ${sharedClasses}`}
      >
        Manage Fleet <FaChartLine />
      </Link>
    );
  }

  // --- RIDER VIEW ---
  if (role === "rider") {
    return (
      <Link
        to="/dashboard/pendingDeliveries"
        className={`btn-info ${sharedClasses}`}
      >
        View Deliveries <FaMotorcycle />
      </Link>
    );
  }

  // --- MERCHANT / STANDARD USER VIEW ---
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      <Link to="/sendParcel" className={`btn-main ${sharedClasses}`}>
        Send a Parcel <FaBoxOpen />
      </Link>
      <Link to="/beARider" className={`btn-info ${sharedClasses}`}>
        <FaMotorcycle /> Earn as a Rider
      </Link>
    </div>
  );
};

export default ActionPortal;
