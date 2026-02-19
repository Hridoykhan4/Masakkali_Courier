import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckDouble,
  FaWallet,
  FaHistory,
  FaCalendarCheck,
  FaReceipt,
  FaHandHoldingUsd,
} from "react-icons/fa";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: deliveries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completedDeliveries"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/completed-deliveries");
      return res.data.data;
    },
  });



  const { mutate: cashoutParcel, isPending } = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Transaction Secured: Balance Updated", {
        icon: <FaWallet />,
      });
      queryClient.invalidateQueries(["completedDeliveries"]);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Protocol Failure: Cashout Failed",
      );
    },
  });

  const handleCashout = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="p-1">
          <h4 className="font-black italic uppercase text-sm mb-1">
            Confirm Settlement
          </h4>
          <p className="text-[10px] font-bold opacity-70 mb-4 uppercase tracking-tighter">
            Transfer earnings to your primary wallet?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="btn btn-xs btn-ghost uppercase font-black italic"
            >
              Abort
            </button>
            <button
              onClick={() => {
                cashoutParcel(id);
                closeToast();
              }}
              className="btn btn-xs btn-primary uppercase font-black italic px-4"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false },
    );
  };

  if (isLoading)
    return (
      <div className="p-20">
        <ErrorLoadingState isPending={true} />
      </div>
    );
  if (isError)
    return (
      <div className="p-20">
        <ErrorLoadingState isError={true} />
      </div>
    );

 const totalEarning = deliveries.reduce((sum, d) => {
  // Defensive check: Ensure we handle cases where earning might be a string or undefined
  const amount = typeof d.earning === 'number' ? d.earning : parseFloat(d.earning || 0);
  return sum + amount;
}, 0);

console.log(totalEarning);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* --- Earnings Dashboard Header --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-base-100 p-8 rounded-[2.5rem] shadow-sm border border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none flex items-center gap-3">
              <FaHistory className="text-primary/40" /> Archive{" "}
              <span className="text-primary">Missions</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">
              Historical Log of Successfully Dispatched Consignments
            </p>
          </div>
          <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-3xl border border-base-content/5">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase opacity-40">
                Total Volume
              </p>
              <p className="text-xl font-black italic tracking-tighter">
                {deliveries.length} Parcels
              </p>
            </div>
            <div className="divider divider-horizontal m-0"></div>
            <FaCheckDouble className="text-success text-2xl" />
          </div>
        </div>

        {/* --- Total Earnings Card --- */}
        <div className="bg-primary text-primary-content p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
          <FaWallet className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
            Settled Revenue
          </p>
          <h3 className="text-5xl font-black italic tracking-tighter mt-2">
            ৳{totalEarning.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-content animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase italic">
              Withdrawal Eligible
            </span>
          </div>
        </div>
      </div>

      {/* --- History Matrix --- */}
      <div className="bg-base-100 rounded-[3rem] shadow-2xl shadow-primary/5 border border-base-content/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg w-full">
            <thead>
              <tr className="bg-base-200/50 border-none">
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 py-6 pl-10">
                  Consignment
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Destination Info
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Timestamp
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Revenue
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right pr-10">
                  Protocol
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              <AnimatePresence mode="popLayout">
                {deliveries.map((p, i) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={p._id}
                    className="hover:bg-primary/[0.02] transition-colors group"
                  >
                    <td className="pl-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-xs font-black italic opacity-40">
                          #{i + 1}
                        </div>
                        <div>
                          <div className="font-mono text-xs font-black text-primary tracking-tighter">
                            {p.trackingId}
                          </div>
                          <div className="text-[10px] font-bold opacity-30 uppercase mt-0.5">
                            {p.delivery_type} Service
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-black text-sm uppercase italic tracking-tight">
                        {p.receiverName}
                      </div>
                      <div className="text-[10px] font-bold opacity-40 flex items-center gap-1 mt-1">
                        <FaReceipt className="text-[8px]" /> Signed & Verified
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-[11px] font-bold opacity-50">
                        <FaCalendarCheck className="text-success" />
                        {new Date(p.delivered_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="text-lg font-black italic tracking-tighter text-success">
                        ৳{p.earning}
                      </div>
                    </td>
                    <td className="pr-10 text-right">
                      {p.cashout_status === "cashed_out" ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-xl border border-success/20">
                          <span className="text-[10px] font-black uppercase tracking-widest text-success">
                            Settled
                          </span>
                        </div>
                      ) : (
                        <button
                          disabled={isPending}
                          onClick={() => handleCashout(p._id)}
                          className="btn btn-sm btn-warning rounded-xl font-black italic uppercase tracking-tighter shadow-lg shadow-warning/10 hover:shadow-warning/20 border-none px-6"
                        >
                          {isPending ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <>
                              <FaHandHoldingUsd /> Cashout
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {deliveries.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6 mx-auto opacity-20">
              <FaHistory size={40} />
            </div>
            <h3 className="text-2xl font-black italic uppercase opacity-20 tracking-tighter">
              No Mission History
            </h3>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-2">
              Start a dispatch mission to see earnings here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
