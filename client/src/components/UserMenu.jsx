import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, LogOut,  MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
        const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
           localStorage.removeItem("user");
    toast.success("Logged out successfully ", { autoClose: 1000 });
       navigate("/auth");
  };


  useEffect(() => {
               const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

              document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
               document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
     
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                   flex items-center justify-center text-white font-bold 
                   shadow-md hover:scale-105 transition duration-200"
      >
        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
      </button>

  {/* drop down menu  */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl 
                     p-4 animate-fadeIn z-50 border border-gray-100"
        >
          {/* User Info  */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-200 to-blue-200 
                            flex items-center justify-center text-lg font-bold text-gray-700 shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
               {/* if user is logged in, show the first letter of the user's name */} 
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-800 truncate">
                {user?.name || "Guest User"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user?.email || "guest@email.com"}
              </p>
            </div>
          </div>

          <hr className="my-3 border-gray-200" />

          {/* Menu Links */}
          <div className="flex flex-col space-y-2">
          
            <Link // feedback link but it is not linked to the database this is for just showcasing 
              to="/FeedbackSupport"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-purple-700 transition"
            >
              <MessageCircle size={18} /> Feedback
            </Link>

          
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition duration-200"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
