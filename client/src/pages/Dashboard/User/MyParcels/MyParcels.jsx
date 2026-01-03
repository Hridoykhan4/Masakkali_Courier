import useMyParcels from "../../../../hooks/useMyParcels";
import { Link } from "react-router";
import { FaEye, FaTrash, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const deliveryStatus = (status) => {
  const allStatus = {
    "not-collected": "text-red-500",
    collected: "text-green-500",
  };
  return allStatus[status] || "text-gray-600";
};
const MyParcels = () => {
  const { myParcels, isPending, isError, error } = useMyParcels();
  const [deletingId, setDeletingId] = useState(null);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { mutate: deleteParcel, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/parcels/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Parcel deleted successfully", {
        autoClose: 1000,
      });
      queryClient.invalidateQueries(["my-parcels"]);
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Delete failed");
      setDeletingId(null);
    },
  });

  const handleDeleteParcel = async (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-800">
            Are you sure you want to remove the parcel?
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
                deleteParcel(id);
                setDeletingId(id);
                closeToast();
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm transition"
            >
              Confirm
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
      }
    );
  };

  return (
    <div className="overflow-x-auto bg-base-100 shadow rounded-lg p-4">
      <h2 className="text-2xl font-semibold mb-4">My Parcels</h2>

      <ErrorLoadingState
        error={error}
        isError={isError}
        isPending={isPending}
      ></ErrorLoadingState>

      {myParcels?.length > 0 && (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Route</th>
              <th>Cost (৳)</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {myParcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>

                <td className="font-mono text-sm">{parcel.tracking_id}</td>

                <td>{parcel.title}</td>

                <td>
                  <span
                    className={`badge ${
                      parcel?.type === "document"
                        ? "text-orange-500"
                        : "text-yellow-500"
                    } capitalize`}
                  >
                    {parcel.parcelType}
                  </span>
                </td>

                <td>
                  {parcel.senderRegion} → {parcel.receiverRegion}
                </td>

                <td className="font-semibold">{parcel.cost}</td>

                {/* Payment Status */}
                <td>
                  <span
                    className={`btn btn-xs text-base-content ${
                      parcel.payment_status === "paid"
                        ? "btn-success"
                        : "btn-error"
                    }`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>

                {/* Delivery Status */}
                <td>
                  <span
                    className={`capitalize ${deliveryStatus(
                      parcel?.delivery_status
                    )}`}
                  >
                    {parcel.delivery_status.replace("-", " ")}
                  </span>
                </td>

                {/* Actions */}
                <td className="flex gap-2">
                  <Link
                    to={`/dashboard/parcels/${parcel._id}`}
                    className="btn btn-xs btn-outline"
                    title="View Details"
                  >
                    <FaEye />
                  </Link>

                  {parcel.payment_status === "unpaid" && (
                    <Link
                      to={`/dashboard/payment/${parcel._id}`}
                      className="btn btn-xs btn-primary"
                      title="Pay Now"
                    >
                      <FaCreditCard />
                    </Link>
                  )}

                  <button
                    onClick={() => handleDeleteParcel(parcel?._id)}
                    className="btn btn-xs btn-error"
                    title="Delete Parcel"
                  >
                    {isDeleting && deletingId === parcel._id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {myParcels.length === 0 && (
        <p className="text-center text-gray-500 py-6">No parcels found.</p>
      )}
    </div>
  );
};

export default MyParcels;
