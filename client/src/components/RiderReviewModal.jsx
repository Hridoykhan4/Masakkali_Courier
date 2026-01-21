import { toast } from "react-toastify";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useRef } from "react";

const RiderReviewModal = ({ rider, onClose, refetch }) => {
  let isProcessing = useRef(false);
  const axiosSecure = useAxiosSecure();
  const handleDecision = async (status) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-800">
            {status === "approved" ? "Approve" : "Reject"} Application ?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (isProcessing.current) return;
                isProcessing.current = true;
                try {
                  await axiosSecure.patch(`/riders/${rider._id}`, {
                    status,
                  });
                  toast.success(`Rider ${status}`);
                  onClose();
                  closeToast();
                  refetch();
                } catch (err) {
                  toast.error(err?.response?.data?.message || "Action Failed", {
                    position: "top-right",
                    autoClose: 1500,
                  });
                  isProcessing.current = false;
                }
              }}
              className={`px-3 py-1 text-sm rounded-md text-white transition
                 ${
                   status === "approved"
                     ? "bg-green-500 hover:bg-green-600"
                     : "bg-red-500 hover:bg-red-600"
                 }`}
            >
              Yes, {status === "approved" ? "Approve" : "Reject"}
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

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl">
        <h3 className="font-bold text-lg">Rider Details</h3>
        <div className="space-y-2 mt-4 text-sm">
          <p>
            <b>Name:</b> {rider.name}
          </p>
          <p>
            <b>Email:</b> {rider.email}
          </p>
          <p>
            <b>Phone:</b> {rider.phone}
          </p>
          <p>
            <b>Age:</b> {rider.age}
          </p>
          <p>
            <b>Region:</b> {rider.region}
          </p>
          <p>
            <b>District:</b> {rider.district}
          </p>
          <p>
            <b>NID:</b> ****{rider.nid.slice(-4)}
          </p>
          <p>
            <b>Bike:</b> {rider.bikeBrand}
          </p>
          <p>
            <b>Registration:</b> {rider.bikeRegistration}
          </p>
        </div>
        <div className="modal-action">
          <button
            onClick={() => handleDecision("approved")}
            className="btn btn-success"
          >
            Approve
          </button>

          <button
            onClick={() => handleDecision("rejected")}
            className="btn btn-error"
          >
            Reject
          </button>
          <button onClick={onClose} className="btn">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default RiderReviewModal;
