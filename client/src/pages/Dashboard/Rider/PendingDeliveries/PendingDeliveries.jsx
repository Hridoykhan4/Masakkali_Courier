import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBox,
  FaRoute,
  FaCheckCircle,
  FaTruckLoading,
  FaMapMarkerAlt,
  FaSync,
} from "react-icons/fa";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: parcels = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["rider-tasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/tasks");
      return res.data;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });

  const pickupMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/parcels/${id}/pickup`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-tasks"] });
      toast.success("Parcel Logged: In-Transit ⚡");
      refetch();
    },
    onError: () => toast.error("Pickup sync failed"),
  });

  const deliverMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/parcels/${id}/deliver`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-tasks"] });
      toast.success("Mission Accomplished! ✅");
      refetch();
    },
  });

  if (isLoading)
    return (
      <div className="p-10">
        <ErrorLoadingState isPending />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* --- Mission Header --- */}
      <div className="bg-base-100 p-6 md:p-8 rounded-[2rem] shadow-sm border border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <FaRoute size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
              Active Missions
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isFetching ? "bg-primary" : "bg-success"}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${isFetching ? "bg-primary" : "bg-success"}`}
                ></span>
              </span>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Live Satellite Sync
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className={`btn btn-circle btn-ghost ${isFetching ? "animate-spin" : ""}`}
        >
          <FaSync />
        </button>
      </div>

      {/* --- Task Grid (Mobile Optimized) --- */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {parcels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-base-100 rounded-[2rem] border-2 border-dashed border-base-content/10"
            >
              <FaTruckLoading size={40} className="mx-auto mb-4 opacity-10" />
              <p className="font-black italic uppercase opacity-20 text-xl">
                No Pending Dispatch
              </p>
            </motion.div>
          ) : (
            parcels.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={p._id}
                className="bg-base-100 p-6 rounded-[2rem] shadow-xl shadow-base-content/5 border border-base-content/5 hover:border-primary/20 transition-all flex flex-col md:flex-row items-center gap-6"
              >
                {/* Status Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                    p.delivery_status === "assigned"
                      ? "bg-warning/10 text-warning"
                      : "bg-info/10 text-info"
                  }`}
                >
                  <FaBox size={24} />
                </div>

                {/* Main Info */}
                <div className="grow space-y-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-[10px] font-mono font-black opacity-30 tracking-tighter">
                      {p.trackingId}
                    </span>
                    <span
                      className={`badge badge-sm font-black uppercase italic ${p.delivery_status === "assigned" ? "badge-warning" : "badge-info"}`}
                    >
                      {p.delivery_status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold opacity-60">
                    <FaMapMarkerAlt className="text-primary" />
                    <span>{p.senderServiceCenter}</span>
                    <span className="opacity-20">→</span>
                    <span className="text-primary">
                      {p.receiverServiceCenter}
                    </span>
                  </div>
                </div>

                {/* Cost/Payment */}
                <div className="px-6 py-2 bg-base-200/50 rounded-xl text-center shrink-0">
                  <p className="text-[10px] font-black opacity-40 uppercase">
                    Collect
                  </p>
                  <p className="text-xl font-black italic tracking-tighter text-primary">
                    ৳{p.cost}
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 w-full md:w-auto">
                  {p.delivery_status === "assigned" && (
                    <button
                      className="btn btn-primary btn-block md:btn-wide h-16 rounded-2xl font-black italic uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                      onClick={() => pickupMutation.mutate(p._id)}
                      disabled={pickupMutation.isPending}
                    >
                      {pickupMutation.isPending ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <FaTruckLoading /> Pickup
                        </>
                      )}
                    </button>
                  )}

                  {p.delivery_status === "in-transit" && (
                    <button
                      className="btn btn-success btn-block md:btn-wide h-16 rounded-2xl font-black italic uppercase tracking-widest gap-2 shadow-lg shadow-success/20 text-success-content"
                      onClick={() => deliverMutation.mutate(p._id)}
                      disabled={deliverMutation.isPending}
                    >
                      {deliverMutation.isPending ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <FaCheckCircle /> Drop Off
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PendingDeliveries;
