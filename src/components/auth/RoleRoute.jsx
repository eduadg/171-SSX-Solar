import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RoleRoute({ allowedRoles }) {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return allowedRoles.includes(userRole) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
} 