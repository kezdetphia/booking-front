import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";
import useSendEmail from "../hooks/useSendEmail";
import {
  AppointmentCancelledEmail,
  AppointmentConfirmEmail,
  AppointmentChangedEmail,
} from "../utils/AppointmentEmails";

const AppointmentContext = createContext();

export const useAppointmentContext = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const { setUser, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const { sendEmail } = useSendEmail();

  // Initialize Socket.IO client
  const socket = io(process.env.REACT_APP_API_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("appointmentUpdated", (data) => {
    console.log("Appointment updated:", data);
  });
  // Fetching appointments when the component mounts
  // useEffect(() => {
  //   const authToken = localStorage.getItem("authToken");
  //   if (authToken) {
  //     getAppointments();
  //     getDisabledDates();
  //   } else {
  //     console.log("token is not available yet to fetch the data");
  //   }
  // }, [user]);

  //websocket first
  useEffect(() => {
    // Fetch appointments when the component mounts
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      getAppointments();
      getDisabledDates();
    } else {
      console.log("Token is not available yet to fetch the data");
    }

    // Listen for appointment updates from the server
    socket.on("appointmentCreated", (newAppointment) => {
      setAppointments((prev) => [...prev, newAppointment]);
    });

    socket.on("appointmentUpdated", (updatedAppointment) => {
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === updatedAppointment._id ? updatedAppointment : app
        )
      );
    });

    socket.on("appointmentDeleted", (deletedAppointment) => {
      setAppointments((prev) =>
        prev.filter((app) => app._id !== deletedAppointment._id)
      );
    });

    // // Cleanup socket connection on unmount
    // return () => {
    //   socket.disconnect();
    // };
    // Cleanup socket connection on unmount
    return () => {
      socket.off("appointmentCreated");
      socket.off("appointmentUpdated");
      socket.off("appointmentDeleted");
      socket.disconnect();
    };
  }, [user]);

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
        `${process.env.REACT_APP_API_URL}/api/appointments/getappointments`,
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
        `${process.env.REACT_APP_API_URL}/api/appointments/create`,
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

      // Replace the temporary appointment with the one from the server
      setAppointments((prev) =>
        prev.map((app) => (app.id === tempId ? data.appointment : app))
      );
      console.log(
        "Replaced temporary appointment with server data:",
        data.appointment
      );

      // Send email notification
      try {
        console.log("Attempting to send email...");
        await sendEmail(
          user?.email,
          "new appointment",
          "There's a new booking",
          AppointmentConfirmEmail(data?.appointment)
        );
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      // Update the user's appointments array
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          appointments: [
            ...(prevUser.appointments || []),
            data.appointment._id,
          ],
        };
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
        `${process.env.REACT_APP_API_URL}/api/admin/admindeleteappointment/${appointmentId}`,
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

      // Send email notification
      try {
        console.log("Attempting to send email from updateappointments");
        await sendEmail(
          user?.email,
          "Your apppontment was cancelled!",
          "Appointment Deleted",
          AppointmentCancelledEmail(data?.appointment)
        );
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    } catch (err) {
      console.log("Error while deleting appointment in context:", err);
    }
  };

  const updateAppointment = async (appointmentId, editedAppointment) => {
    console.log("Starting updateAppointment with ID:", appointmentId);
    setLoading(true);
    setError(null);

    // Optimistically update the state
    setAppointments((prev) =>
      prev.map((app) =>
        app._id === appointmentId ? { ...app, ...editedAppointment } : app
      )
    );
    console.log("Optimistically updated appointment:", editedAppointment);

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.log("User not authenticated");
      // Optionally revert the state here or handle it differently
      setLoading(false);
      return;
    }

    try {
      console.log("Sending PATCH request to update appointment...");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/admineditappointment/${appointmentId}`, // Ensure the correct endpoint
        {
          method: "PATCH", // Use PATCH for updates
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ appointmentId, ...editedAppointment }),
        }
      );

      if (!res.ok) {
        console.error("Server responded with an error:", res.status);
        throw new Error("Server error in updateAppointment context");
      }

      const data = await res.json();
      console.log("Received response from server:", data);

      // Optionally replace the appointment with the updated data from the server
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? data.updatedAppointment : app
        )
      );
      console.log(
        "Successfully updated appointment in state:",
        data.updatedAppointment
      );

      try {
        console.log("Attempting to send email from updateappointments");
        await sendEmail(
          user?.email,
          "Your apppontment was changed!",
          "Appointment Changed",
          AppointmentChangedEmail(
            data?.updatedAppointment,
            data?.oldAppointment
          )
        );
        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    } catch (err) {
      console.error("Error while updating appointment in context:", err);

      // If there's an error, revert the optimistic update
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? { ...app, ...editedAppointment } : app
        )
      );
    } finally {
      setLoading(false);
      console.log("Finished updateAppointment process");
    }
  };

  const disableDates = async (date, reason) => {
    const authToken = localStorage.getItem("authToken");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/admincreatedisableddate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ date, reason }),
        }
      );

      if (!res.ok) throw new Error("Server error in disableDates context");

      const data = await res.json();
      setDisabledDates((prev) => [...prev, data.disabledDates]);
    } catch (err) {
      console.log("Error while disabling dates in context:", err);
    }
  };

  const getDisabledDates = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/admingetdisableddates`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Server error in getDisabledDates context");

      const data = await res.json();
      setDisabledDates(data.disabledDates);
    } catch (err) {
      console.log("Error while fetching disabled dates in context:", err);
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
        disabledDates,
        disableDates,
        updateAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
