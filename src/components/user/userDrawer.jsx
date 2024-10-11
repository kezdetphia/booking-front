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
      title={<p className="font-semibold font-serif text-xl">Menu</p>}
      width={200}
      closable={false}
      onClose={onClose}
      open={drawerOpen}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-1">
          <h1
            className="cursor-pointer font-semibold font-serif"
            onClick={() => showChildrenDrawer("Profile")}
          >
            My Profile
          </h1>
          <h1
            className="cursor-pointer font-semibold font-serif"
            onClick={() => showChildrenDrawer("Appointments")}
          >
            My Appointments
          </h1>
        </div>

        <div className="flex justify-center ">
          <Button type="primary" onClick={handleLogout} size="medium">
            <p className="font-serif">Logout</p>
          </Button>
        </div>
      </div>

      <Drawer
        title={
          <p className="font-semibold font-serif text-xl">{selectedContent}</p>
        }
        width={320}
        closable={false}
        onClose={onChildrenDrawerClose}
        open={childrenDrawer}
      >
        {selectedContent === "Appointments" ? (
          <div>
            {todayAppointments.length > 0 && (
              <>
                <Divider orientation="left" orientationMargin="0">
                  <p className="font-semibold font-serif ">
                    Today's Appointments
                  </p>
                </Divider>
                {todayAppointments.map((appointment, index) => (
                  <div className="flex flex-col" key={`today-${index}`}>
                    <div>
                      <p className="font-serif">
                        {appointment?.date} {appointment?.time}
                      </p>
                    </div>
                    <div>
                      <p className="font-serif">{appointment?.desc}</p>
                    </div>
                    <Divider />
                  </div>
                ))}
              </>
            )}
            {future.length > 0 ? (
              <>
                <Divider orientation="left" orientationMargin="0">
                  <p className="font-semibold font-serif ">
                    Future Appointments
                  </p>
                </Divider>
                {future.map((appointment, index) => (
                  <div className="flex flex-col" key={`future-${index}`}>
                    <div>
                      <p className="font-serif">
                        {appointment?.date} {appointment?.time}
                      </p>
                    </div>
                    <div>
                      <p className="font-serif">{appointment?.desc}</p>
                    </div>
                    <Divider />
                  </div>
                ))}
              </>
            ) : (
              <div>
                <p className="text-center text-xl font-semibold font-serif">
                  No future appointments.
                </p>
                <div className="flex justify-center pt-5">
                  <Link to="/book" onClick={onChildrenDrawerClose}>
                    <Button size="large" type="primary">
                      <p className="font-serif">
                        Book your next appointment now!
                      </p>
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : selectedContent === "Profile" ? (
          <>
            <Divider orientation="center">
              <Avatar
                style={{
                  backgroundColor: "#ffcccb",
                }}
              >
                <p className="font-serif">
                  {user?.username?.charAt(0).toUpperCase()}
                </p>
              </Avatar>
            </Divider>
            <List
              header={
                <div>
                  <p className="font-semibold font-serif">Personal Details</p>
                </div>
              }
              footer={
                <div className="flex justify-center">
                  <Link to="/book">
                    <Button onClick={onChildrenDrawerClose} type="primary">
                      <p className="font-serif">Book an appointment</p>
                    </Button>
                  </Link>
                </div>
              }
              bordered
              dataSource={personalData}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <p className="font-serif">{item}</p>
                </List.Item>
              )}
            />
          </>
        ) : (
          <h1 className="font-serif">DEFAULT CONTENT</h1>
        )}
      </Drawer>
    </Drawer>
  );
}

export default UserDrawer;
