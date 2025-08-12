import React  from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();

  // const location = useLocation();
  const navigate = useNavigate();
// const [searchTerm,setSearchTerm]=useState('');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/auth');
  };

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   const urlSearchTerm = searchParams.get('search') || '';
  //   setSearchTerm(urlSearchTerm);
  // }, [location.search]);

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   if (!searchTerm.trim()) return;
    
  //   // Determine which page we're on
  //   const searchPath = location.pathname === '/coupons' 
  //     ? '/coupons' 
  //     : '/';
    
  //   navigate(`${searchPath}?search=${encodeURIComponent(searchTerm.trim())}`);
  // };

  return (
    <> 
       <div>
        
       </div>
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-600 hover:text-green-700">
        MagicCoupon
      </Link>
     
      <ul className="flex space-x-4">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `hover:text-green-600 transition-colors ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600'}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/coupons" 
            className={({ isActive }) => 
              `hover:text-green-600 transition-colors ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600'}`
            }
          >
           My Coupons
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/FeedbackSupport" 
            className={({ isActive }) => 
              `hover:text-green-600 transition-colors ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600'}`
            }
          >
            Feedback
          </NavLink>
        </li>
        
        {/* Conditional rendering based on auth state */}
        {user ? (
          <li>
            <button 
              onClick={handleLogout}
              className="hover:text-green-600 transition-colors text-gray-600"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <NavLink 
              to="/auth" 
              className={({ isActive }) => 
                `hover:text-green-600 transition-colors ${isActive ? 'text-green-600 font-semibold' : 'text-gray-600'}`
              }
            >
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
    </>
  );
};

export default Navbar;