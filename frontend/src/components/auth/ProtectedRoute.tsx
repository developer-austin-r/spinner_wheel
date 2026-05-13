import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role?.slug && !allowedRoles.includes(user.role.slug)) {
    // User is authenticated but doesn't have the right role
    if (user.role.slug === 'super_admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/spin-page" replace />;
  }

  return <>{children}</>;
};
