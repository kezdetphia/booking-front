import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";

const AppointmentContext = createContext();

export const useAppointmentContext = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const { setUser, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetching appointments when the component mounts
  useEffect(() => {
    getAppointments();
  }, []);

  //Fetch all appointments from db
  const getAppointments = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.log("User not authenicated");
        return;
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/appointments/getappointments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!res.ok) throw Error("server res nok ok");

      const data = await res.json();
      setAppointments(data.appointments);
    } catch (err) {
      console.log("error while fetching apps", err);
    } finally {
      setLoading(false);
    }
  };

  // Create an appointment
  const postAppointment = async (newAppointment) => {
    console.log("Starting postAppointment with:", newAppointment);
    setLoading(true);
    setError(null);
    const tempId = Date.now();
    const tempAppointment = { ...newAppointment, id: tempId };

    // Optimistically update the state
    setAppointments((prev) => [...prev, tempAppointment]);
    console.log("Optimistically added temporary appointment:", tempAppointment);

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.log("User not authenticated");
        setAppointments((prev) => prev.filter((app) => app.id !== tempId));
        return;
      }

      console.log("Sending POST request to create appointment...");
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

      if (!res.ok) {
        console.error("Server responded with an error:", res.status);
        throw new Error("Server error in postAppointmentDb context");
      }

      const data = await res.json();
      console.log("Received response from server:", data);

      // Replace the temporary appointment with the one from the server
      setAppointments((prev) =>
        prev.map((app) => (app.id === tempId ? data.appointment : app))
      );
      console.log(
        "Replaced temporary appointment with server data:",
        data.appointment
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
      // await getAppointmentsDb();
    } catch (err) {
      console.error("Error while adding appointment in context:", err);
      setAppointments((prev) => prev.filter((app) => app.id !== tempId));
    } finally {
      setLoading(false);
      console.log("Finished postAppointment process");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    console.log("deleteAppointment in context", appointmentId);
    setLoading(true);
    setError(null);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.log("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/appointments/deleteappointment/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Server error in deleteAppointment context");

      // Optimistically update the state
      setAppointments((prev) =>
        prev.filter((app) => app._id !== appointmentId)
      );
      console.log("Appointment deleted from state:", appointmentId);

      const data = await res.json();
      console.log("Appointment deleted from db:", data);

      // Update the user's appointments array on the server
      const updatedUser = {
        ...user,
        appointments: user.appointments.filter((id) => id !== appointmentId),
      };
      setUser(updatedUser);
    } catch (err) {
      console.log("Error while deleting appointment in context:", err);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        postAppointment,
        deleteAppointment,
        loading,
        error,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
