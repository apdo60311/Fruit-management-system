import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;