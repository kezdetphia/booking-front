// src/hooks/useUserAppointments.js
import { useState, useEffect } from "react";

const useUserAppointments = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAppointmentsDb = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuserappointments/${userId}`
          // `http://localhost:3001/api/users/getuserappointments/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data.appointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getAppointmentsDb();
    }
  }, [userId]);

  return { appointments, loading, error };
};

export default useUserAppointments;
