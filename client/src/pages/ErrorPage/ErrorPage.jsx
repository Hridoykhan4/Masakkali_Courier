import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router";

// Lazy load the player so it doesn't slow down the main bundle
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
        {/* Suspense handles the Lottie library loading state */}
        <Suspense
          fallback={
            <div className="h-72 flex items-center justify-center">
              Loading Animation...
            </div>
          }
        >
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop={true}
              className="h-72 w-full mx-auto"
            />
          ) : (
            <div className="h-72" /> // Spacer while JSON is fetching
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
