import React from "react";
import AdminAppointments from "./AdminAppointments";
import { useAuth } from "../../context/authContext";
import { useAppointmentContext } from "../../context/AppointmentContext";
import AdminUsers from "./AdminUsers";

function Admin({ appointmentDate, componentToRender }) {
  // const { user } = useAuth();
  // const { appointments } = useAppointmentContext();
  return (
    <>
      {componentToRender === "Appointments" && (
        <AdminAppointments appointmentDate={appointmentDate} />
      )}
      {componentToRender === "Users" && <AdminUsers />}
    </>
  );
}

export default Admin;
