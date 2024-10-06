import React, { createContext, useContext, useState } from "react";

// Create the context
const AppointmentContext = createContext();

// Custom hook to use the AppointmentContext
export const useAppointments = () => useContext(AppointmentContext);

// Provider component
export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  return (
    <AppointmentContext.Provider value={{ appointments, setAppointments }}>
      {children}
    </AppointmentContext.Provider>
  );
};
