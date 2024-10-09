// src/hooks/adminDeleteAppointment.js
import { useState } from "react";

const useAdminDeleteAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAppointment = async (appointmentId) => {
    setLoading(true);
    setError(null);

    const authToken = localStorage.getItem("authToken");
    if (!authToken) console.log("no authtoken in useAdminDeleteAppointment");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/admindeleteappointment/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Add the authToken to the headers if needed
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
      console.log("Appointment deleted", appointmentId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteAppointment, loading, error };
};

export default useAdminDeleteAppointment;
