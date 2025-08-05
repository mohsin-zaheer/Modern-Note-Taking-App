import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiresAuth }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If route requires auth and user is not logged in
  if (requiresAuth && !user?.token) {
    return <Navigate to="/login" replace />;
  }

  // If route is public and user is logged in
  if (!requiresAuth && user?.token) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default ProtectedRoute;
