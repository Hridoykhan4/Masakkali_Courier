import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaMotorcycle } from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import { useState } from "react";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* ----------------------------------
     FETCH ASSIGNABLE PARCELS
  -----------------------------------*/
  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/parcels?payment_status=paid&delivery_status=not-collected",
      );
      return res.data;
    },
  });

  const { data: riders = [], isLoading: ridersLoading } = useQuery({
    queryKey: ["available-riders", selectedParcel?.senderServiceCenter],
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/riders/available?district=${selectedParcel?.senderServiceCenter}`,
      );
      return data;
    },
    enabled: !!selectedParcel,
  });

  /* ----------------------------------
     ASSIGN RIDER MUTATION (placeholder)
  -----------------------------------*/
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, riderId }) => {
      return axiosSecure.patch(`/parcels/${parcelId}/assign-rider`, {
        riderId,
      });
    },
    onSuccess: () => {
      toast.success("Rider assigned successfully");
      refetch();
      setIsModalOpen(false)
    },
    onError: () => {
      toast.error("Failed to assign rider");
    },
  });

  if (isLoading || isError) {
    return <ErrorLoadingState isError={isError} />;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Assign Rider to Parcels</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Sender Region</th>
              <th>Receiver Region</th>
              <th>Cost (৳)</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td className="font-mono text-sm">{parcel.trackingId}</td>
                <td>{parcel.senderName}</td>
                <td>{parcel.senderRegion}</td>
                <td>{parcel.receiverRegion}</td>
                <td>{parcel.cost}</td>
                <td>{new Date(parcel.creation_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary gap-2"
                    onClick={() => {
                      setSelectedParcel(parcel);
                      setIsModalOpen(true);
                    }}
                  >
                    <FaMotorcycle />
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}

            {parcels.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No assignable parcels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isModalOpen && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                Assign Rider — {selectedParcel.senderServiceCenter}
              </h3>

              {ridersLoading ? (
                <ErrorLoadingState isPending />
              ) : riders.length === 0 ? (
                <p className="text-center font-semibold">No riders available</p>
              ) : (
                <ul className="space-y-2">
                  {riders.map((rider) => (
                    <li
                      key={rider._id}
                      className="flex justify-between items-center border p-2 rounded"
                    >
                      <div>
                        <p className="font-semibold">{rider.name}</p>
                        <p className="text-sm">{rider.phone}</p>
                      </div>

                      <button
                        className="btn btn-sm btn-success"
                        onClick={() =>
                          assignRiderMutation.mutate({
                            parcelId: selectedParcel._id,
                            riderId: rider?._id,
                          })
                        }
                      >
                        Assign
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="modal-action">
                <button className="btn" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default AssignRider;
