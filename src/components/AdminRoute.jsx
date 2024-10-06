import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Assuming you have a hook to access auth context

const PrivateRoute = ({ children, adminOnly }) => {
  const { user } = useAuth(); // Get the current user from context
  console.log("is user???", user);

  if (!user) {
    // If the user is not logged in, redirect to the sign-in page
    return <Navigate to="/signin" />;
  }

  if (adminOnly && !user.isAdmin) {
    // If the route is admin-only and the user is not an admin, redirect to home
    return <Navigate to="/" />;
  }

  // If the user is authenticated and has the required role, render the children
  return children;
};

export default PrivateRoute;
