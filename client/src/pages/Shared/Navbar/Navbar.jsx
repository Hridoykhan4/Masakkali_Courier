import { Link, NavLink } from "react-router";
import { HiOutlineBars4 } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { FaMoon, FaSun, FaSignOutAlt, FaColumns } from "react-icons/fa";
import { useState, useMemo, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import MasakkaliLogo from "../MasakkaliLogo/MasakkaliLogo";
import useTheme from "../../../hooks/useTheme";
import useAuthValue from "../../../hooks/useAuthValue";
import useUserRole from "../../../hooks/useUserRole";

const Navbar = ({ fromAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logOut } = useAuthValue();
  const { role } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = useMemo(() => {
    const links = [
      { label: "Home", to: "/" },
      { label: "Coverage", to: "/coverage" },
    ];
    if (role === "user") {
      links.push(
        { label: "Be a Rider", to: "/beARider" },
        { label: "Send Parcel", to: "/sendParcel" },
      );
    }
    return links;
  }, [role]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!", {
        icon: "🚀",
        theme: theme === "light" ? "light" : "dark",
      });
      setIsOpen(false);
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };
  const confirmLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-center gap-2">
            {/* Using DaisyUI classes ensures theme compliance */}
            <div className="p-2 bg-error/20 rounded-full text-error">
              <FaSignOutAlt size={14} />
            </div>
            <p className="font-bold text-sm text-base-content">
              Exit Masakkali?
            </p>
          </div>
          <p className="text-xs text-base-content/70">
            Are you sure you want to sign out of your session?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="btn btn-ghost btn-xs text-base-content"
            >
              Stay
            </button>
            <button
              onClick={() => {
                handleLogout();
                closeToast();
              }}
              className="btn btn-error btn-xs text-white px-4"
            >
              Logout
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        theme: theme === "dark" ? "dark" : "light", // CRITICAL FIX
        className:
          "border border-base-content/10 shadow-2xl rounded-2xl backdrop-blur-md bg-base-100/90",
        icon: false,
      },
    );
  };

  // Close mobile menu on Esc key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navLinkStyle = ({ isActive }) =>
    `relative py-2 text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
      isActive ? "text-primary" : "text-base-content/70 hover:text-primary"
    }`;

  const roleBadgeColor = {
    admin: "bg-error/10 text-error border-error/20",
    rider: "bg-info/10 text-info border-info/20",
    user: "bg-primary/10 text-primary border-primary/20",
  }[role || "user"];

  return (
    <nav
      className={`sticky top-0 z-100  w-full transition-all duration-500 ${
        scrolled
          ? "bg-base-100/70 backdrop-blur-xl border-b border-base-content/5 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-page flex items-center justify-between">
        {/* --- Logo Area --- */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="shrink-0"
        >
          <MasakkaliLogo />
        </motion.div>

        {/* --- Desktop Navigation --- */}
        <div className="hidden lg:flex items-center gap-8">
          {!fromAuth && (
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={navLinkStyle}>
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="navUnderline"
                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          {/* --- Desktop Action Area --- */}
          <div className="flex items-center gap-4 border-l border-base-content/10 pl-6">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-sm hover:bg-primary/10 transition-colors"
            >
              {theme === "light" ? (
                <FaMoon size={18} />
              ) : (
                <FaSun size={18} className="text-yellow-400" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="group flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-base-200 transition-all"
                >
                  <div className="relative">
                    <img
                      src={
                        user?.photoURL || "https://i.ibb.co/mJR9Qxc/user.png"
                      }
                      referrerPolicy="no-referrer"
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                    />
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                    </span>
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-black uppercase leading-none mb-1">
                      Dashboard
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase ${roleBadgeColor}`}
                    >
                      {role}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={confirmLogout}
                  className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10 transition-colors"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* --- Mobile Controls --- */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
            {theme === "light" ? (
              <FaMoon />
            ) : (
              <FaSun className="text-yellow-400" />
            )}
          </button>
          {!fromAuth && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="btn btn-ghost btn-circle text-2xl z-110"
            >
              {isOpen ? <IoCloseOutline /> : <HiOutlineBars4 />}
            </button>
          )}
        </div>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-base-300/60 backdrop-blur-sm lg:hidden z-101"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-70 bg-base-100 shadow-2xl z-102 p-6 lg:hidden"
            >
              <div className="mt-12 space-y-6">
                {user && (
                  <div className="flex items-center gap-4 p-4 bg-base-200 rounded-2xl">
                    <img
                      src={user.photoURL}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-primary"
                      alt=""
                    />
                    <div>
                      <h4 className="font-bold truncate w-32">
                        {user.displayName}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-bold ${roleBadgeColor}`}
                      >
                        {role}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `p-4 rounded-xl font-bold flex items-center justify-between ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  {user && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="p-4 rounded-xl font-bold flex items-center gap-3 hover:bg-base-200"
                    >
                      <FaColumns /> Dashboard
                    </NavLink>
                  )}
                </div>

                <div className="absolute bottom-10 left-6 right-6">
                  {user ? (
                    <button
                      onClick={confirmLogout} // Trigger the confirmation toast
                      className="btn btn-error btn-block text-white rounded-xl shadow-lg shadow-error/20"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn btn-primary btn-block rounded-xl"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
