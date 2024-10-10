import React from "react";
import AdminAppointments from "./AdminAppointments";
import { useAuth } from "../../context/authContext";
import { useAppointmentContext } from "../../context/AppointmentContext";

function Admin({ appointmentDate }) {
  const { user } = useAuth();
  const { appointments } = useAppointmentContext();
  return (
    <>
      <AdminAppointments appointmentDate={appointmentDate} />
    </>
  );
}

export default Admin;
