import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useFitManager } from '../../context/FitManagerContext';

export default function ProtectedRoute({ children }) {
  const { user } = useFitManager();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
