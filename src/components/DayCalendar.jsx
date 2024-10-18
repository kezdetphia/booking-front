import React, { useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Timeline, message, Popconfirm, Button } from "antd";
import { useAppointmentContext } from "../context/AppointmentContext";
import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useAppointmentDateContext } from "../context/appointmentDateContext";

const DayCalendar = ({ isInteractive, isAdmin }) => {
  const { deleteAppointment, appointments } = useAppointmentContext();
  const { user } = useAuth();
  const { setSelectedTime, selectedDate } = useAppointmentDateContext();
  const navigate = useNavigate();
  const [clickedTime, setClickedTime] = useState(null); // State to track clicked time

  // Generate time slots dynamically based on the user's usual appointment length
  const generateTimeSlots = (start, end, interval) => {
    const times = [];
    let currentTime = start;
    while (currentTime < end) {
      times.push(currentTime);
      currentTime = dayjs(currentTime, "HH:mm")
        .add(interval, "minute")
        .format("HH:mm");
    }
    return times;
  };

  const hours = generateTimeSlots("07:00", "18:00", 30);

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments?.filter(
    (app) => app.date === selectedDate
  );

  // Create a set of taken hours based on appointments and their lengths
  const takenSlots = new Set();
  appointmentsForSelectedDate.forEach((appointment) => {
    const startTime = dayjs(appointment.time, "HH:mm");
    const length = parseInt(appointment.length, 10);

    for (let i = 0; i < length; i += 30) {
      const slotToMark = startTime.add(i, "minute").format("HH:mm");
      takenSlots.add(slotToMark);
    }
  });

  const handleDelete = async (e, appId) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    await deleteAppointment(appId);
    message.success("Appointment deleted successfully");
  };

  const timelineItems = hours.map((time) => {
    const appointment = appointmentsForSelectedDate.find(
      (app) => app.time === time
    );

    const isTaken = takenSlots.has(time);

    const handleOnClick = () => {
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

    const appointmentDisplay = (
      <div
        onClick={handleOnClick}
        style={{
          cursor:
            isAdmin || (!isTaken && isInteractive) ? "pointer" : "not-allowed",
          borderBottom: "1px solid #ccc",
          padding: "8px 0",
          backgroundColor:
            clickedTime === time
              ? "#ccffcc"
              : !isAdmin && isTaken
              ? "#ffcccc"
              : "transparent", // Green for clicked time
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p className="font-serif">
          {time} -{" "}
          {isTaken
            ? user?.isAdmin || appointment?.userId === user?._id
              ? appointment?.username
              : "Taken"
            : "Available"}
        </p>
        {user?.isAdmin && isTaken && appointment && (
          <div className="flex space-x-5 ">
            <Link to={`/admin/one-appointment/${appointment._id}`}>
              <Button ghost type="primary" variant="link">
                Edit
              </Button>
            </Link>
            <Popconfirm
              title={<p className="font-serif">Delete the task</p>}
              description={
                <p className="font-serif">Are you sure to delete this task?</p>
              }
              onConfirm={(e) => handleDelete(e, appointment._id)}
              okText={<p className="font-serif">Yes</p>}
              cancelText={<p className="font-serif">No</p>}
            >
              <Button type="primary" danger>
                <p className="font-serif">Delete</p>
              </Button>
            </Popconfirm>
          </div>
        )}
      </div>
    );

    return {
      color: isTaken ? "red" : "green",
      children: appointmentDisplay,
    };
  });

  return (
    <Timeline
      items={[
        ...timelineItems,
        {
          color: "#00CCFF",
          dot: <SmileOutlined />,
        },
      ]}
    />
  );
};

export default DayCalendar;
