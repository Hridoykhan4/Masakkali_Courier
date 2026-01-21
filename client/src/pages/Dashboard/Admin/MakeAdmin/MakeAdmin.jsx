import { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";
import { FaUserShield, FaUserTimes, FaSearch, FaTimes } from "react-icons/fa";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  // 1. Fetching Users
  const {
    data: users = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["usersSearch"],
    queryFn: async () => {
      const res = await axiosSecure(`/users/search?searchQuery=${query}`);
      return res.data;
    },
    enabled: false,
  });

  const handleSearch = () => {
    if (query.trim()) refetch();
  };

  // 2. Role Mutation
  const mutation = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      refetch();
      toast.success("User role updated successfully!");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update role"),
  });

  const { mutate: updateRole } = mutation;

  // 3. Handle Role Logic
  const handleRoleChange = (id, currentRole) => {
    // Extra safety: Check if rider
    if (currentRole === "rider") {
      return toast.error("Riders cannot be promoted to Admin.");
    }

    const isCurrentlyAdmin = currentRole === "admin";
    const newRole = isCurrentlyAdmin ? "user" : "admin";

    toast.info(
      ({ closeToast }) => (
        <div className="p-1">
          <p className="font-bold text-lg mb-1">
            {isCurrentlyAdmin ? "Demote User" : "Promote User"}
          </p>
          <p className="text-sm opacity-80 mb-4">
            {isCurrentlyAdmin
              ? "Remove Admin Privileges?"
              : "Promote to Admin?"}
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={closeToast} className="btn btn-xs btn-ghost">
              Cancel
            </button>
            <button
              onClick={() => {
                updateRole({ id, role: newRole });
                closeToast();
              }}
              className={`btn btn-xs ${isCurrentlyAdmin ? "btn-error" : "btn-primary"}`}
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false },
    );
  };

  if (isLoading) return <ErrorLoadingState isPending={isLoading} />;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-5">
        <h2 className="text-3xl font-extrabold tracking-tight">
          User Management
        </h2>
        <p className="text-base-content/70">
          Search and manage administrative roles
        </p>
      </div>

      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10 bg-base-200 p-4 rounded-2xl shadow-sm border border-base-300">
        <div className="relative grow">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input input-bordered w-full pl-10 focus:outline-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                queryClient.setQueryData(["usersSearch"], []);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-error transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isFetching}
          className="btn btn-primary px-8"
        >
          {isFetching ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg w-full">
            <thead className="bg-base-200">
              <tr className="text-base-content/70">
                <th className="font-bold">USER INFO</th>
                <th className="font-bold">ROLE</th>
                <th className="font-bold">MEMBER SINCE</th>
                <th className="font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                // Check if this specific user is being updated right now
                const isThisUserUpdating =
                  mutation.variables?.id === user._id && mutation.isPending;

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-base-200/50 transition-colors"
                  >
                    <td>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </td>
                    <td>
                      <div
                        className={`badge badge-md font-medium capitalize 
                        ${
                          user?.role === "admin"
                            ? "badge-primary"
                            : user?.role === "rider"
                              ? "badge-secondary"
                              : "badge-ghost border-base-300"
                        }`}
                      >
                        {user.role || "user"}
                      </div>
                    </td>
                    <td className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-right">
                      {user.role !== "rider" ? (
                        <button
                          onClick={() =>
                            handleRoleChange(user._id, user?.role || "user")
                          }
                          disabled={isThisUserUpdating}
                          className={`btn btn-sm btn-outline gap-2 ${user.role === "admin" ? "btn-error" : "btn-primary"}`}
                        >
                          {isThisUserUpdating ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : user.role === "admin" ? (
                            <>
                              <FaUserTimes /> Revoke Admin
                            </>
                          ) : (
                            <>
                              <FaUserShield /> Grant Admin
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-xs opacity-40 italic">
                          Rider Restricted
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !isFetching && (
          <div className="py-20 flex flex-col items-center opacity-40">
            <FaSearch size={48} className="mb-4" />
            <p className="text-xl font-medium">No results found</p>
            <p className="text-sm">Try searching for a user name or email</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
