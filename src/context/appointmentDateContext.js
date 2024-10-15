// src/context/appointmentDateContext.js
import React, { createContext, useContext, useState } from "react";

const AppointmentDateContext = createContext();

export const AppointmentDateProvider = ({ children }) => {
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Initialize with null or a default value
  const [selectedTime, setSelectedTime] = useState(null);

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

export const useAppointmentDateContext = () => {
  const context = useContext(AppointmentDateContext);
  if (!context) {
    throw new Error(
      "useAppointmentDateContext must be used within an AppointmentDateProvider"
    );
  }
  return context;
};
