import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import UserLayoutComponent from "./components/user/UserLayoutComponent";
import AdminLayoutComponent from "./components/admin/AdminLayoutComponent";

import Book from "./pages/user/Book";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import { AuthContextProvider } from "./context/authContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import AdminRoute from "./components/admin/AdminRoute";

// import Admin from "./pages/admin/Admin";
import UserDetails from "./pages/user/UserDetails";
import AdminDailyAppointments from "./pages/admin/AdminDailyAppointments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAllAppointments from "./pages/admin/AdminAllAppointments";
import OnHoliday from "./pages/admin/OnHoliday";

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
                <UserLayoutComponent>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/book" element={<Book />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/user/:id" element={<UserDetails />} />
                  </Routes>
                </UserLayoutComponent>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayoutComponent />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDailyAppointments />} />
              <Route path="users" element={<AdminUsers />} />
              {/* <Route path="user/:id" element={<UserDetails />} /> */}
              <Route
                path="all-appointments"
                element={<AdminAllAppointments />}
              />
              <Route path="day-off" element={<OnHoliday />} />
            </Route>
          </Routes>
        </Router>
      </AppointmentProvider>
    </AuthContextProvider>
  );
};

export default App;
