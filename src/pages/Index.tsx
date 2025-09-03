import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../api/config';

const Index = () => {
  // For now, just redirect to quick order
  return <Navigate to="/quick-order" replace />;
};

export default Index;