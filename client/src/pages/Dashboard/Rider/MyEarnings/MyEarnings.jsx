import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const StatCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl shadow bg-base-100 border-l-4 ${color}`}>
    <p className="text-sm opacity-70">{title}</p>
    <h3 className="text-2xl font-bold">৳ {value}</h3>
  </div>
);

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myEarnings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/earnings-summary");
      return res.data;
    },
  });

  //console.log(data);

  if (isLoading) return <div className="text-center">Loading earnings...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">Failed to load earnings</div>
    );

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-semibold">My Earnings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Earnings"
          value={data.total}
          color="border-green-500"
        />
        <StatCard
          title="Cashed Out"
          value={data.cashedOut}
          color="border-blue-500"
        />
        <StatCard
          title="Pending Balance"
          value={data.pending}
          color="border-yellow-500"
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3">Earnings Analytics</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="This Week"
            value={data.weekly}
            color="border-purple-500"
          />
          <StatCard
            title="This Month"
            value={data.monthly}
            color="border-indigo-500"
          />
          <StatCard
            title="This Year"
            value={data.yearly}
            color="border-pink-500"
          />
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;
