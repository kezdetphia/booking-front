// src/components/admin/AdminLayoutComponent.jsx
import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Drawer, Dropdown, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { EllipsisOutlined } from "@ant-design/icons";
import Admin from "../../pages/admin/Admin";
import { useAppointmentContext } from "../../context/AppointmentContext";
import { useAuth } from "../../context/authContext";

const { Header, Content } = Layout;

// Generate menu items for "Today", "Tomorrow", and the next 13 days
const dateItems = Array.from({ length: 15 }, (_, index) => {
  const date = dayjs().add(index, "day");

  let label;
  if (index === 0) {
    label = "Today";
  } else if (index === 1) {
    label = "Tomorrow";
  } else {
    label = date.format("ddd, MMM D");
  }

  return {
    key: index + 1,
    label: label,
    date: date.format("YYYY/MM/DD"), // Store date in the desired format
  };
});

const AdminLayoutComponent = () => {
  const { appointments } = useAppointmentContext();
  const { setUser } = useAuth();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${year}/${month}/${day}`;

  const [appointmentDate, setAppointmentDate] = useState(todayDate);
  const [open, setOpen] = useState(false);
  const [componentToRender, setComponentToRender] = useState("Appointments");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/signin");
  };

  useEffect(() => {
    if (componentToRender === "Home") {
      navigate("/");
    }
  }, [componentToRender]);

  useEffect(() => {
    setOpen(false);
  }, [componentToRender]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    const selectedItem = dateItems.find((item) => item.key === parseInt(e.key));
    if (selectedItem) {
      const selectedDate = selectedItem.date;
      setAppointmentDate(selectedDate);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // Separate "Today" and "Tomorrow" from the rest
  const todayAndTomorrow = dateItems.slice(0, 2);
  const otherDays = dateItems.slice(2);

  // Dropdown menu for other days
  const otherDaysMenu = (
    <Menu
      items={otherDays.map((day) => ({
        key: day.key,
        label: day.label,
        onClick: handleMenuClick,
      }))}
    />
  );

  const sections = () => {
    const links = [
      "Home",
      "Appointments",
      "Users",
      "All Appointments",
      "Taking a day off",
    ];

    return (
      <>
        {links.map((link, index) => (
          <div key={index}>
            <Link to="#" onClick={() => setComponentToRender(link)}>
              <p
                className="cursor-pointer font-serif font-semibold"
                style={{
                  color: componentToRender === link ? "#fff" : "#000",
                  backgroundColor:
                    componentToRender === link ? "#1890ff" : "transparent",
                  padding: "0 10px",
                  borderRadius: "4px",
                }}
              >
                {link}
              </p>
            </Link>
          </div>
        ))}
      </>
    );
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {componentToRender === "Appointments" && (
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Render "Today" and "Tomorrow" as text links */}
              {todayAndTomorrow.map((item) => (
                <p
                  key={item.key}
                  className="cursor-pointer"
                  onClick={() => handleMenuClick({ key: item.key })}
                  style={{
                    margin: 0,
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "4px",
                    backgroundColor:
                      appointmentDate === item.date ? "#1890ff" : "transparent",
                  }}
                >
                  {item.label}
                </p>
              ))}

              {/* Dropdown for other days */}
              <Dropdown overlay={otherDaysMenu} trigger={["click"]}>
                <p
                  className="cursor-pointer"
                  style={{
                    margin: 0,
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "4px",
                    backgroundColor: "#001529",
                  }}
                >
                  <EllipsisOutlined />
                </p>
              </Dropdown>
            </div>
          )}
        </div>
        <Button type="primary" onClick={showDrawer}>
          ☰
        </Button>
      </Header>
      <Content
        style={{
          padding: "0 0px",
        }}
      >
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Admin
            appointmentDate={appointmentDate}
            componentToRender={componentToRender}
          />
        </div>
      </Content>
      <Drawer
        width={300}
        title={<p className="text-xl font-semibold font-serif">Admin Menu</p>}
        onClose={onClose}
        open={open}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-3 ">{sections()}</div>
          <Button type="primary" onClick={handleLogout}>
            <p className="font-serif ">Logout</p>
          </Button>
        </div>
      </Drawer>
    </Layout>
  );
};

export default AdminLayoutComponent;
