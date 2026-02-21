import { Outlet, useLocation } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Navbar from "../pages/Shared/Navbar/Navbar";

// Direct imports for ZERO-delay rendering
import loginAnim from "/public/animations/login.json";
import registerAnim from "/public/animations/register.json";

const AuthLayout = () => {
  const { pathname } = useLocation();
  const isLogin = pathname.includes("login");

  return (
    <div className="min-h-screen bg-base-200 flex flex-col selection:bg-primary selection:text-white">
      <div className="sticky top-0 z-100">
        <Navbar fromAuth={true} />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-6xl bg-base-100 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-base-content/5 flex flex-col lg:flex-row">
          <motion.div
            key={isLogin ? "login-side" : "reg-side"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`lg:w-1/2 p-12 flex flex-col justify-center items-center bg-primary/3 transition-colors duration-500 ${
              isLogin ? "lg:order-last" : "lg:order-first"
            }`}
          >
            <div className="w-full max-w-105 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full" />

              <Lottie
                animationData={isLogin ? loginAnim : registerAnim} 
                className="relative z-10 w-full drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)]"
                loop={true}
              />
            </div>

            <div className="text-center mt-12 space-y-3 relative z-10">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                {isLogin ? "Welcome Back" : "Join the Fleet"}
              </h1>
              <p className="text-sm font-medium opacity-50 max-w-70 mx-auto leading-relaxed">
                {isLogin
                  ? "Your parcels are waiting. Log in to keep the gears turning."
                  : "Bangladesh's fastest delivery network is one click away."}
              </p>
            </div>
          </motion.div>

          {/* Form Side */}
          <div className="lg:w-1/2 p-8 md:p-20 flex flex-col justify-center bg-base-100 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: isLogin ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? -20 : 20 }}
                transition={{ duration: 0.3, ease: "circOut" }}
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
