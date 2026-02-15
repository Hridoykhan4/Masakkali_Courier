import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["rider-tasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/tasks");
      return res.data;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: true

  });
  const pickupMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/parcels/${id}/pickup`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-tasks"] });
      toast.success("Parcel picked up 🚀");
      refetch();
    },
    onError: (error) => {
      console.error(
        "Error picking up parcel:",
        error.response?.data || error.message,
      );
      toast.error("Failed to pick up parcel ❌");
    },
  });

  const deliverMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/parcels/${id}/deliver`),    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rider-tasks"] });
      toast.success("Parcel delivered ✅");
      refetch();
    },
  });

  if (isLoading) return <ErrorLoadingState isPending />;

  return (
    <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Parcel</th>
            <th>Sender → Receiver</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {parcels.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-6 font-semibold">
                No pending deliveries 🏍
              </td>
            </tr>
          )}

          {parcels.map((p) => (
            <tr key={p._id}>
              <td className="font-mono text-xs">{p.trackingId}</td>
              <td>
                <p className="font-bold">{p.title}</p>
                <p className="text-xs opacity-70">{p.parcelType}</p>
              </td>
              <td className="text-sm">
                {p.senderServiceCenter} → {p.receiverServiceCenter}
              </td>
              <td>৳{p.cost}</td>
              <td>
                <span
                  className={`badge ${
                    p.delivery_status === "assigned"
                      ? "badge-warning"
                      : "badge-info"
                  }`}
                >
                  {p.delivery_status}
                </span>
              </td>
              <td>
                {p.delivery_status === "assigned" && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => pickupMutation.mutate(p._id)}
                  >
                    Picked Up
                  </button>
                )}

                {p.delivery_status === "in-transit" && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => deliverMutation.mutate(p._id)}
                  >
                    Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingDeliveries;
