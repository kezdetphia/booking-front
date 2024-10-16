import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import DayCalendar from "../../components/DayCalendar";
import { useAppointmentContext } from "../../context/AppointmentContext";

function AdminAppointments() {
  // function AdminAppointments({ appointmentDate }) {
  const { appointments } = useAppointmentContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointments.length > 0) {
      setLoading(false);
    }
  }, [appointments]);

  //TODO: this appointmetnDate needs to be fixed

  // Filter appointments to only include those that match the appointmentDate
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.date === appointmentDate
  );

  return (
    <div>
      {loading ? (
        <div>Loading appointments...</div>
      ) : filteredAppointments.length > 0 ? (
        <DayCalendar isInteractive={true} isAdmin={user?.isAdmin} />
      ) : (
        <div>No appointments for this date.</div>
      )}
    </div>
  );
}

export default AdminAppointments;
