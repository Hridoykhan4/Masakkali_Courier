import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserShield,
  FaIdBadge,
  FaMapMarkerAlt,
  FaMotorcycle,
  FaHourglassHalf,
  FaExternalLinkAlt,
} from "react-icons/fa";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import RiderReviewModal from "../../../../components/RiderReviewModal";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="p-20">
        <ErrorLoadingState isPending={true} />
      </div>
    );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* --- Terminal Header --- */}
      <div className="bg-base-100 p-8 rounded-[2.5rem] shadow-sm border border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none flex items-center gap-3">
            <FaUserShield className="text-warning" /> Pending{" "}
            <span className="text-primary">Recruits</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">
            Awaiting background check and fleet verification
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-warning/10 border border-warning/20 px-6 py-3 rounded-2xl text-center">
            <p className="text-[10px] font-black uppercase text-warning opacity-70">
              Backlog
            </p>
            <p className="text-2xl font-black italic leading-none">
              {riders.length}
            </p>
          </div>
        </div>
      </div>

      {/* --- Applications Table --- */}
      <div className="bg-base-100 rounded-[3rem] shadow-2xl shadow-primary/5 border border-base-content/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg w-full">
            <thead>
              <tr className="bg-base-200/50 border-none">
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 py-6 pl-10">
                  Applicant
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Operational Area
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Demographics
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Vehicle
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right pr-10">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              <AnimatePresence mode="popLayout">
                {riders.map((rider) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={rider._id}
                    className="hover:bg-warning/[0.02] transition-colors group"
                  >
                    {/* Applicant Info */}
                    <td className="pl-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 group-hover:text-warning group-hover:bg-warning/10 transition-all border border-transparent group-hover:border-warning/20">
                          <FaIdBadge size={20} />
                        </div>
                        <div>
                          <div className="font-black text-sm uppercase tracking-tight italic">
                            {rider.name}
                          </div>
                          <div className="text-[10px] font-bold opacity-40 mt-1">
                            {rider.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Zone */}
                    <td>
                      <div className="flex items-center gap-2 text-xs font-bold italic">
                        <FaMapMarkerAlt className="text-warning/50" />
                        <span className="uppercase tracking-tighter">
                          {rider.district}
                        </span>
                        <span className="opacity-30">/</span>
                        <span className="opacity-50 lowercase">
                          {rider.region}
                        </span>
                      </div>
                    </td>

                    {/* Stats */}
                    <td>
                      <div className="flex flex-col">
                        <span className="text-xs font-black italic">
                          {rider.age} Years
                        </span>
                        <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">
                          Applied:{" "}
                          {new Date(rider.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="badge badge-outline border-base-content/10 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-lg bg-base-200/30">
                          <FaMotorcycle className="mr-2 opacity-40" />{" "}
                          {rider.bikeBrand}
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="pr-10 text-right">
                      <button
                        className="btn btn-sm btn-outline border-base-content/10 hover:bg-warning hover:border-warning hover:text-warning-content rounded-xl font-black italic uppercase tracking-tighter gap-2"
                        onClick={() => setSelectedRider(rider)}
                      >
                        Review <FaExternalLinkAlt size={10} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {riders.length === 0 && (
          <div className="py-32 text-center bg-base-200/20">
            <div className="inline-flex w-20 h-20 bg-success/10 text-success rounded-full items-center justify-center mb-6">
              <FaHourglassHalf
                size={30}
                className="animate-spin [animation-duration:3s]"
              />
            </div>
            <h3 className="font-black italic uppercase text-2xl tracking-tighter opacity-20">
              Clear Queue
            </h3>
            <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em] mt-2">
              All field agents have been verified
            </p>
          </div>
        )}
      </div>

      {/* --- Modal Integration --- */}
      {selectedRider && (
        <RiderReviewModal
          refetch={refetch}
          rider={selectedRider}
          onClose={() => setSelectedRider(null)}
        />
      )}
    </div>
  );
};

export default PendingRiders;
