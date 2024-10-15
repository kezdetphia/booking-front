import React, { createContext, useContext, useState } from "react";

const AppointmentDateContext = createContext();

export const useAppointmentDateContext = () =>
  useContext(AppointmentDateContext);

export const AppointmentDateProvider = ({ children }) => {
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <AppointmentDateContext.Provider
      value={{
        appointmentDate,
        setAppointmentDate,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </AppointmentDateContext.Provider>
  );
};
