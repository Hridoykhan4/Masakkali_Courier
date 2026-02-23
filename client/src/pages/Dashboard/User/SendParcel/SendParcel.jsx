import { toast } from "react-toastify";
import ParcelForm from "../../../../components/parcel/ParcelForm";
import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useScrollTo from "../../../../hooks/useScrollTo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion as Motion } from "framer-motion";
import useTheme from "../../../../hooks/useTheme";
const SendParcel = () => {
  useScrollTo();
  const { user } = useAuthValue();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { theme } = useTheme();
  const nav = useNavigate();
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (parcel) => {
      const { data } = await axiosSecure.post("/parcels", parcel);
      return data;
    },
    onSuccess: (data) => {
      ["my-parcels"].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key], exact: false }),
      );
      if (data?.insertedId) {
        toast.success("Parcel placed successfully", {
          className: "font-medium text-lg tracking-wide",
          autoClose: 1500,
          theme: theme === "light" ? "light" : "dark",
        });
        nav(`/dashboard/myParcels`);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to place parcel", {
        theme: theme === "light" ? "light" : "dark",
      });
    },
  });

  const handleSendParcel = async (parcelData, { onSuccess }) => {
    const { weight, ...parcel } = parcelData;
    parcel.weight = weight ? parseFloat(weight) : null;
    await mutateAsync(parcel);
    onSuccess?.();
  };

  if (isPending)
    return (
      <div className="flex flex-col justify-center items-center min-h-100 space-y-6 animate-pulse">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-ping" />
          <div className="relative bg-base-200 p-6 rounded-3xl border border-primary/20">
            <span className="loading loading-ring loading-lg text-primary"></span>
          </div>
        </div>

        {/* 2. THE STATUS TEXT */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">
            Initializing <span className="text-primary">Shipment</span>
          </h3>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-[0.3em]">
              Syncing with Global Node
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
          </div>
        </div>

        {/* 3. THE UX SAFETY NET */}
        <p className="text-[10px] text-base-content/30 font-medium max-w-50 text-center leading-relaxed">
          Please do not refresh or close this window while we secure your slot.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen container-page section-spacing">
      <div>
        <header className="mb-4 md:mb-10 text-center md:text-left">
          <Motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black tracking-tight"
          >
            Send a <span className="text-primary">Parcel</span>
          </Motion.h1>
          <p className="text-base-content/50 mt-2 font-medium">
            Complete the details below to generate your shipping label.
          </p>
        </header>

        <ParcelForm
          mode="create"
          defaultValues={{ senderName: user?.displayName || "" }}
          onSubmitParcel={handleSendParcel}
        />
      </div>
    </div>
  );
};

export default SendParcel;
