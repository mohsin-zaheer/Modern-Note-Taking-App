import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from './components/Profile';
import AddNewModal from './components/AddNewModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import RootRedirect from './components/RootRedirect';

function App() {
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate small delay to ensure localStorage load
    setTimeout(() => setLoading(false), 100); 
  }, []);

  const hideNavbarRoutes = ['/register', '/login'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  if (loading) return <LoadingSpinner/>; // or a loader

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes (Redirect if logged in) */}
        <Route path="/" element={<RootRedirect/>} />
        
        <Route path="/login" element={<ProtectedRoute element={<Login />} requiresAuth={false} />} />
        <Route path="/register" element={<ProtectedRoute element={<Signup />} requiresAuth={false} />} />

        {/* Protected Routes (Redirect if not logged in) */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiresAuth={true} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} requiresAuth={true} />} />
      </Routes>
      {!shouldHideNavbar && <Footer />}
      <ToastContainer position="top-right" autoClose={2000} />
      <AddNewModal />
    </>
  );
}

export default App;
