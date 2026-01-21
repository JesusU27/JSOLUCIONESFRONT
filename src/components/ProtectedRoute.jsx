import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && user.userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
