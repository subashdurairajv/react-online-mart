import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import ShopGridwall from './components/shop/ShopGridwall';


const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Welcome Home!</h1>
      <Router>
        <Routes>
          {/* Redirect empty path to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/gridwall" element={<ShopGridwall />} />
          
          {/* Example of a 404 Page or Dashboard */}
          <Route path="*" element={<div className="container mt-5">404 - Page Not Found</div>} />
        </Routes>
      </Router>
    
    </div>
  );
}

export default App;
