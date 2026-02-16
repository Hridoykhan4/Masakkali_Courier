import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FaMotorcycle,
  FaUserTie,
  FaBox,
  FaClock,
  FaTimes,
  FaMapPin,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* --- FETCH ASSIGNABLE PARCELS --- */
  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not-collected",
      );
      return res.data;
    },
  });

  /* --- FETCH RIDERS BY SERVICE CENTER --- */
  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["available-riders", selectedParcel?.senderServiceCenter],
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/riders/available?district=${selectedParcel?.senderServiceCenter}`,
      );
      return data;
    },
    enabled: !!selectedParcel,
  });

  /* --- ASSIGN RIDER MUTATION --- */
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, riderId }) => {
      return axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, {
        riderId,
      });
    },
    onSuccess: () => {
      toast.success("Logistics Updated: Rider Dispatched", {
        position: "top-right",
      });
      queryClient.invalidateQueries(["assignableParcels"]);
      setIsModalOpen(false);
      setSelectedParcel(null);
    },
    onError: () => toast.error("Assignment Failed"),
  });

  if (isLoading || isError)
    return (
      <div className="p-10">
        <ErrorLoadingState isError={isError} isPending={isLoading} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* --- Page Header --- */}
      <div className="bg-base-100 p-8 rounded-[2.5rem] shadow-sm border border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
            <FaMotorcycle className="text-primary" /> Dispatch Center
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">
            Assign logistics personnel to paid consignments
          </p>
        </div>
        <div className="stats bg-base-200/50 rounded-2xl border border-base-content/5">
          <div className="stat py-2 px-6">
            <div className="stat-title text-[10px] font-bold uppercase">
              Pending Pickup
            </div>
            <div className="stat-value text-2xl text-primary italic font-black">
              {parcels.length}
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Table --- */}
      <div className="bg-base-100 rounded-[3rem] shadow-2xl shadow-primary/5 border border-base-content/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200/50">
              <tr className="border-none">
                <th className="text-[10px] font-black uppercase tracking-widest opacity-50 py-6 pl-10">
                  Parcel ID
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-50">
                  Logistics Info
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-50">
                  Station
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-50">
                  Booking Date
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-50 text-right pr-10">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              <AnimatePresence mode="popLayout">
                {parcels.map((parcel) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={parcel._id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="pl-10">
                      <div className="font-mono text-xs font-black text-primary">
                        {parcel.trackingId}
                      </div>
                      <div className="text-[10px] uppercase font-bold opacity-30 mt-1">
                        Paid Shipment
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-xs font-black italic uppercase">
                        {parcel.senderRegion}{" "}
                        <FaMapPin size={10} className="text-primary" />{" "}
                        {parcel.receiverRegion}
                      </div>
                      <div className="text-[10px] opacity-40 font-bold mt-1">
                        Sender: {parcel.senderName}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline border-primary/20 text-[10px] font-black uppercase py-3 px-4 rounded-xl">
                        {parcel.senderServiceCenter}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                        <FaClock size={12} />{" "}
                        {new Date(parcel.creation_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="pr-10 text-right">
                      <button
                        className="btn btn-sm btn-primary rounded-xl font-black italic uppercase tracking-tighter"
                        onClick={() => {
                          setSelectedParcel(parcel);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaMotorcycle /> Assign
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PRO LEVEL MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral/80 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-base-100 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-base-content/5"
            >
              {/* Modal Header */}
              <div className="p-8 bg-primary text-primary-content flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                    Rider Selection
                  </h3>
                  <p className="text-[10px] font-bold uppercase opacity-70 mt-2 tracking-widest">
                    Station: {selectedParcel?.senderServiceCenter}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-circle btn-sm btn-ghost bg-white/10"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Rider List */}
              <div className="p-8 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {ridersLoading ? (
                  <div className="flex justify-center py-10">
                    <span className="loading loading-bars loading-lg text-primary"></span>
                  </div>
                ) : riders.length === 0 ? (
                  <div className="text-center py-10 opacity-30">
                    <FaUserTie size={40} className="mx-auto mb-4" />
                    <p className="font-black italic uppercase tracking-widest">
                      No Active Riders in District
                    </p>
                  </div>
                ) : (
                  riders.map((rider) => (
                    <div
                      key={rider._id}
                      className="group flex justify-between items-center p-4 rounded-2xl border border-base-content/5 hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <FaUserTie size={20} />
                        </div>
                        <div>
                          <p className="font-black uppercase italic tracking-tight">
                            {rider.name}
                          </p>
                          <p className="text-[10px] font-bold opacity-40">
                            {rider.phone}
                          </p>
                        </div>
                      </div>

                      <button
                        className="btn btn-sm btn-primary rounded-lg font-black italic"
                        disabled={assignRiderMutation.isPending}
                        onClick={() =>
                          assignRiderMutation.mutate({
                            parcelId: selectedParcel._id,
                            riderId: rider._id,
                          })
                        }
                      >
                        {assignRiderMutation.isPending ? "..." : "Assign"}
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 bg-base-200/50 text-center">
                <p className="text-[9px] font-bold uppercase opacity-30 tracking-widest">
                  Assigning a rider will update the parcel status to "Collected"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignRider;
