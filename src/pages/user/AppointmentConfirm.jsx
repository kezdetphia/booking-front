import React from "react";
import { useAuth } from "../../context/authContext";

function AppointmentConfirm() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Thanks for booking an appointment {user?.username}</h1>
      {/* <p>Your appointment is on: } </p> */}
    </div>
  );
}

export default AppointmentConfirm;
