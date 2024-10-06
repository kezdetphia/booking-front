import React from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Timeline, Button, Popover } from "antd";
import { useAppointments } from "../context/AppointmentContext";

const DayCalendar = ({
  selectedDate,
  setSelectedTime,
  isInteractive,
  isAdmin,
}) => {
  const { appointments } = useAppointments();

  const hours = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments.filter(
    (app) => app.date === selectedDate
  );

  const timelineItems = hours.map((time) => {
    // Find the appointment for the current time
    const appointment = appointmentsForSelectedDate.find(
      (app) => app.time === time
    );

    const isTaken = !!appointment;

    const handleOnClick = () => {
      if (isAdmin) {
        console.log("Admin viewing appointment:", appointment);
      } else if (!isTaken && isInteractive) {
        setSelectedTime(time);
      }
    };
    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );

    return {
      color: isTaken ? "red" : "green",
      children: (
        <>
          <Popover placement="bottom" content={content} title={"titl;e"}>
            <div
              onClick={handleOnClick}
              style={{
                cursor:
                  isAdmin || (!isTaken && isInteractive)
                    ? "pointer"
                    : "not-allowed",
                borderBottom: "1px solid #ccc",
                padding: "8px 0",
                backgroundColor:
                  !isAdmin && isTaken ? "#ffcccc" : "transparent", // Light red background for taken slots if not admin
              }}
            >
              {time} -{" "}
              {isTaken
                ? isAdmin
                  ? appointment.username
                  : "Taken"
                : "Available"}
            </div>
          </Popover>
        </>
      ),
    };
  });

  return (
    <Timeline
      items={[
        ...timelineItems,
        {
          color: "#00CCFF",
          dot: <SmileOutlined />,
          // children: <p>Custom color testing</p>,
        },
      ]}
    />
  );
};

export default DayCalendar;
