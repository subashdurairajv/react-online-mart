import React, { useEffect } from 'react';
import './App.css';
import LoginPage from './components/login/LoginPage';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ShopGridwall from './components/shop/ShopGridwall';
import ProductDetails from './components/description/ProductDetails';
import Checkout from './components/checkout/CheckoutPage';
import OrderStatus from './components/orderStatus/OrderStatus';
import { useIdleTimeout } from './authManager/IdleTimeout';
import AuthManager from './authManager/AuthManager';
import MyNavbar from './components/navBar/MyNavBar';
import OrderDetails from './components/orderDetails/OrderDetails';

const App: React.FC = () => {

  const location = useLocation()

  const hideNavbarPaths = ['/login', '/signup'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  // useEffect(() => {
  //   const handleTabClose = () => {
  //     // Clear everything so they must log in next time
  //     sessionStorage.clear();
  //   };

  //   window.addEventListener('beforeunload', handleTabClose);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleTabClose);
  //   };
  // }, []);



  useIdleTimeout(15)
  return (
    <div className="App">
      {shouldShowNavbar && <MyNavbar />}
        <AuthManager />
        <Routes>
          {/* Redirect empty path to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/gridwall" element={<ShopGridwall />} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Checkout />} />
          <Route path="/orderStatus" element={<OrderStatus />} />
          <Route path="/orderDetails/:id" element={<OrderDetails />} />
          
          {/* Example of a 404 Page or Dashboard */}
          <Route path="*" element={<div className="container mt-5">404 - Page Not Found</div>} />
        </Routes>
    
    </div>
  );
}

export default App;
