MagicCoupon

MagicCoupon is a React + Node.js full-stack application that helps users find and manage amazing coupon deals with ease.

🚀 Quick Start (One Command)
docker-compose up --build


Then:

Frontend: http://localhost:3000

Backend API: http://localhost:5000

📌 Features

User authentication (Signup/Login)

View, search, and filter coupons

Add coupons to My Coupons

Remove coupons from My Coupons

Responsive UI with React and Tailwind CSS

Backend API using Node.js, Express, and MongoDB

Fully containerized with Docker for easy setup

🛠 Installation & Setup
1. Clone the repository
git clone https://github.com/adityachauhan1-in/MagicCoupon.git

2. Navigate to the project folder
cd MagicCoupon

3. Run with Docker Compose (Recommended)

Make sure you have Docker installed and running.

docker-compose up --build


This will automatically build and start both the frontend and backend, along with MongoDB.

🔑 Environment Variables

In server/.env:

MONGO_URI=mongodb://mongo:27017/magiccoupon
JWT_SECRET=your_jwt_secret
PORT=5000


In client/.env:

REACT_APP_API_URL=http://localhost:5000

💻 Technologies Used

Frontend: React, Tailwind CSS

Backend: Node.js, Express

Database: MongoDB

Containerization: Docker, Docker Compose