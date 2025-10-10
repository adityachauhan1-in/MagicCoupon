import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const CouponContext = createContext();

export const useCoupons = () => useContext(CouponContext);

export const CouponProvider = ({ children }) => { // all coupons route 
  const [myCoupons, setMyCoupons] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "https://magiccoupon-backend.onrender.com").replace(/^["']|["']$/g, '');
  
  // Debug: Log the API_BASE_URL to see what's being used
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('process.env.REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);

  useEffect(() => {
    const stored = localStorage.getItem("myCoupons");
    if (stored) {
      setMyCoupons(JSON.parse(stored));
    }
  }, []);

            const addCoupon = (coupon) => {
    const updated = [...myCoupons, coupon];
    setMyCoupons(updated);
           localStorage.setItem("myCoupons", JSON.stringify(updated));
  };

  const removeCoupon = (code) => {
    const updated = myCoupons.filter((c) => c.code !== code);
          setMyCoupons(updated);
    localStorage.setItem("myCoupons", JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        let url =
                      selectedCategory === "All"
            ? `${API_BASE_URL}/api/coupons`
            : `${API_BASE_URL}/api/coupons/category/${selectedCategory}`;
        const response = await fetch(url);
                  const data = await response.json();

                    if (data.success) {
                      setCoupons(data.data);
                      setFilteredCoupons(data.data);
        } else {
          setError(data.message || "Failed to fetch coupons");
        }
      } catch (err) {
        setError(err.message || "Error loading coupons");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [API_BASE_URL, selectedCategory]);
 
  // Search filter
  const handleSearchChange = async(value) => {
    setSearchInput(value);
    if (value.trim() === "") {
      setFilteredCoupons(coupons);
    } else {
      try {
        
        const response = await axios.get(`${API_BASE_URL}/api/coupons/search`, {
          params: { q: value }
        });
         if(response.data.success){
          setFilteredCoupons(response.data.data)
         }
        
      } catch (error) {
       console.log("error searching coupons : " , error) 
      }
    }
  };

  
  const clearSearch = () => {
    setSearchInput("");
    setFilteredCoupons(coupons);
  };

  return (
    <CouponContext.Provider 
    value={{ myCoupons, addCoupon, removeCoupon,
      coupons,
        filteredCoupons,
        loading,
        error,
        searchInput,
        selectedCategory,
        setSelectedCategory,
        handleSearchChange,
        clearSearch,
     }}>
      {children}
    </CouponContext.Provider>
  );
};
