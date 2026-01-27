import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

  
  
const AuthManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const publicRoutes = ['/login', '/signup'];

    // If no token exists and the user isn't already on a public page, kick them to login
    if (!token && !publicRoutes.includes(location.pathname)) {
      console.warn("No token found. Redirecting to login...");
      navigate('/login', { replace: true });
    }
  }, [location.pathname, navigate]);

  return null; // This component doesn't render UI, just logic
};

export default AuthManager