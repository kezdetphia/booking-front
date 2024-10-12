import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("is user???", user);

  if (!user) {
    // If the user is not logged in, redirect to the sign-in page
    return <Navigate to="/signin" />;
  }

  if (!user.isAdmin) {
    // If the route is admin-only and the user is not an admin, redirect to home
    return <Navigate to="/" />;
  }

  // If the user is authenticated and has the required role, render the children
  return children;
};

export default AdminRoute;
