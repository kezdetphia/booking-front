import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

// Create the context
const AppointmentContext = createContext();

// Custom hook to use the AppointmentContext
export const useAppointments = () => useContext(AppointmentContext);

// Provider component
export const AppointmentProvider = ({ children }) => {
  const { setUser, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  // const [updateAppointmentFetch, setUpdateAppointmentFetch] = useState(false)

  //fetching appointments
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        return "User not authenicated";
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/appointments/getappointments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
            Authorization: `Bearer ${authToken}`, // Add the authToken to the headers
          },
        }
      );

      if (!res.ok) throw Error("server res nok ok");

      const data = await res.json();
      setAppointments(data.appointments);
    } catch (err) {
      console.log("error while fetching apps", err);
    }
  };

  const addAppointment = async (newAppointment) => {
    const tempId = Date.now();
    const tempAppointment = { ...newAppointment, id: tempId };

    // Optimistically update the state
    setAppointments((prev) => [...prev, tempAppointment]);

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.log("User not authenticated");
        setAppointments((prev) => prev.filter((app) => app.id !== tempId));
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/appointments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newAppointment),
        }
      );

      if (!res.ok) throw new Error("Server error in addAppointment context");

      const data = await res.json();

      // Replace the temporary appointment with the one from the server
      setAppointments((prev) =>
        prev.map((app) => (app.id === tempId ? data.appointment : app))
      );

      // Debugging: Log the current user and the new appointment
      console.log("Current user before update:", user);
      console.log("New appointment ID:", data.appointment._id);

      // Update the user's appointments array
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          appointments: [
            ...(prevUser.appointments || []),
            data.appointment._id,
          ],
        };
        console.log("Updated user:", updatedUser);
        return updatedUser;
      });

      // Fetch appointments again to ensure the list is up-to-date
      await fetchAppointments();
    } catch (err) {
      console.log("Error while adding appointment in context:", err);
      setAppointments((prev) => prev.filter((app) => app.id !== tempId));
    }
  };

  return (
    <AppointmentContext.Provider
      value={{ appointments, setAppointments, addAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
