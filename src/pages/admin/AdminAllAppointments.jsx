import React from "react";
import { useAppointmentContext } from "../../context/AppointmentContext";
import AdminAllAppointmentsList from "../../components/admin/AdminAllAppointmentsList";

function AdminAllAppointments() {
  // const { appointments } = useAppointmentContext();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold font-serif text-center pt-2 pb-10">
          All Appointments
        </h1>
        <div>
          {/* {appointments?.map((appointment) => ( */}
          <AdminAllAppointmentsList />
          {/* {appointment?.date}
            {appointment?.time}
            {appointment?.username} */}
        </div>
        {/* ))} */}
      </div>
    </div>
  );
}

export default AdminAllAppointments;
