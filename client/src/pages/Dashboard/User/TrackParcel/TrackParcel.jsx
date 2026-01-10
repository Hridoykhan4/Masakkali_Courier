import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const STATUS_META = {
  CREATED: "text-gray-500",
  COLLECTED: "text-blue-500",
  IN_TRANSIT: "text-indigo-500",
  OUT_FOR_DELIVERY: "text-orange-500",
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
    setParams({ tid: trackingId });
  };

  console.log(data);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID"
          className="input input-bordered w-full"
        />
        <button className="btn btn-primary">Track</button>
      </form>

      <button
        type="button"
        className="btn"
        onClick={() => {
          setTrackingId("");
          setParams({});
        }}
      >
        Clear
      </button>

      {!trackingId && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg font-medium">Track Your Parcel</p>
          <p className="text-sm">
            Enter your tracking ID above to see delivery updates.
          </p>
        </div>
      )}

      {/* 2️⃣ Loading */}
      {trackingId && isPending && (
        <p className="text-center">Loading tracking info...</p>
      )}

      {/* 3️⃣ Error */}
      {trackingId && isError && (
        <p className="text-center text-red-500">Invalid tracking ID</p>
      )}

      {data && (
        <>
          {/* Parcel Summary */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Parcel Summary</h2>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <p>
                  <strong>Tracking ID:</strong> {data.parcel.trackingId}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      STATUS_META[data.parcel.delivery_status?.toUpperCase()]
                    }`}
                  >
                    {data.parcel.delivery_status.replace("-", " ")}
                  </span>
                </p>
                <p>
                  <strong>Route:</strong> {data.parcel.senderRegion} →{" "}
                  {data.parcel.receiverRegion}
                </p>
                <p>
                  <strong>Type:</strong> {data.parcel.parcelType}
                </p>
                <p>
                  <strong>Weight:</strong> {data.parcel.weight} kg
                </p>
                <p>
                  <strong>Payment:</strong> {data.parcel.payment_status}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(data.parcel.creation_date).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title">Tracking History</h2>

              {data.trackingHistory.length === 0 && (
                <p className="text-gray-500">No tracking updates yet.</p>
              )}

              <ul className="space-y-4">
                {data.trackingHistory.map((track, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span
                      className={`mt-1 w-3 h-3 rounded-full ${
                        STATUS_META[track.status]
                      } bg-current`}
                    ></span>

                    <div>
                      <p className="font-medium">
                        {track.status.replace("_", " ")}
                      </p>
                      <p className="text-sm text-gray-500">{track.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(track.createdAt).toLocaleString()}
                        {track.location && ` • ${track.location}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrackParcel;
