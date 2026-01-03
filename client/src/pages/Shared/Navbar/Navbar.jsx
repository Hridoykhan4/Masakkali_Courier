import { Link, NavLink } from "react-router";
import { HiOutlineBars4 } from "react-icons/hi2";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import MasakkaliLogo from "../MasakkaliLogo/MasakkaliLogo";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import useTheme from "../../../hooks/useTheme";
import { FaMoon, FaSun } from "react-icons/fa";
import useAuthValue from "../../../hooks/useAuthValue";
import { toast } from "react-toastify";
const Navbar = ({ fromAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useAuthValue();
  console.log(user);
  const autoCloseLinks = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logOut();
    toast.success("Logged out successfully!", {
      autoClose: 1500,
    });
    setIsOpen(false);
  };

  const loginOptions = (
    <>
      <li>
        {user ? (
          <button
            onClick={async () => {
              toast.info(
                ({ closeToast }) => (
                  <div className="flex flex-col gap-3">
                    <p className="font-medium text-gray-800">
                      Are you sure you want to log out?
                    </p>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={closeToast}
                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeToast();
                        }}
                        className="px-3 py-1 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md shadow-sm transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ),
                {
                  position: "top-center",
                  autoClose: false, // Keep open until user decides
                  closeOnClick: false,
                  draggable: false,
                  icon: false, // We'll use our custom styling
                }
              );
            }}
          >
            Log out
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </li>
    </>
  );

  const navOptions = fromAuth || (
    <>
      <li onClick={autoCloseLinks}>
        <NavLink to="/">Home</NavLink>
      </li>
      <li onClick={autoCloseLinks}>
        <NavLink to="/sendParcel">Send Parcel</NavLink>
      </li>
      <li onClick={autoCloseLinks}>
        <NavLink to="/coverage">Coverage</NavLink>
      </li>
      {user && (
        <>
          <li onClick={autoCloseLinks}>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        </>
      )}
      {loginOptions}
    </>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="navbar sticky top-0 z-1000 px-3 bg-base-100 shadow-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="navbar-start"
        >
          <MasakkaliLogo></MasakkaliLogo>
        </motion.div>
        <div className="navbar-end space-x-2">
          <button
            className="btn btn-ghost btn-circle"
            aria-label="ToggleTheme"
            onClick={toggleTheme}
          >
            {theme === "light" ? <FaMoon></FaMoon> : <FaSun></FaSun>}
          </button>

          <ul className="menu menu-horizontal px-1 hidden lg:flex">
            {navOptions}
          </ul>
          <div className="dropdown block lg:hidden dropdown-end">
            {fromAuth || (
              <button
                onClick={(e) => {
                  setIsOpen((prev) => !prev);
                  e.stopPropagation();
                }}
                className=" cursor-pointer btn text-2xl"
              >
                {isOpen ? <IoCloseOutline /> : <HiOutlineBars4 />}
              </button>
            )}
            {isOpen && (
              <ul className="menu menu-sm z-50 dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
                {navOptions}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed lg:hidden bg-black/70 z-40 inset-0"
        ></div>
      )}
    </>
  );
};

export default Navbar;
