import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from './models/couponModels.js';

dotenv.config();

const sampleCoupons = [
  {
    title: "50% Off Pizza",
    store: "Pizza Hut",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
 
    price:20,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    category: "Food",
    minimumPurchase: 20,
    discountAmount: 10,
    discountPercentage: 50,
    description: "Enjoy half price on all pizzas. Limited time offer!",
    code: "PIZZA50"
  },
  {
    title: "20% Off Electronics",
    store: "Best Buy",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),

    price:20,
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
    category: "Electronics",
    minimumPurchase: 100,
    discountAmount: 20,
    discountPercentage: 20,
    description: "Get 20% off your favorite gadgets and electronics.",
    code: "TECH20"
  },
  {
    title: "Buy 1 Get 1 Free Coffee",
    store: "Starbucks",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
  
    price:20,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    category: "Food",
    minimumPurchase: 5,
    discountAmount: 5,
    discountPercentage: 50,
    description: "Perfect start to your day with our BOGO coffee deal.",
    code: "COFFEEBOGO"
  },
  {
    title: "30% Off Fashion",
    store: "Zara",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    category: "Fashion",
    minimumPurchase: 50,
    discountAmount: 15,
    discountPercentage: 30,
    description: "Update your wardrobe with 30% off all fashion items.",
    code: "STYLE30"
  },
  {
    title: "15% Off Groceries",
    store: "Walmart",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    category: "Other",
    minimumPurchase: 30,
    discountAmount: 5,
    discountPercentage: 15,
    description: "Save on your daily essentials and groceries.",
    code: "SAVE15"
  },
  {
    title: "Free Dessert with Dinner",
    store: "Olive Garden",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),

    price:20,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
    category: "Food",
    minimumPurchase: 25,
    discountAmount: 8,
    discountPercentage: 25,
    description: "Get a free dessert with any dinner order.",
    code: "SWEETFREE"
  },
  {
    title: "25% Off Travel Packages",
    store: "Expedia",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
    category: "Travel",
    minimumPurchase: 200,
    discountAmount: 50,
    discountPercentage: 25,
    description: "Save big on your next vacation with 25% off travel packages.",
    code: "TRAVEL25"
  },
  {
    title: "30% Off Health Supplements",
    store: "GNC",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "Health",
    minimumPurchase: 40,
    discountAmount: 12,
    discountPercentage: 30,
    description: "Boost your health with 30% off all supplements.",
    code: "HEALTH30"
  },
  {
    title: "40% Off Online Courses",
    store: "Udemy",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    category: "Education",
    minimumPurchase: 20,
    discountAmount: 8,
    discountPercentage: 40,
    description: "Learn new skills with 40% off all online courses.",
    code: "LEARN40"
  },
  {
    title: "50% Off Movie Tickets",
    store: "AMC Theaters",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
    category: "Entertainment",
    minimumPurchase: 15,
    discountAmount: 7.5,
    discountPercentage: 50,
    description: "Enjoy movies at half price with this amazing deal.",
    code: "MOVIE50"
  },
  {
    title: "25% Off Gaming Consoles",
    store: "GameStop",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    category: "Electronics",
    minimumPurchase: 300,
    discountAmount: 75,
    discountPercentage: 25,
    description: "Level up your gaming experience with 25% off consoles.",
    code: "GAME25"
  },
  {
    title: "Buy 2 Get 1 Free Books",
    store: "Barnes & Noble",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    category: "Education",
    minimumPurchase: 30,
    discountAmount: 15,
    discountPercentage: 33,
    description: "Expand your library with our BOGO book deal.",
    code: "BOOKS123"
  },
  {
    title: "30% Off Fitness Equipment",
    store: "Dick's Sporting Goods",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    category: "Health",
    minimumPurchase: 100,
    discountAmount: 30,
    discountPercentage: 30,
    description: "Build your home gym with 30% off fitness equipment.",
    code: "FITNESS30"
  },
  {
    title: "20% Off Home Decor",
    store: "IKEA",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    category: "Other",
    minimumPurchase: 50,
    discountAmount: 10,
    discountPercentage: 20,
    description: "Transform your space with 20% off home decor.",
    code: "HOME20"
  },
  {
    title: "Free Shipping on All Orders",
    store: "Amazon",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
    category: "Other",
    minimumPurchase: 25,
    discountAmount: 5,
    discountPercentage: 20,
    description: "Get free shipping on all orders over $25.",
    code: "FREESHIP"
  },
  {
    title: "40% Off Sunglasses",
    store: "Ray-Ban",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    category: "Fashion",
    minimumPurchase: 80,
    discountAmount: 32,
    discountPercentage: 40,
    description: "Look stylish with 40% off premium sunglasses.",
    code: "SUNGLASSES40"
  },
  {
    title: "25% Off Car Rental",
    store: "Hertz",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
    category: "Travel",
    minimumPurchase: 100,
    discountAmount: 25,
    discountPercentage: 25,
    description: "Explore with 25% off car rentals.",
    code: "CAR25"
  },
  {
    title: "Buy 1 Get 1 Free Ice Cream",
    store: "Baskin Robbins",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    category: "Food",
    minimumPurchase: 5,
    discountAmount: 5,
    discountPercentage: 50,
    description: "Cool down with our BOGO ice cream deal.",
    code: "ICECREAMBOGO"
  },
  {
    title: "30% Off Pet Supplies",
    store: "PetSmart",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400",
    category: "Other",
    minimumPurchase: 40,
    discountAmount: 12,
    discountPercentage: 30,
    description: "Spoil your pets with 30% off supplies.",
    code: "PET30"
  },
  {
    title: "50% Off Spa Services",
    store: "Massage Envy",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://imgs.search.brave.com/O4kYTZRGXrRWgMkqYRVKG-xcmBBT7Gk6mwzveycw_Ac/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zcGFo/YWJpdGF0LmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxOC8w/Mi9TcGFTZXJ2aWNl/czYwMHg0MDAtMS5q/cGc",
    category: "Health",
    minimumPurchase: 60,
    discountAmount: 30,
    discountPercentage: 50,
    description: "Relax and rejuvenate with 50% off spa services.",
    code: "SPA50"
  },
  {
    title: "20% Off Musical Instruments",
    store: "Guitar Center",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
    category: "Entertainment",
    minimumPurchase: 100,
    discountAmount: 20,
    discountPercentage: 20,
    description: "Make music with 20% off instruments.",
    code: "MUSIC20"
  },
  {
    title: "35% Off Baby Products",
    store: "Buy Buy Baby",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400",
    category: "Other",
    minimumPurchase: 50,
    discountAmount: 17.5,
    discountPercentage: 35,
    description: "Save on essentials for your little ones.",
    code: "BABY35"
  },
  {
    title: "40% Off Office Supplies",
    store: "Staples",
    startDate: "2025-01-01",
     endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400",
    category: "Other",
    minimumPurchase: 30,
    discountAmount: 12,
    discountPercentage: 40,
    description: "Stock up on office supplies with 40% off.",
    code: "OFFICE40"
  },
  {
    title: "25% Off Hotel Bookings",
    store: "Marriott",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    category: "Travel",
    minimumPurchase: 200,
    discountAmount: 50,
    discountPercentage: 25,
    description: "Stay in luxury with 25% off hotel bookings.",
    code: "HOTEL25"
  },
  {
    title: "Buy 1 Get 1 Free Pizza",
    store: "Domino's",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
 
    price:20,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    category: "Food",
    minimumPurchase: 15,
    discountAmount: 15,
    discountPercentage: 50,
    description: "Double the pizza, double the fun!",
    code: "PIZZABOGO"
  },
  {
    title: "30% Off Smartphones",
    store: "Verizon",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    category: "Electronics",
    minimumPurchase: 400,
    discountAmount: 120,
    discountPercentage: 30,
    description: "Upgrade your phone with 30% off smartphones.",
    code: "PHONE30"
  },
  {
    title: "20% Off Yoga Classes",
    store: "CorePower Yoga",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    category: "Health",
    minimumPurchase: 50,
    discountAmount: 10,
    discountPercentage: 20,
    description: "Find your zen with 20% off yoga classes.",
    code: "YOGA20"
  },
  {
    title: "50% Off Concert Tickets",
    store: "Ticketmaster",
    startDate: "2025-01-01",
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    price:20,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    category: "Entertainment",
    minimumPurchase: 40,
    discountAmount: 20,
    discountPercentage: 50,
    description: "Experience live music at half price.",
    code: "CONCERT50"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Insert sample coupons
    const insertedCoupons = await Coupon.insertMany(sampleCoupons);
    console.log(`Successfully added ${insertedCoupons.length} coupons to the database`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 