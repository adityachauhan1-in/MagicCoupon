import axios from "axios";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
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
  

  useEffect(() => {
    const stored = localStorage.getItem("myCoupons");
    if (stored) {
      setMyCoupons(JSON.parse(stored));
    }
  }, []);

            const addCoupon = (coupon) => {
    const updated = [...myCoupons, coupon];//...mycoupon is a spread operator that adds the new coupon to the myCoupons array
    setMyCoupons(updated);//setMyCoupons is a function that updates the myCoupons state with the new array
           localStorage.setItem("myCoupons", JSON.stringify(updated));
  };

  const removeCoupon = (code) => {
    const updated = myCoupons.filter((c) => c.code !== code);
          setMyCoupons(updated);
    localStorage.setItem("myCoupons", JSON.stringify(updated));
  };

  // Fetch all coupons once (or when API base changes)
  useEffect(() => {
    let isActive = true;
    const fetchAllCoupons = async () => {
      try {
        setLoading(true);
        const url = `${API_BASE_URL}/api/coupons`;
       
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success && isActive) {
          setCoupons(data.data);
          // Initialize filtered with current category if not All
          setFilteredCoupons(
            selectedCategory === "All"
              ? data.data
              : data.data.filter((c) => c.category === selectedCategory)
          );
        }
      } catch (err) {
        console.error(`💥 Fetch Error (all):`, err);
        if (isActive) setError(err.message || "Error loading coupons");
      } finally {
        if (isActive) setLoading(false);
      }
    };
    fetchAllCoupons();
    return () => { isActive = false; };
  }, [API_BASE_URL]);

  // Client-side filter by selectedCategory
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredCoupons(coupons);
    } else {
      const filtered = coupons.filter((c) => c.category === selectedCategory);
      setFilteredCoupons(filtered);
    }
  }, [selectedCategory, coupons]);
 
  // Search filter with debouncing
  const handleSearchChange = useCallback(async (value) => {
    setSearchInput(value);
    if (value.trim() === "") {
      setFilteredCoupons(coupons);
    } else {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/coupons/search`, {
          params: { q: value }
        });
        if (response.data.success) {
          setFilteredCoupons(response.data.data);
        }
      } catch (error) {
        // Error handled by user-friendly message display 
        toast.error(error.message || "Error searching coupons");
      }
    }
  }, [coupons, API_BASE_URL]);

  
  const clearSearch = useCallback(() => {
    setSearchInput("");
    setFilteredCoupons(coupons);
  }, [coupons]);

  useEffect(() => {
    // for checking perspective to check the categories button  
  }, [selectedCategory, coupons, filteredCoupons]);

  const contextValue = useMemo(() => ({
    myCoupons,
    addCoupon,
    removeCoupon,
    coupons,
    filteredCoupons,
    loading,
    error,
    searchInput,
    selectedCategory,
    setSelectedCategory,
    handleSearchChange,
    clearSearch,
  }), [
    myCoupons,
    addCoupon,
    removeCoupon,
    coupons,
    filteredCoupons,
    loading,
    error,
    searchInput,
    selectedCategory,
    setSelectedCategory,
    handleSearchChange,
    clearSearch,
  ]);

  return (
    <CouponContext.Provider value={contextValue}>
      {children}
    </CouponContext.Provider>
  );
};
