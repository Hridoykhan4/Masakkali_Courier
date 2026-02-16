import { toast } from "react-toastify";
import ParcelForm from "../../../../components/parcel/ParcelForm";
import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useScrollTo from "../../../../hooks/useScrollTo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {motion as Motion} from 'framer-motion'
const SendParcel = () => {
  useScrollTo();
  const { user } = useAuthValue();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const nav = useNavigate()
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (parcel) => {
      const { data } = await axiosSecure.post("/parcels", parcel);
      return data;
    },
    onSuccess: (data) => {
      ["my-parcels"].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key], exact: false })
      );
      if (data?.insertedId) {
        toast.success("Parcel placed successfully", {
          className: "font-medium text-lg tracking-wide",
          autoClose: 1500,
        });
        nav(`/dashboard/myParcels`)
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to place parcel");
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
      <div className="flex justify-center items-center min-h-50">
        Placing Order, Wait !!
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );

return (
  <div className="min-h-screen bg-base-200/50 py-12">
    <div className="max-w-5xl mx-auto px-4">
      <header className="mb-10 text-center md:text-left">
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
