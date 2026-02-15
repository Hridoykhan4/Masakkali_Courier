import { useEffect, useState, lazy, Suspense } from "react";
import loadingAnimation from "../../public/animations/loading.json";
const Lottie = lazy(() => import("lottie-react"));

const ErrorLoadingState = ({ isPending, isError, error }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    if (isPending && !animationData) {
      fetch("/animations/loading.json")
        .then((res) => res.json())
        .then((data) => setAnimationData(data))
        .catch((err) => console.error("Lottie error:", err));
    }
  }, [isPending, animationData]);

  if (isPending) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full bg-base-100">
        <Suspense
          fallback={
            <span className="loading loading-dots loading-lg text-primary"></span>
          }
        >
          <div className="w-64 h-64">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        </Suspense>
        <h2 className="text-xl font-bold text-primary animate-pulse tracking-widest uppercase">
          Masakkali
        </h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-50 p-6 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-bold text-center">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-sm btn-error btn-outline mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default ErrorLoadingState;
