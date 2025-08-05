// components/RootRedirect.jsx
import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return <Navigate to={user?.token ? '/dashboard' : '/login'} replace />;
};

export default RootRedirect;
