import { toast } from "react-toastify";
import ParcelForm from "../../components/parcel/ParcelForm";
import useAuthValue from "../../hooks/useAuthValue";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useScrollTo from "../../hooks/useScrollTo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const SendParcel = () => {
  useScrollTo();
  const { user } = useAuthValue();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
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
        });
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
    <ParcelForm
      mode="create"
      defaultValues={{ senderName: user?.displayName || "" }}
      onSubmitParcel={handleSendParcel}
    ></ParcelForm>
  );
};

export default SendParcel;
