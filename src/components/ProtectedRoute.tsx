import { Navigate } from 'react-router-dom';
import React from 'react';
import Header from './Header'; // Import the Header component

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default ProtectedRoute;
