import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const STATUS_META = {
  CREATED: "text-gray-400",
  PAID: "text-blue-500",
  ASSIGNED: "text-purple-500",
  COLLECTED: "text-indigo-500",
  IN_TRANSIT: "text-orange-500",
  DELIVERED: "text-green-600",
};

const TrackParcel = () => {
  const axiosSecure = useAxiosSecure();
  const [params, setParams] = useSearchParams();
  const initialTid = params.get("tid") || "";
  const [trackingId, setTrackingId] = useState(initialTid);

  const { data, isPending, isError } = useQuery({
    queryKey: ["track-parcel", trackingId],
    enabled: !!trackingId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/track/${trackingId}`);
      return res.data;
    },
    refetchInterval: (query) => {
      return query?.state?.data?.parcel?.delivery_status === "DELIVERED"
        ? false
        : 30000;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setParams({ tid: trackingId });
  };


  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Search Section */}
      <section className="bg-base-200 p-6 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Track Your Journey
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Tracking ID (e.g. TRK-123)"
            className="input input-bordered w-full focus:input-primary"
          />
          <button className="btn btn-primary px-8">Track</button>
        </form>
        <div className="flex justify-center mt-2">
          <button
            className="btn btn-ghost btn-xs text-error"
            onClick={() => {
              setTrackingId("");
              setParams({});
            }}
          >
            Clear Search
          </button>
        </div>
      </section>

      {trackingId && isPending && (
        <div className="loading loading-dots loading-lg block mx-auto"></div>
      )}

      {trackingId && isError && (
        <div className="alert alert-error shadow-lg">
          <span>Error: Tracking ID not found or server error.</span>
        </div>
      )}

      {data && (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {/* Summary Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card bg-base-100 border border-base-300 shadow-xl">
              <div className="card-body p-5">
                <h2 className="card-title text-sm uppercase text-gray-400">
                  Parcel Summary
                </h2>
                <div className="space-y-3 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Current Status</p>
                    <span
                      className={`badge badge-ghost font-bold ${STATUS_META[data.parcel.delivery_status?.toUpperCase()]}`}
                    >
                      {data.parcel.delivery_status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated Delivery</p>
                    <p className="font-medium">{data.parcel.receiverRegion}</p>
                  </div>
                  <div className="divider my-1"></div>
                  <p className="text-xs">
                    <strong>Weight:</strong> {data.parcel.weight}kg
                  </p>
                  <p className="text-xs">
                    <strong>Payment:</strong>{" "}
                    <span className="capitalize">
                      {data.parcel.payment_status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 border border-base-300 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6">Tracking Updates</h2>

                <ul className="timeline timeline-vertical timeline-compact">
                  {data.trackingHistory.map((track, idx) => (
                    <li key={idx}>
                      {idx !== 0 && <hr className="bg-primary" />}
                      <div className="timeline-middle">
                        <div
                          className={`rounded-full p-1 bg-primary text-white`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="timeline-end mb-10 ml-4">
                        <time className="font-mono italic text-xs text-primary block mb-1">
                          {formatDate(track.createdAt)}
                        </time>
                        <div className="text-lg font-black uppercase tracking-tight">
                          {track.status}
                        </div>
                        <p className="text-gray-500 text-sm">{track.message}</p>
                        {track.location && (
                          <div className="badge badge-outline mt-2 text-xs opacity-70">
                            📍 {track.location}
                          </div>
                        )}
                      </div>
                      {idx !== data.trackingHistory.length - 1 && <hr />}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
