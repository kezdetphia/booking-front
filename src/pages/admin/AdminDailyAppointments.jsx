// import React from "react";
// import AdminAppointments from "./AdminAppointments";
// import AdminUsers from "./AdminUsers";
// import OnHoliday from "./OnHoliday";
// import AdminAllAppointments from "./AdminAllAppointments";

// function Admin({ appointmentDate, componentToRender }) {
//   // const { appointments } = useAppointmentContext();
//   return (
//     <>
//       {componentToRender === "Appointments" && (
//         <AdminAppointments appointmentDate={appointmentDate} />
//       )}
//       {componentToRender === "Users" && <AdminUsers />}
//       {componentToRender === "Taking a day off" && <OnHoliday />}
//       {componentToRender === "All Appointments" && <AdminAllAppointments />}
//     </>
//   );
// }

// export default Admin;

// src/pages/admin/AdminDailyAppointments.jsx

import React, { useEffect, useState } from "react";
import { useAppointmentContext } from "../../context/AppointmentContext";
import DayCalendar from "../../components/DayCalendar";
import { useAppointmentDateContext } from "../../context/appointmentDateContext";

const AdminDailyAppointments = () => {
  // const AdminDailyAppointments = ({ selectedDate }) => {
  const { appointments } = useAppointmentContext();
  const [loading, setLoading] = useState(true);
  const { selectedDate } = useAppointmentDateContext();

  console.log("selectedDate", selectedDate);

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
        <DayCalendar
          // selectedDate={selectedDate}
          isInteractive={true}
          isAdmin={true}
        />
      ) : (
        <div>No appointments for this date.</div>
      )}
    </div>
  );
};

export default AdminDailyAppointments;
