import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import DayCalendar from "../components/DayCalendar";
import { useAppointments } from "../context/AppointmentContext";

function Admin({ appointmentDate }) {
  const { appointments } = useAppointments();
  const { user } = useAuth();

  // Filter appointments to only include those that match the appointmentDate
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.date === appointmentDate
  );

  return (
    <div>
      {filteredAppointments.length > 0 ? (
        <DayCalendar
          selectedDate={appointmentDate}
          isInteractive={true}
          isAdmin={user?.isAdmin}
        />
      ) : (
        <div>No appointments for this date.</div>
      )}
    </div>
  );
}

export default Admin;
