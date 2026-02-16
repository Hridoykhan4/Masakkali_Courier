import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserShield,
  FaUserTimes,
  FaSearch,
  FaTimes,
  FaFingerprint,
  FaShieldAlt,
} from "react-icons/fa";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import ErrorLoadingState from "../../../../components/ErrorLoadingState";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();

  // --- 1. Fetching Users ---
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
    enabled: false, // Only fetch on manual search
  });

  const handleSearch = () => {
    if (query.trim()) refetch();
  };

  // --- 2. Role Mutation ---
  const mutation = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      refetch();
      toast.success("Security Clearance Updated", { icon: <FaFingerprint /> });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Protocol Failure"),
  });

  const { mutate: updateRole } = mutation;

  // --- 3. Confirmation UI ---
  const handleRoleChange = (id, currentRole) => {
    if (currentRole === "rider") {
      return toast.error("Riders are restricted from Admin protocols.");
    }

    const isCurrentlyAdmin = currentRole === "admin";
    const newRole = isCurrentlyAdmin ? "user" : "admin";

    toast.warn(
      ({ closeToast }) => (
        <div className="p-2">
          <h4 className="font-black italic uppercase text-sm mb-1">
            {isCurrentlyAdmin ? "Security Downgrade" : "Security Upgrade"}
          </h4>
          <p className="text-[10px] font-bold opacity-70 mb-4 uppercase tracking-tighter">
            Confirm role modification for this operative?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="btn btn-xs btn-ghost uppercase font-black italic"
            >
              Abort
            </button>
            <button
              onClick={() => {
                updateRole({ id, role: newRole });
                closeToast();
              }}
              className={`btn btn-xs uppercase font-black italic ${isCurrentlyAdmin ? "btn-error" : "btn-primary"}`}
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false, closeOnClick: false },
    );
  };

  if (isLoading)
    return (
      <div className="p-20">
        <ErrorLoadingState isPending={isLoading} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* --- Vault Header --- */}
      <div className="bg-base-100 p-8 rounded-[2.5rem] shadow-sm border border-base-content/5 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none flex items-center gap-3">
            <FaShieldAlt className="text-primary" /> Authority{" "}
            <span className="text-primary/50">Vault</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mt-2 italic">
            Search and modify operative clearance levels
          </p>
        </div>

        {/* Search Command */}
        <div className="flex w-full max-w-md gap-2 bg-base-200/50 p-2 rounded-2xl border border-base-content/5 focus-within:border-primary/30 transition-all">
          <div className="relative grow">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
            <input
              type="text"
              placeholder="Operative name or email..."
              className="input w-full bg-transparent border-none focus:outline-none pl-12 font-bold text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  queryClient.setQueryData(["usersSearch"], []);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:text-error"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isFetching}
            className="btn btn-primary rounded-xl px-6 font-black italic uppercase italic tracking-tighter"
          >
            {isFetching ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Execute Search"
            )}
          </button>
        </div>
      </div>

      {/* --- Results Matrix --- */}
      <div className="bg-base-100 rounded-[3rem] shadow-2xl shadow-primary/5 border border-base-content/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg w-full">
            <thead>
              <tr className="bg-base-200/50 border-none">
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 py-6 pl-10">
                  Operative Identity
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Clearance Level
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  Enrollment Date
                </th>
                <th className="text-[10px] font-black uppercase tracking-widest opacity-40 text-right pr-10">
                  Protocol Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              <AnimatePresence mode="popLayout">
                {users.map((user) => {
                  const isUpdating =
                    mutation.variables?.id === user._id && mutation.isPending;
                  return (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={user._id}
                      className="hover:bg-primary/[0.02] transition-colors group"
                    >
                      <td className="pl-10">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-xs shadow-inner ${
                              user.role === "admin"
                                ? "bg-primary/20 text-primary"
                                : "bg-base-200 text-base-content/40"
                            }`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-sm uppercase italic tracking-tight">
                              {user.name}
                            </div>
                            <div className="text-[10px] font-bold opacity-30 mt-0.5 lowercase">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge badge-sm border-none font-black uppercase italic tracking-tighter py-3 px-4 rounded-lg ${
                            user.role === "admin"
                              ? "bg-primary text-primary-content"
                              : user.role === "rider"
                                ? "bg-secondary text-secondary-content"
                                : "bg-base-200 opacity-50"
                          }`}
                        >
                          {user.role || "user"}
                        </div>
                      </td>
                      <td>
                        <div className="text-[11px] font-bold opacity-40">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </div>
                      </td>
                      <td className="text-right pr-10">
                        {user.role !== "rider" ? (
                          <button
                            onClick={() =>
                              handleRoleChange(user._id, user?.role || "user")
                            }
                            disabled={isUpdating}
                            className={`btn btn-sm rounded-xl font-black italic uppercase tracking-tighter ${
                              user.role === "admin"
                                ? "btn-error btn-ghost hover:bg-error/10"
                                : "btn-primary btn-outline"
                            }`}
                          >
                            {isUpdating ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : user.role === "admin" ? (
                              <>
                                <FaUserTimes /> Revoke
                              </>
                            ) : (
                              <>
                                <FaUserShield /> Promote
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[9px] font-black uppercase opacity-20 tracking-widest italic border border-base-content/5 px-3 py-1 rounded">
                            Rider Restricted
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && !isFetching && (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6 opacity-20 animate-pulse">
              <FaFingerprint size={40} />
            </div>
            <h3 className="text-2xl font-black italic uppercase opacity-20 tracking-tighter">
              Database Locked
            </h3>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em] mt-2">
              Enter operative criteria to access profiles
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeAdmin;
