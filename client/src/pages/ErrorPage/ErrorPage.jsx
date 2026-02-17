import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router";
// 1. Stable light player import
import lottieLight from "lottie-web/build/player/lottie_light";

const Lottie = lazy(() => import("lottie-react"));

const ErrorPage = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/animations/error.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie load error:", err));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-6 text-center">
      <div className="max-w-md w-full">
        <Suspense
          fallback={
            <div className="h-72 flex items-center justify-center">
              Loading...
            </div>
          }
        >
          {animationData ? (
            <Lottie
              animationData={animationData}
              // 2. Pass the light engine here to stop the 'Activity' error
              lottieObj={lottieLight}
              loop={true}
              className="h-72 w-full mx-auto"
            />
          ) : (
            <div className="h-72" />
          )}
        </Suspense>

        <div className="mt-8 space-y-4">
          <h1 className="text-5xl font-black text-primary">404</h1>
          <h2 className="text-2xl font-bold text-base-content">
            Lost in Transit?
          </h2>
          <p className="text-base-content/60 max-w-xs mx-auto">
            The page you're looking for was either delivered to the wrong
            address or never existed.
          </p>

          <div className="pt-6">
            <Link to="/" className="btn btn-primary btn-wide shadow-lg">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
