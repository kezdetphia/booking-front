import React from "react";
import AdminAppointments from "./AdminAppointments";

function AdminMain({ appointmentDate }) {
  return (
    <>
      <AdminAppointments appointmentDate={appointmentDate} />
    </>
  );
}

export default AdminMain;
