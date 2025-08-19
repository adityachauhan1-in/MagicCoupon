import React , {useState, useEffect}  from 'react';
import { NavLink, Link,  } from 'react-router-dom';
import axios from 'axios'
import UserMenu from './UserMenu';

const Navbar = () => {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/user/wallet", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setBalance(res.data.walletBalance);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, []);
  

  return (
    <> 
       <div>
        
       </div>
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-600 hover:text-green-700">
        MagicCoupon
      </Link>
      <div className="bg-white text-green-600 px-4 py-2 rounded-lg shadow">
        💰 Balance: ₹{balance}
      </div>
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
   
        <UserMenu/>
      </ul>
    </nav>
    </>
  );
};

export default Navbar;