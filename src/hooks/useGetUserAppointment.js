// src/hooks/useGetUserAppointment.js
import { useState, useEffect } from "react";

const useGetUserAppointment = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAppointmentsDb = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/getuserappointments/${userId}`
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

export default useGetUserAppointment;
