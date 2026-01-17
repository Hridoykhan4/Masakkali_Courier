import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useState } from "react";
import { toast } from "react-toastify";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["active-riders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  const filteredRiders = riders?.filter(
    (r) =>
      r.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      r.phone.includes(search),
  );

  const handleDeactivate = async (id) => {
    try {
      await axiosSecure.patch(`/riders/${id}/deactivate`);
      toast.success("Rider deactivated");
      refetch();
    } catch {
      toast.error("Failed to deactivate rider");
    }
  };

  if (isLoading) return <ErrorLoadingState isPending />;
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name or phone"
        className="input input-bordered w-full max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Bike</th>
              <th>Approved</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 font-bold text-lg">
                  No active riders found !!
                </td>
              </tr>
            )}

            {filteredRiders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.phone}</td>
                <td>
                  {rider.district}, {rider.region}
                </td>
                <td>{rider.bikeBrand}</td>
                <td>{new Date(rider.reviewedAt).toLocaleDateString()}</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeactivate(rider._id)}
                    className="btn btn-sm btn-error btn-outline"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRiders;
