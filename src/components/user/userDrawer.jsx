import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import { Button, Divider, Drawer, Avatar, List } from "antd";

function UserDrawer({ drawerOpen, onClose, handleLogout }) {
  const { user } = useAuth();
  const [userAppointments, setUserAppointments] = useState([]);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const userId = user?._id;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const getUserAppointments = async () => {
      if (!authToken || !userId) return;

      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuserappointments/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUserAppointments(data?.appointments);
        }
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    if (authToken && userId) {
      getUserAppointments();
    }
  }, [drawerOpen]);

  const categorizeAppointments = (userAppointments) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const past = [];
    const todayAppointments = [];
    const future = [];

    userAppointments.forEach((appointment) => {
      const appointmentDateTime = new Date(
        `${appointment.date}T${appointment.time}`
      );
      const appointmentDate = new Date(appointment.date);

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
    categorizeAppointments(userAppointments);

  const personalData = [user?.username, user?.email];

  const showChildrenDrawer = (content) => {
    setSelectedContent(content);
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const handleParentDrawerClick = (e) => {
    // Close parent drawer if not clicking on a link, child drawer content, or child drawer trigger
    if (
      !e.target.closest("a") &&
      !e.target.closest(".child-drawer-content") &&
      !e.target.closest(".child-drawer-trigger")
    ) {
      onClose();
    }
  };

  const handleChildDrawerClick = (e) => {
    // Only close child drawer if clicked outside child drawer content
    if (!e.target.closest(".child-drawer-content")) {
      onChildrenDrawerClose();
    }
  };

  return (
    <Drawer
      title={<p className="font-semibold font-serif text-xl">Menu</p>}
      width={200}
      closable={false}
      onClose={onClose}
      open={drawerOpen}
      onClick={handleParentDrawerClick} // Detect clicks on the parent drawer
    >
      <div className="drawer-content flex flex-col h-full justify-between">
        <div className="flex flex-col gap-1">
          <h1
            className="cursor-pointer font-semibold font-serif child-drawer-trigger"
            onClick={() => showChildrenDrawer("Profile")}
          >
            My Profile
          </h1>
          <h1
            className="cursor-pointer font-semibold font-serif child-drawer-trigger"
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
        onClick={handleChildDrawerClick} // Detect clicks inside the child drawer
      >
        <div className="child-drawer-content">
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
                      <p className="font-serif">
                        {appointment?.date} {appointment?.time}
                      </p>
                      <p className="font-serif">{appointment?.desc}</p>
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
                      <p className="font-serif">
                        {appointment?.date} {appointment?.time}
                      </p>
                      <p className="font-serif">{appointment?.desc}</p>
                      <Divider />
                    </div>
                  ))}
                </>
              ) : (
                <div>
                  <p className="text-center text-lg font-serif">
                    No future appointments.
                  </p>
                  <div className="flex justify-center pt-5">
                    <Link to="/book" onClick={onChildrenDrawerClose}>
                      <Button size="medium" type="primary">
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
        </div>
      </Drawer>
    </Drawer>
  );
}

export default UserDrawer;
