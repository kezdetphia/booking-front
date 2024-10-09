import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import LayoutComponent from "./components/user/LayoutComponent";
import AdminLayoutComponent from "./components/admin/AdminLayoutComponent";

import Book from "./pages/user/Book";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import { AuthContextProvider } from "./context/authContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import AdminRoute from "./components/admin/AdminRoute";

import AdminAppointments from "./pages/admin/AdminAppointments";

const App = () => {
  return (
    <AuthContextProvider>
      <AppointmentProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="*"
              element={
                <LayoutComponent>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/book" element={<Book />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                  </Routes>
                </LayoutComponent>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminLayoutComponent>
                  <Routes>
                    <Route
                      path=""
                      element={
                        <AdminRoute adminOnly={true}>
                          <AdminAppointments />
                        </AdminRoute>
                      }
                    />
                    {/* Add more admin-specific routes here if needed */}
                  </Routes>
                </AdminLayoutComponent>
              }
            />
          </Routes>
        </Router>
      </AppointmentProvider>
    </AuthContextProvider>
  );
};

export default App;
