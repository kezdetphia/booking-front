import React from "react";
import { SmileOutlined, CloseOutlined } from "@ant-design/icons";
import { Timeline, Popover, message, Popconfirm, Button } from "antd";
import AppointmentEditForm from "./AppointmentEditForm";
import useAdminDeleteAppointment from "../hooks/useAdminDeleteAppointment";

const DayCalendar = ({
  selectedDate,
  setSelectedTime,
  isInteractive,
  isAdmin,
  appointments,
}) => {
  const { deleteAppointment } = useAdminDeleteAppointment();

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
  const appointmentsForSelectedDate = appointments?.filter(
    (app) => app.date === selectedDate
  );

  // Create a set of taken hours based on appointments and their lengths
  const takenHours = new Set();
  appointmentsForSelectedDate.forEach((appointment) => {
    const startHour = parseInt(appointment.time.split(":")[0], 10);
    const length = parseInt(appointment.length, 10);

    for (let i = 0; i < length; i++) {
      const hourToMark = startHour + i;
      if (hourToMark < 24) {
        // Ensure we don't go beyond 24 hours
        takenHours.add(hourToMark);
      }
    }
  });

  const confirm = async (e, appId) => {
    console.log(e);
    await handleDelete(appId);
    message.success("Click on Yes");
  };

  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const handleDelete = async (appId) => {
    try {
      await deleteAppointment(appId);
      message.success("Appointment deleted successfully");
      console.log("Deleting appointment with ID:", appId);
    } catch (error) {
      message.error("Failed to delete appointment");
      console.error("Error deleting appointment:", error);
    }
  };

  const timelineItems = hours.map((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    const appointment = appointmentsForSelectedDate.find(
      (app) => app.time === time
    );

    const isTaken = takenHours.has(hour);

    const handleOnClick = () => {
      if (isAdmin) {
      } else if (!isTaken && isInteractive) {
        setSelectedTime(time);
      }
    };

    const content = (appointment) => {
      if (!appointment) return null;
      return <AppointmentEditForm appointment={appointment} />;
    };

    const appointmentDisplay = (
      <div
        onClick={handleOnClick}
        style={{
          cursor:
            isAdmin || (!isTaken && isInteractive) ? "pointer" : "not-allowed",
          borderBottom: "1px solid #ccc",
          padding: "8px 0",
          backgroundColor: !isAdmin && isTaken ? "#ffcccc" : "transparent", // Light red background for taken slots if not admin
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {time} -{" "}
          {isTaken ? (isAdmin ? appointment?.username : "Taken") : "Available"}
        </span>
        {isAdmin && isTaken && (
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDelete(appointment._id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>

          // <CloseOutlined
          //   style={{ color: "red", cursor: "pointer" }}
          //   onClick={(e) => {
          //     e.stopPropagation(); // Prevent triggering the parent click event
          //     handleDelete(appointment?._id);
          //   }}
          // />
        )}
      </div>
    );

    return {
      color: isTaken ? "red" : "green",
      children: (
        <Popover
          placement="bottom"
          content={content(appointment)}
          title={`Appointment}`}
        >
          {appointmentDisplay}
        </Popover>
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
        },
      ]}
    />
  );
};

export default DayCalendar;
