import { useState, useEffect } from 'react'
import CryptoJS from "crypto-js";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import AppLayout from './components/appLayout/Layout'
import './App.css'
import Dashboard from './pages/Dashboard/Dashboard'
import GuestEntry from './pages/GuestEntry/GuestEntry'
import Login from './pages/Login/Login';
import Error from './pages/Error/Error';



const secretKey = "this is my secret code";

const ProtectedRoute = ({ children }) => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const detoken = Cookies.get("token");
      const allowedRoutes = Cookies.get("allowedRoutes");

      if (detoken && allowedRoutes) {
        try {
          const token = CryptoJS.AES.decrypt(detoken, secretKey).toString(CryptoJS.enc.Utf8);
          const routes = JSON.parse(CryptoJS.AES.decrypt(allowedRoutes, secretKey).toString(CryptoJS.enc.Utf8));
          const currentPath = window.location.pathname;

          if (token && routes.includes(currentPath)) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token or route decryption error:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [secretKey]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/materials/error');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  return isAuthenticated ? children : null;
};


function App() {



  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/error"
            element={<Error />}
          />

          <Route path='/*'
            element={
              <AppLayout body={<Routes>
                <Route
                  path="/materials/guestEntry"
                  element={<GuestEntry />}
                />
                <Route path="/materials/dashboard" element={<Dashboard />} />
              </Routes>} />
            }
          />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
