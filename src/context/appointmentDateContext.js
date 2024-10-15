import React, { createContext, useContext, useState } from "react";

const AppointmentDateContext = createContext();

export const useAppointmentDateContext = () =>
  useContext(AppointmentDateContext);

export const AppointmentDateProvider = ({ children }) => {
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();

  return (
    <AppointmentDateContext.Provider
      value={{
        appointmentDate,
        setAppointmentDate,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
      }}
    >
      {children}
    </AppointmentDateContext.Provider>
  );
};
