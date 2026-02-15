import { Link, NavLink } from "react-router";
import { HiOutlineBars4 } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { FaMoon, FaSun } from "react-icons/fa";
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
  //console.log(user);
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

    if (user) links.push({ label: "Dashboard", to: "/dashboard" });

    return links;
  }, [role, user]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("See you soon!");
      setIsOpen(false);
    } catch {
      toast.error("Logout failed. Try again.");
    }
  };

  const confirmLogout = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="p-1">
          <p className="font-medium mb-3">Sign out from Masakkali?</p>
          <div className="flex justify-end gap-2">
            <button onClick={closeToast} className="btn btn-ghost btn-xs">
              Cancel
            </button>
            <button
              onClick={() => {
                handleLogout();
                closeToast();
              }}
              className="btn btn-error btn-xs text-white"
            >
              Logout
            </button>
          </div>
        </div>
      ),
      { autoClose: false, icon: false, position: "top-center" },
    );
  };

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -20 },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  };

  const navLinkStyle = ({ isActive }) =>
    `relative px-3 py-2 transition-all duration-300 ${
      isActive ? "text-primary font-semibold" : "text-base-content/80"
    } hover:text-primary`;

  const roleBadgeClass =
    role === "admin"
      ? "badge-error"
      : role === "rider"
        ? "badge-info"
        : "badge-primary";

  return (
    <nav className="sticky top-0 z-9999 bg-base-100/80 backdrop-blur-md border-b border-base-200">
      <div className="navbar justify-between  container-page ">
        <div className="">
          <MasakkaliLogo />
        </div>

        <div className="flex ms-auto items-center gap-2">
          {!fromAuth && (
            <ul className="hidden lg:flex menu menu-horizontal items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={navLinkStyle}>
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}

              <li className="ml-2">
                {user ? (
                  <button
                    onClick={confirmLogout}
                    className="btn btn-ghost btn-sm"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-sm px-6">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          )}

          {user && (
            <div className="hidden lg:flex items-center gap-2 ml-2">
              <img
                referrerPolicy="no-referrer"
                src={user?.photoURL}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className={`badge badge-sm ${roleBadgeClass}`}>{role}</span>
            </div>
          )}

          {/* -------- Theme Toggle -------- */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn btn-ghost btn-circle"
          >
            {theme === "light" ? (
              <FaMoon className="text-lg" />
            ) : (
              <FaSun className="text-lg text-yellow-400" />
            )}
          </button>

          {/* -------- Mobile Toggle -------- */}
          {!fromAuth && (
            <div className="lg:hidden relative">
              <button
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-ghost btn-circle text-2xl"
              >
                {isOpen ? <IoCloseOutline /> : <HiOutlineBars4 />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.ul
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                    className="absolute right-0 mt-2 w-64 p-4 bg-base-100 rounded-2xl shadow-xl border border-base-200"
                  >
                    {/* User Info */}
                    {user && (
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 mb-3"
                      >
                        <img
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover"
                          src={user.photoURL || "/avatar.png"}
                          alt=""
                        />
                        <div>
                          <p className="font-medium">
                            {user.displayName || "User"}
                          </p>
                          <span className={`badge badge-sm ${roleBadgeClass}`}>
                            {role}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    <div className="divider my-2" />

                    {navLinks.map((link) => (
                      <motion.li key={link.to} variants={itemVariants}>
                        <NavLink
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block p-3 rounded-xl transition ${
                              isActive
                                ? "text-primary font-semibold"
                                : "text-base-content/80 hover:bg-base-200"
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      </motion.li>
                    ))}

                    <div className="divider my-2" />

                    <motion.li variants={itemVariants}>
                      {user ? (
                        <button
                          onClick={confirmLogout}
                          className="btn btn-error btn-block btn-sm text-white"
                        >
                          Logout
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => setIsOpen(false)}
                          className="btn btn-primary btn-block btn-sm"
                        >
                          Login
                        </Link>
                      )}
                    </motion.li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* -------- Mobile Backdrop -------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
