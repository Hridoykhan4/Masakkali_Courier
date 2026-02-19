import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { 
  FaTrash, FaCreditCard, FaMapMarkerAlt, FaCopy, 
  FaBox, FaHistory, FaShippingFast, FaArrowRight 
} from "react-icons/fa";

import useMyParcels from "../../../../hooks/useMyParcels";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const MyParcels = () => {
  const { myParcels, isPending, isError, error } = useMyParcels();
  const [deletingId, setDeletingId] = useState(null);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for Deleting/Cancelling
  const { mutate: deleteParcel, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/parcels/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Shipment Cancelled successfully");
      queryClient.invalidateQueries(["my-parcels"]);
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Action failed");
      setDeletingId(null);
    },
  });

  const copyAndNavigate = (tid) => {
    navigator.clipboard.writeText(tid);
    toast.success(
      <div className="flex flex-col">
        <span className="font-bold">ID Copied to Clipboard!</span>
        <span className="text-xs opacity-70">Redirecting to Live Tracking...</span>
      </div>, 
      { position: "bottom-center", autoClose: 1500 }
    );
    
    // Smooth delay before navigation to let the toast be seen
    setTimeout(() => {
      navigate(`/dashboard/track?tid=${tid}`);
    }, 800);
  };

  const handleDeleteConfirm = (id) => {
    toast.warn(({ closeToast }) => (
      <div className="p-2">
        <p className="font-bold text-sm mb-3 text-base-content">Cancel this shipment?</p>
        <div className="flex gap-2">
          <button onClick={closeToast} className="btn btn-xs btn-ghost text-base-content/50">Keep it</button>
          <button onClick={() => { deleteParcel(id); setDeletingId(id); closeToast(); }} className="btn btn-xs btn-error">Yes, Cancel</button>
        </div>
      </div>
    ), { position: "top-center", autoClose: false, closeOnClick: false });
  };

  if (isPending || isError) return <ErrorLoadingState error={error} isError={isError} isPending={isPending} />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* --- PREMIERE HERO SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral text-neutral-content p-8 rounded-[3rem] relative overflow-hidden flex flex-col justify-center shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <FaShippingFast size={180} />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase relative z-10 leading-none">
            Your Active <br /> <span className="text-primary">Shipments</span>
          </h2>
          <p className="mt-4 opacity-70 max-w-sm font-medium relative z-10">
            Track, manage, and pay for your deliveries across the Masakkali network in real-time.
          </p>
          <div className="mt-8 flex gap-3 relative z-10">
            <Link to="/sendParcel" className="btn btn-primary rounded-2xl px-8 font-black italic uppercase">
              Send a Parcel
            </Link>
          </div>
        </div>

        {/* Dynamic Tracking Card (Suggesting the link you requested) */}
        <div className="bg-primary/10 border border-primary/20 p-8 rounded-[3rem] flex flex-col justify-between group cursor-pointer hover:bg-primary/20 transition-all shadow-xl shadow-primary/5"
             onClick={() => copyAndNavigate("PCL-20260216-LTMDE")}>
          <div>
            <div className="bg-primary text-primary-content w-10 h-10 rounded-xl flex items-center justify-center mb-4">
              <FaHistory />
            </div>
            <h3 className="font-black uppercase italic text-lg leading-tight">Quick Track <br/> Latest Order</h3>
            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-2">PCL-20260216-LTMDE</p>
          </div>
          <div className="flex items-center gap-2 text-primary font-black text-sm group-hover:gap-4 transition-all">
            GO TO TRACKING <FaArrowRight />
          </div>
        </div>
      </div>

      {/* --- SHIPMENT TABLE --- */}
      <div className="bg-base-100 rounded-[3rem] shadow-2xl shadow-primary/5 border border-base-content/5 overflow-hidden">
        <div className="p-8 border-b border-base-content/5">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 italic">Click Tracking ID to copy & navigate</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/30 border-none">
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 py-6 pl-10">Consignment</th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">Route Details</th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">Valuation</th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right pr-10">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              <AnimatePresence mode="popLayout">
                {myParcels.map((parcel) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    key={parcel._id} 
                    className="hover:bg-primary/[0.03] transition-colors group"
                  >
                    {/* Consignment */}
                    <td className="pl-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-3xl bg-base-200 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                          <FaBox size={22} />
                        </div>
                        <div>
                          <div className="font-black text-base uppercase tracking-tight italic">{parcel.title}</div>
                          <button 
                            onClick={() => copyAndNavigate(parcel.trackingId)}
                            className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-primary mt-1 hover:underline"
                          >
                            <FaCopy size={11} /> {parcel.trackingId}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Route Details */}
                    <td>
                      <div className="flex items-center gap-4 text-xs font-bold italic">
                        <span className="bg-base-200 px-3 py-1 rounded-lg">{parcel.senderRegion}</span>
                        <FaMapMarkerAlt className="text-primary animate-pulse" size={12} />
                        <span className="bg-base-200 px-3 py-1 rounded-lg">{parcel.receiverRegion}</span>
                      </div>
                    </td>

                    {/* Valuation */}
                    <td>
                      <div className="font-black text-xl tracking-tighter">৳{parcel.cost}</div>
                      <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block mt-1 ${
                        parcel.payment_status === 'paid' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                      }`}>
                        {parcel.payment_status}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                        parcel.delivery_status === 'delivered' ? 'text-success' : 
                        parcel.delivery_status === 'collected' ? 'text-info' : 'text-warning'
                      }`}>
                        <span className={`w-2 h-2 rounded-full animate-ping ${
                          parcel.delivery_status === 'delivered' ? 'bg-success' : 
                          parcel.delivery_status === 'collected' ? 'bg-info' : 'bg-warning'
                        }`} />
                        {parcel.delivery_status.replace("-", " ")}
                      </div>
                    </td>

                    {/* Management Actions */}
                    <td className="pr-10">
                      <div className="flex justify-end gap-3">
                        <Link 
                          to={`/dashboard/track?tid=${parcel.trackingId}`}
                          className="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-all border border-base-content/5"
                          title="Track Progress"
                        >
                          <FaHistory size={14} />
                        </Link>

                        {parcel.payment_status === "unpaid" && (
                          <>
                            <Link 
                              to={`/dashboard/payment/${parcel._id}`}
                              className="btn btn-circle btn-sm btn-primary shadow-lg shadow-primary/20"
                              title="Checkout Now"
                            >
                              <FaCreditCard size={14} />
                            </Link>
                            <button 
                              onClick={() => handleDeleteConfirm(parcel._id)}
                              disabled={isDeleting && deletingId === parcel._id}
                              className="btn btn-circle btn-sm btn-outline btn-error hover:text-white"
                            >
                              {isDeleting && deletingId === parcel._id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : <FaTrash size={12} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {myParcels.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex w-20 h-20 bg-base-200 rounded-full items-center justify-center mb-4 opacity-50">
              <FaBox size={30} />
            </div>
            <h3 className="font-black italic uppercase opacity-20 text-2xl tracking-tighter">No Shipments Found</h3>
            <Link to="/dashboard/send-parcel" className="btn btn-link no-underline font-bold text-primary mt-2">Book your first parcel now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcels;