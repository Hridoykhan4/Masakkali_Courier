import { motion } from "framer-motion";
import { Link } from "react-router"; // Use Link for SPA performance
import {
  FaUserShield,
  FaMotorcycle,
  FaUserTie,
  FaEnvelope,
  FaExternalLinkAlt,
  FaWallet,
  FaBoxOpen,
  FaCheckCircle,
  FaChartLine,
  FaFingerprint,
  FaCalendarAlt,
} from "react-icons/fa";
import useAuthValue from "../../../../hooks/useAuthValue";
import useScrollTo from "../../../../hooks/useScrollTo";
import useUserRole from "../../../../hooks/useUserRole";

const Profile = () => {
  useScrollTo();
  const { user } = useAuthValue();
  const { role } = useUserRole();

  const roleActions = {
    user: [
      {
        label: "Track Parcels",
        link: "/dashboard/myParcels",
        icon: <FaBoxOpen />,
        color: "bg-blue-600",
      },
      {
        label: "Billing",
        link: "/dashboard/paymentHistory",
        icon: <FaWallet />,
        color: "bg-emerald-600",
      },
    ],
    rider: [
      {
        label: "Earnings",
        link: "/dashboard/myEarnings",
        icon: <FaWallet />,
        color: "bg-orange-500",
      },
      {
        label: "Deliveries",
        link: "/dashboard/completedDeliveries",
        icon: <FaCheckCircle />,
        color: "bg-indigo-600",
      },
    ],
    admin: [
      {
        label: "Control Center",
        link: "/dashboard/makeAdmin",
        icon: <FaUserShield />,
        color: "bg-rose-600",
      },
      {
        label: "Performance",
        link: "/dashboard",
        icon: <FaChartLine />,
        color: "bg-slate-800",
      },
    ],
  };

  const currentActions = roleActions[role?.toLowerCase()] || [];

  return (
    <section className="container-page py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-base-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-base-content/5"
      >
        {/* --- DYNAMIC HEADER --- */}
        <div className="h-40 bg-neutral relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40 backdrop-blur-3xl" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="px-6 md:px-12 pb-12">
          {/* --- AVATAR & PRIMARY INFO --- */}
          <div className="relative -mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[3rem] ring-[12px] ring-base-100 overflow-hidden shadow-2xl bg-base-200">
                <img
                  src={
                    user?.photoURL ||
                    "https://i.ibb.co/mJR7z81/user-placeholder.png"
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-success text-white p-2.5 rounded-2xl shadow-xl border-4 border-base-100">
                <FaCheckCircle size={16} />
              </div>
            </div>

            <div className="flex-1 space-y-2 mb-2">
              <div className="flex flex-col md:flex-row items-center gap-3">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                  {user?.displayName}
                </h1>
                <span
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${
                    role === "admin"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : role === "rider"
                        ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  {role === "admin" ? (
                    <FaUserShield />
                  ) : role === "rider" ? (
                    <FaMotorcycle />
                  ) : (
                    <FaUserTie />
                  )}
                  {role || "Client"}
                </span>
              </div>
              <p className="flex items-center justify-center md:justify-start gap-2 opacity-60 font-semibold text-sm">
                <FaEnvelope className="text-primary" /> {user?.email}
              </p>
            </div>
          </div>

          <div className="divider my-10 opacity-5" />

          {/* --- INFORMATION GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Account Details (Left 3 Cols) */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-30 px-2">
                Security & Identity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-base-200/40 p-5 rounded-3xl border border-base-content/5">
                  <FaFingerprint className="text-primary mb-3" />
                  <p className="text-[10px] font-bold uppercase opacity-40">
                    System UID
                  </p>
                  <p className="font-mono text-[11px] font-bold truncate mt-1">
                    {user?.uid}
                  </p>
                </div>
                <div className="bg-base-200/40 p-5 rounded-3xl border border-base-content/5">
                  <FaCalendarAlt className="text-primary mb-3" />
                  <p className="text-[10px] font-bold uppercase opacity-40">
                    Onboarded
                  </p>
                  <p className="text-sm font-bold mt-1">
                    {user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm uppercase italic italic">
                    Account Status
                  </h4>
                  <p className="text-xs opacity-60 mt-0.5">
                    Your account is fully verified for Masakkali services.
                  </p>
                </div>
                <div className="badge badge-success font-black py-3 px-4 rounded-xl text-[10px]">
                  VERIFIED
                </div>
              </div>
            </div>

            {/* Quick Actions (Right 2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-30 px-2">
                shortcuts
              </h3>
              <div className="space-y-3">
                {currentActions.map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.link}
                    className="group flex items-center justify-between p-4 bg-base-100 rounded-2xl border border-base-content/5 shadow-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`${action.color} text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        {action.icon}
                      </div>
                      <span className="font-bold text-sm">{action.label}</span>
                    </div>
                    <FaExternalLinkAlt
                      size={12}
                      className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Profile;
