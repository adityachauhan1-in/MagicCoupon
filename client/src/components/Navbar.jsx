import React from "react";
import { NavLink, Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Ticket, PlusCircle } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/80 shadow-md px-6 py-3 flex justify-between items-center transition-all duration-300">
      

      <Link
        to="/"
        className="text-2xl font-extrabold bg-clip-text text-transparent 
                   bg-gradient-to-r from-purple-600 to-indigo-600 
                   hover:scale-105 transform transition"
      >
        MagicCoupon
      </Link>

     
      <ul className="flex space-x-6 items-center">
       
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative px-2 py-1 text-lg font-medium transition-all duration-200 
               ${
                 isActive
                   ? "text-purple-600 before:absolute before:-bottom-1 before:left-0 before:w-full before:h-1 before:rounded-full before:bg-purple-500"
                   : "text-gray-600 hover:text-blue-600 hover:scale-105 transform"
               }`
            }
          >
            Explore
          </NavLink>
        </li>

        {/* Saved Coupons */}
        <li>
          <NavLink
            to="/coupons"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 text-lg font-medium rounded-lg 
               transition-all duration-200
               ${
                 isActive
                   ? "text-purple-600 bg-purple-50"
                   : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
               }`
            }
          >
            <Ticket size={18} /> Saved Coupons
          </NavLink>
        </li>

        {/* My Created */}
        <li>
          <NavLink
            to="/my-created"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-1 text-lg font-medium rounded-lg 
               transition-all duration-200
               ${
                 isActive
                   ? "text-purple-600 bg-purple-50"
                   : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
               }`
            }
          >
            <PlusCircle size={18} /> Creations
          </NavLink>
        </li>

        {/* User Menu */}
        <li>
          <UserMenu />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
