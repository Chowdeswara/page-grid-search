
import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../api/config';

const Index = () => {
  console.log('🏠 Index page - redirecting to dashboard');

  // For now, always redirect to dashboard
  // In production, this would check authentication and redirect accordingly
  return <Navigate to={ROUTES.DASHBOARD} replace />;
};

export default Index;
