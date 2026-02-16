import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Navbar from "../pages/Shared/Navbar/Navbar";

const AuthLayout = () => {
  const { pathname } = useLocation();
  const isLogin = pathname.includes("login");

  return (
    <div className="min-h-screen bg-base-200 flex flex-col overflow-x-hidden">
      <Navbar fromAuth={true} />

      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-6xl bg-base-100 rounded-[3rem] shadow-2xl overflow-hidden border border-base-content/5 flex flex-col lg:flex-row">
          {/* Animation Side */}
          <motion.div
            key={isLogin ? "login-anim" : "reg-anim"}
            initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-1/2 p-12 flex flex-col justify-center items-center bg-primary/5 ${isLogin ? "lg:order-last" : "lg:order-first"}`}
          >
            <Lottie
              path={
                isLogin ? "/animations/login.json" : "/animations/register.json"
              }
              className="w-full max-w-[400px] drop-shadow-2xl"
              loop={true}
            />
            <div className="text-center mt-8 space-y-2">
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                {isLogin ? "Welcome Back" : "Join the Fleet"}
              </h1>
              <p className="text-sm opacity-60 max-w-xs mx-auto">
                {isLogin
                  ? "Access your dashboard and manage your parcels with Masakkali."
                  : "Start your journey with Bangladesh's smartest logistics network."}
              </p>
            </div>
          </motion.div>

          {/* Form Side */}
          <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-base-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
