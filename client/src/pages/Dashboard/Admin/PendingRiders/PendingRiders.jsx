import { useQuery } from "@tanstack/react-query";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useState } from "react";
import RiderReviewModal from "../../../../components/RiderReviewModal";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pending-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });
  if (isLoading) return <ErrorLoadingState isPending={true} />;
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {riders.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="7" className="text-center py-6 font-semibold">
                No pending rider applications !!
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Age</th>
                <th>Bike</th>
                <th>Applied</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {riders?.map((rider) => (
                <tr key={rider._id}>
                  <td>{rider?.name}</td>
                  <td>{rider?.phone}</td>
                  <td>
                    {rider?.district}, {rider?.region}
                  </td>
                  <td>{rider?.age}</td>
                  <td>{rider?.bikeBrand}</td>
                  <td>{new Date(rider?.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setSelectedRider(rider)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
      {selectedRider && (
        <RiderReviewModal
          refetch={refetch}
          rider={selectedRider}
          onClose={() => setSelectedRider(null)}
        ></RiderReviewModal>
      )}
    </div>
  );
};

export default PendingRiders;
