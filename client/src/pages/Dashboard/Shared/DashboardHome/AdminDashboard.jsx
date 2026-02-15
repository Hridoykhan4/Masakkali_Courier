/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import {
  FaUsers,
  FaMotorcycle,
  FaBox,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

/* ===============================
   THEME-STABLE CHART COLORS
   (Using Hex for SVG engine stability)
================================ */
const STATUS_COLORS = {
  delivered: "#10b981", // success
  pending: "#f59e0b", // warning
  assigned: "#0ea5e9", // info/secondary
  "in-transit": "#8b5cf6", // primary/accent
  cancelled: "#ef4444", // error
  default: "#64748b",
};

/* ===============================
   CUSTOM TOOLTIP (Fixed Visibility)
================================ */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 border border-base-300 p-3 rounded-xl shadow-xl ring-1 ring-black/5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-base-content">
          Total: <span className="text-primary">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/* ===============================
   STAT CARD
================================ */
const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

const StatCard = ({ icon: Icon, label, value, variant = "primary" }) => {
  return (
    <div className="group bg-base-100 rounded-2xl p-5 ring-1 ring-base-300/50 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${colorMap[variant]}`}
        >
          <Icon className="text-xl" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-[10px] uppercase font-bold text-base-content/30 tracking-tighter">
            Live
          </span>
        </div>
      </div>
      <p className="text-xs font-semibold text-base-content/50 uppercase tracking-tight mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold tracking-tight text-base-content">
        {value ?? 0}
      </p>
    </div>
  );
};

/* ===============================
   DELIVERY CHARTS
================================ */
const DeliveryCharts = ({ data }) => {
  const formatted = data.map((d) => ({
    name:
      d.status.charAt(0).toUpperCase() + d.status.slice(1).replace("-", " "),
    value: d.count,
    color: STATUS_COLORS[d.status] || STATUS_COLORS.default,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* BAR CHART */}
      <div className="lg:col-span-7 bg-base-100 rounded-2xl p-6 ring-1 ring-base-300/50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-base-content">Delivery Volume</h3>
          <span className="text-[10px] bg-base-200 px-2 py-1 rounded text-base-content/50 font-bold uppercase">
            Parcels
          </span>
        </div>
        <div className="h-70 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formatted}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", opacity: 0.5 }}
              />
              <YAxis
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "currentColor", opacity: 0.5 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "currentColor", opacity: 0.05 }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={35}>
                {formatted.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DONUT CHART */}
      <div className="lg:col-span-5 bg-base-100 rounded-2xl p-6 ring-1 ring-base-300/50 shadow-sm">
        <h3 className="font-bold mb-6 text-base-content">
          Status Distribution
        </h3>
        <div className="h-70 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formatted}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                stroke="none"
              >
                {formatted.map((entry, index) => (
                  <Cell key={`cell-pie-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

/* ===============================
   ADMIN DASHBOARD
================================ */
const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // OVERVIEW STATS
  const { data: overview, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/overview");
      return res.data;
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  // DELIVERY STATUS COUNT
  const { data: statusCount = [] } = useQuery({
    queryKey: ["delivery-status-count"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return res.data;
    },
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-urbanist animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-base-300/30 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-base-content">
            System Analytics
          </h1>
          <p className="text-base-content/50 font-medium">
            Real-time monitoring of delivery operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-base-200 rounded-lg text-xs font-bold text-base-content/60 uppercase tracking-widest border border-base-300/50">
            Dashboard v2.1
          </div>
        </div>
      </div>

      {/* TOP LEVEL STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          icon={FaUsers}
          label="Total Users"
          value={overview?.totalUsers}
          variant="primary"
        />
        <StatCard
          icon={FaMotorcycle}
          label="Active Riders"
          value={overview?.totalRiders}
          variant="secondary"
        />
        <StatCard
          icon={FaBox}
          label="Total Parcels"
          value={overview?.totalParcels}
          variant="accent"
        />
        <StatCard
          icon={FaCheckCircle}
          label="Delivered Today"
          value={overview?.deliveredToday}
          variant="success"
        />
        <StatCard
          icon={FaMoneyBillWave}
          label="Revenue Today"
          value={`৳ ${overview?.revenueToday}`}
          variant="warning"
        />
      </div>

      {/* ANALYTICS SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-base-content">
            Logistics Performance
          </h2>
          <div className="h-px flex-1 bg-base-300/30 mx-6 hidden md:block"></div>
        </div>

        <DeliveryCharts data={statusCount} />

        {/* STATUS CARDS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {statusCount.map((item) => (
            <div
              key={item.status}
              className="bg-base-200/40 rounded-2xl p-6 ring-1 ring-base-300/20 hover:ring-primary/30 transition-all group"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-2 group-hover:text-primary transition-colors">
                {item.status.replace("-", " ")}
              </p>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-black italic text-base-content">
                  {item.count}
                </p>
                <span className="text-[10px] font-bold text-base-content/30 italic">
                  Units
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
