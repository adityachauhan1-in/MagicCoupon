import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react"; 
import { toast } from 'react-toastify';
const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  //  Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition"
      >
        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-lg p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.name || "Guest User"}</p>
              <p className="text-sm text-gray-500">{user?.email || "guest@email.com"}</p>
            </div>
          </div>
          <hr className="my-3" />
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 text-left rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
