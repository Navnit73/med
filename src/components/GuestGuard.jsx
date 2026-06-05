import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestGuard() {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated) {
    if (userRole === 'patient') {
      return <Navigate to="/patient" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
