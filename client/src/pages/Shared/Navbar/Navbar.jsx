import { Link, NavLink } from "react-router";
import { HiOutlineBars4 } from "react-icons/hi2";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import MasakkaliLogo from "../MasakkaliLogo/MasakkaliLogo";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const autoCloseLinks = () => {
    setIsOpen(false);
  };

  const navOptions = (
    <>
      <li onClick={autoCloseLinks}>
        <NavLink to="/">Home</NavLink>
      </li>
    </>
  );

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Link to="/">
            <MasakkaliLogo></MasakkaliLogo>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navOptions}</ul>
        </div>
        <div className="navbar-end space-x-2">
          <div className="dropdown dropdown-end">
            <button
              onClick={(e) => {
                setIsOpen((prev) => !prev);
                e.stopPropagation();
              }}
              className="lg:hidden cursor-pointer btn text-2xl"
            >
              {isOpen ? <IoCloseOutline /> : <HiOutlineBars4 />}
            </button>
            <ul className="menu menu-sm z-50 dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
              {isOpen && navOptions}
            </ul>
          </div>
        </div>
      </div>
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
