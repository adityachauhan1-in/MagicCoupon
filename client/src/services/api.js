const API_BASE_URL = 'http://localhost:5000/api';

// Get all coupons
export const getAllCoupons = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons?limit=100`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};
// Search coupons
export const searchCoupons = async (searchTerm) => {
  try {
      const response = await fetch(`${API_BASE_URL}/coupons/search?q=${searchTerm}`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error searching coupons:', error);
      throw error;
  }
};
// Get single coupon by ID
export const getCouponById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw error;
  }
};

// Create new coupon
export const createCoupon = async (couponData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(couponData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

// Update coupon
export const updateCoupon = async (id, couponData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(couponData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw error;
  }
};

// Delete coupon
export const deleteCoupon = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw error;
  }
}; 
export const getCouponsByCategory = async(category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/category/${category}}`)
    const data = await response.json()
    return data;
  } catch (error) {
    console.log("Error in Fetching coupons by category " , error)
    throw error;
  }
}