import React from "react";
import { useAuth } from "../../context/authContext";

function AppointmentConfirm() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-serif">
        Thanks for booking an appointment {user?.username}
      </h1>
    </div>
  );
}

export default AppointmentConfirm;
