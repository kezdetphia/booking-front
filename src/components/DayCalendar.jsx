import React, { useState } from "react";
import { Tag, Row, Col, message, Divider } from "antd";
import { useAppointmentContext } from "../context/AppointmentContext";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useAppointmentDateContext } from "../context/appointmentDateContext";
import dayjs from "dayjs";
const DayCalendar = ({ isInteractive, isAdmin }) => {
  const { appointments } = useAppointmentContext();
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
  // Create a set of taken hours based on appointments
  const takenHours = new Set();
  appointmentsForSelectedDate.forEach((appointment) => {
    const startHour = appointment.time; // Start time in "HH:mm" format
    const appLength = appointment.length; // Length in minutes

    // Parse the start hour as a dayjs object
    const startTime = dayjs(startHour, "HH:mm");

    // Add the appointment length to get the end time
    const endTime = startTime.add(appLength, "minute");
    const endHour = endTime.format("HH:mm"); // Format end time as "HH:mm"

    // Loop through all 30-minute intervals between startHour and endHour
    let timeSlot = startTime;
    while (timeSlot.isBefore(endTime)) {
      takenHours.add(timeSlot.format("HH:mm")); // Add each 30-minute slot to the set
      timeSlot = timeSlot.add(30, "minute"); // Increment by 30 minutes
    }

    console.log("Taken time slots:", [...takenHours]);
  });
  // To verify the Set content
  console.log("takenhiursssssss", [...takenHours]);

  const handleTagClick = (time) => {
    const selectedTime = dayjs(time, "HH:mm"); // Parse the selected time

    let isTaken = false;

    // Loop through the takenHours Set
    for (const [startHour, endHour] of takenHours) {
      const startTime = dayjs(startHour, "HH:mm");
      const endTime = dayjs(endHour, "HH:mm");

      // Check if the selected time falls between the start and end times
      if (
        selectedTime.isSameOrAfter(startTime) &&
        selectedTime.isBefore(endTime)
      ) {
        isTaken = true;
        break; // Exit the loop if the time is taken
      }
    }

    if (isTaken) {
      message.error("Selected time overlaps with another appointment.");
      return;
    }

    if (!isTaken && isInteractive) {
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
      const isTaken = takenHours.has(time); // Check if this time slot is in the takenHours set

      return (
        <Col key={time} span={6}>
          <Tag
            color={isTaken ? "default" : "success"} // If taken, show as default (red) otherwise green
            style={{
              cursor: !isTaken && isInteractive ? "pointer" : "not-allowed", // Disable the cursor if it's taken
              display: "block",
              textAlign: "center",
              padding: "6px",
              borderRadius: "6px",
              boxShadow: `${
                clickedTime === time
                  ? "4px 4px 10px rgba(0, 0, 0, 0.3)"
                  : "none"
              }`,
            }}
            onClick={() => handleTagClick(time)} // Handle clicking of time slots
          >
            {time}
          </Tag>
        </Col>
      );
    });
  };

  return (
    <>
      <Divider orientation="left">
        <p className="font-serif">Morning</p>
      </Divider>
      <div className=" shadow-md p-4 rounded-lg ">
        <Row gutter={[16, 16]}>{renderTags(timeSlots.morning)}</Row>
      </div>

      <Divider orientation="left">
        <p className="font-serif">Afternoon</p>
      </Divider>
      <div className=" shadow-md p-4 rounded-lg ">
        <Row gutter={[16, 16]}>{renderTags(timeSlots.afternoon)}</Row>
      </div>

      <Divider orientation="left">
        <p className="font-serif">Evening</p>
      </Divider>
      <div className=" shadow-md p-4 rounded-lg ">
        <Row gutter={[16, 16]}>{renderTags(timeSlots.evening)}</Row>
      </div>
    </>
  );
};

export default DayCalendar;
