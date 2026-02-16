import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FaWallet,
  FaCoins,
  FaClock,
  FaChartLine,
  FaRegCalendarAlt,
  FaCalendarCheck,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const StatCard = ({ title, value, color, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`relative overflow-hidden p-6 rounded-[2.5rem] bg-base-100 border border-base-content/5 shadow-xl shadow-base-content/5 group`}
  >
    <div
      className={`absolute -right-4 -top-4 p-8 rounded-full opacity-5 group-hover:scale-110 transition-transform ${color.replace("border-", "bg-")}`}
    >
      <Icon size={60} />
    </div>

    <div className="flex items-center gap-4 mb-4">
      <div
        className={`p-3 rounded-2xl ${color.replace("border-", "bg-")}/10 ${color.replace("border-", "text-")}`}
      >
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
        {title}
      </p>
    </div>

    <div className="space-y-1">
      <h3 className="text-3xl font-black italic tracking-tighter">
        ৳ {value?.toLocaleString() || 0}
      </h3>
      <div
        className={`h-1.5 w-12 rounded-full ${color.replace("border-", "bg-")}`}
      ></div>
    </div>
  </motion.div>
);

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myEarnings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/earnings-summary");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="p-20">
        <ErrorLoadingState isPending />
      </div>
    );
  if (isError)
    return (
      <div className="p-20">
        <ErrorLoadingState isError />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      {/* --- Section 1: Liquid Assets --- */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-4">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
              Revenue <span className="text-primary">Stream</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mt-2 italic">
              Real-time audit of your logistics performance
            </p>
          </div>
          <div className="bg-success/10 text-success px-4 py-2 rounded-xl border border-success/20 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              Live Ledger
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Lifetime Revenue"
            value={data.total}
            color="border-green-500"
            icon={FaCoins}
            delay={0.1}
          />
          <StatCard
            title="Successfully Cashed"
            value={data.cashedOut}
            color="border-blue-500"
            icon={FaWallet}
            delay={0.2}
          />
          <StatCard
            title="Pending Settlement"
            value={data.pending}
            color="border-yellow-500"
            icon={FaClock}
            delay={0.3}
          />
        </div>
      </div>

      {/* --- Section 2: Analytics --- */}
      <div className="space-y-6">
        <div className="px-4 flex items-center gap-3">
          <FaChartLine className="text-primary" />
          <h3 className="text-xl font-black italic uppercase tracking-tighter opacity-60">
            Performance Cycles
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Weekly Velocity"
            value={data.weekly}
            color="border-purple-500"
            icon={FaRegCalendarAlt}
            delay={0.4}
          />
          <StatCard
            title="Monthly Yield"
            value={data.monthly}
            color="border-indigo-500"
            icon={FaCalendarCheck}
            delay={0.5}
          />
          <StatCard
            title="Annual Forecast"
            value={data.yearly}
            color="border-pink-500"
            icon={FaChartLine}
            delay={0.6}
          />
        </div>
      </div>

      {/* --- Footer Hint --- */}
      <div className="bg-base-200/50 p-8 rounded-[3rem] border-2 border-dashed border-base-content/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">
          Syncing with Masakkali Logistics Neural Link © 2026
        </p>
      </div>
    </div>
  );
};

export default MyEarnings;
