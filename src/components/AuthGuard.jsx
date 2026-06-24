
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard({ allowedRoles = [] }) {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect authenticated users trying to access unauthorized roles back to their default dashboard
    if (userRole === 'patient') return <Navigate to="/patient" replace />;
    if (userRole === 'doctor') return <Navigate to="/doctor/profile" replace />;
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
