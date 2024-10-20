import React, { useState } from "react";
import { Tag, Row, Col, message, Divider } from "antd";
import { useAppointmentContext } from "../context/AppointmentContext";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useAppointmentDateContext } from "../context/appointmentDateContext";

const DayCalendar = ({ isInteractive, isAdmin }) => {
  const { deleteAppointment, appointments } = useAppointmentContext();
  const { user } = useAuth();
  const { setSelectedTime, selectedDate } = useAppointmentDateContext();
  const navigate = useNavigate();
  const [clickedTime, setClickedTime] = useState(null); // State to track clicked time

  const timeSlots = {
    morning: [
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
    ],
    afternoon: [
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
    ],
    evening: ["16:00", "16:30", "17:00", "17:30", "18:00"],
  };

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments?.filter(
    (app) => app.date === selectedDate
  );

  // Create a set of taken hours based on appointments
  const takenHours = new Set();
  appointmentsForSelectedDate.forEach((appointment) => {
    const startHour = appointment.time;
    takenHours.add(startHour);
  });

  const handleTagClick = (time) => {
    const isTaken = takenHours.has(time);
    if (isAdmin) {
      // Admin logic if needed
    } else if (!isTaken && isInteractive) {
      if (user) {
        setSelectedTime(time);
        setClickedTime(time); // Set the clicked time
      } else {
        message.error("Please login to book an appointment");
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      }
    }
  };
  const renderTags = (timeSlots) => {
    return timeSlots.map((time) => {
      const isTaken = takenHours.has(time);

      return (
        <Col key={time} span={6}>
          <Tag
            color={isTaken ? "default" : "success"}
            style={{
              cursor: !isTaken && isInteractive ? "pointer" : "not-allowed",
              display: "block",
              textAlign: "center",
              border: `${clickedTime === time ? "" : "1px solid #FFFFFF"}`,
            }}
            onClick={() => handleTagClick(time)}
          >
            {time}
          </Tag>
        </Col>
      );
    });
  };

  return (
    <>
      <Divider orientation="left">Morning</Divider>
      <Row gutter={[16, 16]}>{renderTags(timeSlots.morning)}</Row>

      <Divider orientation="left">Afternoon</Divider>
      <Row gutter={[16, 16]}>{renderTags(timeSlots.afternoon)}</Row>

      <Divider orientation="left">Evening</Divider>
      <Row gutter={[16, 16]}>{renderTags(timeSlots.evening)}</Row>
    </>
  );
};

export default DayCalendar;
