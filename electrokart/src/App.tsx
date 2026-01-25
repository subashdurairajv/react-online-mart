import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import ShopGridwall from './components/shop/ShopGridwall';
import ProductDetails from './components/description/ProductDetails';
import Checkout from './components/checkout/CheckoutPage';
import OrderStatus from './components/orderStatus/orderStatus';


const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Redirect empty path to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/gridwall" element={<ShopGridwall />} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Checkout />} />
          <Route path="/orderStatus" element={<OrderStatus />} />
          
          {/* Example of a 404 Page or Dashboard */}
          <Route path="*" element={<div className="container mt-5">404 - Page Not Found</div>} />
        </Routes>
      </Router>
    
    </div>
  );
}

export default App;
