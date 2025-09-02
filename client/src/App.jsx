
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Coupons from './pages/Coupon';
import FeedbackSupport from './pages/Feedback';
import AuthForm from './pages/AuthForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './Context/AuthContext';
import { ErrorPage } from './components/ErrorPage';
import { CouponProvider } from './Context/CouponContext';

const App = () => {
  return (
    <AuthProvider>
      <CouponProvider> 
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          <Route element={<>
            <Navbar />
            <ProtectedRoute />
          </>}>
            <Route path="/" element={<Home />} />
            <Route path="/coupons" element={<Coupons />} />
          </Route>
          <Route path="/FeedbackSupport" element={<>
            <Navbar />
            <FeedbackSupport />
          </>} />
          <Route path='*' element={<>
            <Navbar />
            <ErrorPage />
          </>} />
        </Routes>
        <Footer />
        <ToastContainer autoClose={1000}/>
      </Router>
      </CouponProvider>
    </AuthProvider>
  );
};

export default App;