import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useState } from "react";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaMotorcycle,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");

  const { data: riders = [], isLoading } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  const filteredRiders = riders?.filter(
    (r) =>
      r.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      r.phone.includes(search),
  );

  if (isLoading)
    return (
      <div className="p-20">
        <ErrorLoadingState isPending />
      </div>
    );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* --- HEADER & SEARCH COMMAND --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-base-100 p-8 rounded-[2.5rem] shadow-sm border border-base-content/5">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
            Active <span className="text-primary">Fleet</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">
            Real-time verified logistics personnel
          </p>
        </div>

        <div className="relative w-full max-w-md group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="input input-lg w-full pl-14 rounded-2xl bg-base-200/50 border-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- RIDERS GRID/TABLE --- */}
      <div className="bg-base-100 rounded-[3rem] shadow-2xl shadow-primary/5 border border-base-content/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg w-full">
            <thead>
              <tr className="bg-base-200/50 border-none">
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 py-6 pl-10">
                  Rider Detail
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Operating Zone
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Equipment
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Verification
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right pr-10">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              <AnimatePresence mode="popLayout">
                {filteredRiders.map((rider) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={rider._id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    {/* Rider Detail */}
                    <td className="pl-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic shadow-inner">
                          {rider.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-sm uppercase tracking-tight">
                            {rider.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-40 mt-1">
                            <FaPhoneAlt size={8} /> {rider.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Zone */}
                    <td>
                      <div className="flex items-center gap-2 text-xs font-bold italic">
                        <FaMapMarkedAlt className="text-primary/50" />
                        <span>{rider.district}</span>
                        <span className="opacity-30">/</span>
                        <span className="opacity-50">{rider.region}</span>
                      </div>
                    </td>

                    {/* Bike */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FaMotorcycle className="opacity-20" />
                        <span className="text-xs font-black uppercase tracking-tighter italic bg-base-200 px-3 py-1 rounded-lg">
                          {rider.bikeBrand}
                        </span>
                      </div>
                    </td>

                    {/* Verification Date */}
                    <td>
                      <div className="flex items-center gap-2 text-[10px] font-bold opacity-50">
                        <FaCalendarAlt />
                        {new Date(rider.reviewedAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="pr-10 text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-xl">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-success">
                          Active
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredRiders.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex w-20 h-20 bg-base-200 rounded-full items-center justify-center mb-4 opacity-20">
              <FaSearch size={30} />
            </div>
            <h3 className="font-black italic uppercase opacity-20 text-2xl tracking-tighter">
              Zero Riders Detected
            </h3>
            <p className="text-xs font-bold opacity-30 uppercase tracking-widest mt-2">
              Adjust your frequency (search) and try again
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRiders;
