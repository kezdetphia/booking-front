import React, { useEffect, useState } from "react";
import { useAppointmentContext } from "../../context/AppointmentContext";
// import DayCalendar from "../../components/DayCalendar";
import { useAppointmentDateContext } from "../../context/appointmentDateContext";
import AdminDayCalendar from "../../components/admin/AdminDayCalendar";

const AdminDailyAppointments = () => {
  const { appointments } = useAppointmentContext();
  const [loading, setLoading] = useState(true);
  const { selectedDate } = useAppointmentDateContext();

  useEffect(() => {
    if (appointments.length > 0) {
      setLoading(false);
    }
  }, [appointments]);

  // Filter appointments to only include those that match the selectedDate
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.date === selectedDate
  );

  return (
    <div>
      {loading ? (
        <div>Loading appointments...</div>
      ) : filteredAppointments.length > 0 ? (
        <AdminDayCalendar isInteractive={true} isAdmin={true} />
      ) : (
        <div>No appointments for this date.</div>
      )}
    </div>
  );
};

export default AdminDailyAppointments;
