// src/components/UserDrawer.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { Button, Divider, Drawer, Avatar, List } from "antd";
import { Link } from "react-router-dom";
import { useAppointmentContext } from "../../context/AppointmentContext";

function UserDrawer({ drawerOpen, onClose, handleLogout }) {
  const { user } = useAuth();
  const { appointments } = useAppointmentContext();
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  const categorizeAppointments = (appointments) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const past = [];
    const todayAppointments = [];
    const future = [];

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}`
      );

      if (appointmentDateTime < now) {
        past.push(appointment);
      } else if (appointmentDate.getTime() === today.getTime()) {
        todayAppointments.push(appointment);
      } else {
        future.push(appointment);
      }
    });

    return { past, today: todayAppointments, future };
  };

  const { today: todayAppointments, future } =
    categorizeAppointments(appointments);

  const personalData = [user?.username, user?.email];

  const showChildrenDrawer = (content) => {
    setSelectedContent(content);
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  return (
    <Drawer
      title="Menu"
      width={200}
      closable={false}
      onClose={onClose}
      open={drawerOpen}
    >
      <h1
        className="cursor-pointer"
        onClick={() => showChildrenDrawer("Profile")}
      >
        My Profile
      </h1>
      <h1
        className="cursor-pointer"
        onClick={() => showChildrenDrawer("Appointments")}
      >
        My Appointments
      </h1>

      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>

      <Drawer
        title={selectedContent}
        width={320}
        closable={false}
        onClose={onChildrenDrawerClose}
        open={childrenDrawer}
      >
        {selectedContent === "Appointments" ? (
          <div>
            <Divider orientation="left" orientationMargin="0">
              Today's Appointment
            </Divider>
            {todayAppointments.map((appointment, index) => (
              <div className="flex flex-col" key={`today-${index}`}>
                <div>
                  {appointment?.date} {appointment?.time}
                </div>
                <div>{appointment?.desc}</div>
                <Divider />
              </div>
            ))}
            <Divider orientation="left" orientationMargin="0">
              Future Appointments
            </Divider>
            {future.length > 0 ? (
              future.map((appointment, index) => (
                <div className="flex flex-col" key={`future-${index}`}>
                  <div>
                    {appointment?.date} {appointment?.time}
                  </div>
                  <div>{appointment?.desc}</div>
                  <Divider />
                </div>
              ))
            ) : (
              <div>
                <p>
                  No future appointments.{" "}
                  <Link to="/book" onClick={onChildrenDrawerClose}>
                    <Button type="primary">Book an appointment now</Button>
                  </Link>
                </p>
              </div>
            )}
          </div>
        ) : selectedContent === "Profile" ? (
          <>
            <div className="flex justify-center">
              <Avatar
                style={{
                  backgroundColor: "#ffcccb",
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </div>
            <Divider orientation="center">{user?.username}</Divider>
            <List
              header={
                <div>
                  <h1 className="font-bold">Personal Details</h1>
                </div>
              }
              footer={
                <div className="flex justify-center">
                  <Link to="/book">
                    <Button onClick={onChildrenDrawerClose} type="primary">
                      Book an appointment
                    </Button>
                  </Link>
                </div>
              }
              bordered
              dataSource={personalData}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </>
        ) : (
          <h1>DEFAULT CONTENT</h1>
        )}
      </Drawer>
    </Drawer>
  );
}

export default UserDrawer;
