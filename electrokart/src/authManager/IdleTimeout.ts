import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useIdleTimeout = (minutes: number) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer: any;

    const logout = () => {
      sessionStorage.clear(); // Wipe the token
      alert("Session expired due to inactivity.");
      navigate('/login', { replace: true });
    };

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(logout, minutes * 60 * 1000);
    };

    // Events that prove the user is still active
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    activityEvents.forEach(event => 
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Start timer on mount

    return () => {
      activityEvents.forEach(event => 
        window.removeEventListener(event, resetTimer)
      );
      if (timer) clearTimeout(timer);
    };
  }, [navigate, minutes]);
};