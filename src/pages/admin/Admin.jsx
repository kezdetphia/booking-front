import React from "react";
import AdminAppointments from "./AdminAppointments";
import AdminUsers from "./AdminUsers";
import OnHoliday from "./OnHoliday";
import AdminAllAppointments from "./AdminAllAppointments";

function Admin({ appointmentDate, componentToRender }) {
  // const { appointments } = useAppointmentContext();
  return (
    <>
      {componentToRender === "Appointments" && (
        <AdminAppointments appointmentDate={appointmentDate} />
      )}
      {componentToRender === "Users" && <AdminUsers />}
      {componentToRender === "Taking a day off" && <OnHoliday />}
      {componentToRender === "All Appointments" && <AdminAllAppointments />}
    </>
  );
}

export default Admin;
