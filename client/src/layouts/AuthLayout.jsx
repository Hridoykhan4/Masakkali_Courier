import { Outlet, useLocation } from "react-router";
import Navbar from "../pages/Shared/Navbar/Navbar";
import authImg from "../assets/authImage.png";
import authImg2 from "../assets/agent-pending.png";
import { motion as Motion } from "motion/react";
const AuthLayout = () => {
  const { pathname } = useLocation();
  const getAnimation = () => {
    if (pathname.includes("login")) {
      return { x: -100, opacity: 0 };
    }
    if (pathname.includes("register")) {
      return { x: 100, opacity: 0 };
    }
    return { y: 20, opacity: 0 };
  };

  return (
    <div className="overflow-x-hidden">
      <Motion.div
        key={pathname}
        initial={getAnimation()}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
      >
        <Navbar fromAuth={true}></Navbar>
        <div className="bg-base-200 w-11/12 mx-auto  py-10">
          <div
            className={`flex justify-center items-center gap-3 ${
              pathname.includes("login") ? "flex-col" : "flex-col-reverse"
            }  ${
              pathname.includes("login") ? "lg:flex-row-reverse" : "lg:flex-row"
            }`}
          >
            <div className="sm:flex-1 ">
              <img
                alt="Authentication illustration"
                src={pathname.includes("login") ? authImg : authImg2}
                className="rounded-lg w-full transition-opacity duration-500"
              />
            </div>
            <div className="sm:flex-1 w-full">
              <Outlet></Outlet>
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default AuthLayout;
