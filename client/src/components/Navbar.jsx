import React from "react";
import { NavLink, Link } from "react-router-dom";
import UserMenu from "./UserMenu";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-green-600 hover:text-green-700">
        MagicCoupon
      </Link>

      {/* Menu */}
      <ul className="flex space-x-6 items-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors text-lg ${
                isActive ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"
              }`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/coupons"
            className={({ isActive }) =>
              `transition-colors text-lg ${
                isActive ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"
              }`
            }
          >
            My Coupons
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/FeedbackSupport"
            className={({ isActive }) =>
              `transition-colors text-lg ${
                isActive ? "text-green-600 font-semibold" : "text-gray-600 hover:text-green-600"
              }`
            }
          >
            Feedback
          </NavLink>
        </li>

        {/* User Menu */}
        <UserMenu />
      </ul>
    </nav>
  );
};

export default Navbar;
