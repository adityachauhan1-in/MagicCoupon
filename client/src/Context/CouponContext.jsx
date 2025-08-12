import { createContext, useContext, useState, useEffect } from "react";

const CouponContext = createContext();

export const useCoupons = () => useContext(CouponContext);

export const CouponProvider = ({ children }) => {
  const [myCoupons, setMyCoupons] = useState([]);

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

  return (
    <CouponContext.Provider value={{ myCoupons, addCoupon, removeCoupon }}>
      {children}
    </CouponContext.Provider>
  );
};
