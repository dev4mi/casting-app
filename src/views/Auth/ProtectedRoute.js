import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ element, requiredPermissions }) => {
  const { user } = useAuth(); // Assuming user object contains roles and permissions
  useEffect(() => {
   
  }, [user]);
  // Check if the user has the required permissions
  const storedPermissions = JSON.parse(localStorage.getItem('permissions')) || [];
  const hasPermission = requiredPermissions.every(permission => 
    storedPermissions.includes(permission) // Adjust based on how permissions are stored
  );

  return hasPermission ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
