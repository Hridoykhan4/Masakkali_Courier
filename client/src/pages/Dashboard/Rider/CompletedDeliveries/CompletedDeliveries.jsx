import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

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
      toast.success("Cashout successful");
      queryClient.invalidateQueries(["completedDeliveries"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Cashout failed");
    },
  });

  const handleCashout = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-800">
            Are you sure you want to cash out?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                cashoutParcel(id);
                closeToast();
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm transition"
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        icon: false,
      },
    );
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return <div className="text-center text-red-500">Failed to load</div>;

  const totalEarning = deliveries.reduce((sum, d) => sum + (d.earning || 0), 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">
        Completed Deliveries ({deliveries.length})
      </h2>

      <p className="mb-4 font-medium text-green-600">
        Total Earned: ৳ {totalEarning}
      </p>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th>Receiver</th>
              <th>Delivered At</th>
              <th>Type</th>
              <th>Earning</th>
              <th>Status</th>
              <th>Cashout</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td className="font-mono">{p.trackingId}</td>
                <td>{p.receiverName}</td>
                <td>
                  {p.delivered_at && new Date(p.delivered_at).toLocaleString()}
                </td>
                <td>{p.delivery_type}</td>
                <td className="font-semibold">৳ {p.earning}</td>
                <td>
                  <span className="badge badge-outline">
                    {p.cashout_status}
                  </span>
                </td>
                <td>
                  {p.cashout_status === "cashed_out" ? (
                    <span className="badge text-xs whitespace-nowrap px-2 badge-success">
                      Cashed Out
                    </span>
                  ) : (
                    <button
                      disabled={isPending}
                      onClick={() => handleCashout(p._id)}
                      className="btn btn-sm btn-warning"
                    >
                      {isPending ? "Processing..." : "Cashout"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedDeliveries;
