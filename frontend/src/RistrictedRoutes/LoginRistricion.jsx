import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthProvider';

const LoginRestriction = ({ children }) => {
  const { userData, loading } = useContext(AuthContext);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!userData) return <Navigate to="/login" replace />;

  return children;
};

export default LoginRestriction;