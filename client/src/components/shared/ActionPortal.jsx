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

  // utilizing your @layer components from index.css
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
              ? "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-content"
              : "btn-ghost border-base-content/10"
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
