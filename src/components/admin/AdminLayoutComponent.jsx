import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Drawer, Dropdown, theme } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../../context/authContext";
import { useAppointmentDateContext } from "../../context/appointmentDateContext";
import { Footer } from "antd/es/layout/layout";

const { Header, Content } = Layout;

const dateItems = Array.from({ length: 15 }, (_, index) => {
  const date = dayjs().add(index, "day");
  let label =
    index === 0
      ? "Today"
      : index === 1
      ? "Tomorrow"
      : date.format("ddd, MMM D");
  return {
    key: index + 1,
    label,
    date: date.format("YYYY/MM/DD"),
  };
});

const AdminLayoutComponent = () => {
  const { setUser } = useAuth();
  const { selectedDate, setSelectedDate } = useAppointmentDateContext();
  const [open, setOpen] = useState(false);
  const [selectedPageLink, setSelectedPageLink] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    setSelectedDate(dateItems[0].date);
  }, []);

  const handleMenuLinkClick = (sectionName) => {
    setSelectedPageLink(sectionName);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/signin");
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const handleMenuClick = (key) =>
    setSelectedDate(dateItems.find((item) => item.key === key)?.date);

  const todayAndTomorrow = dateItems.slice(0, 2);
  const otherDays = dateItems.slice(2);

  // Rendering otherDays menu items correctly
  const otherDaysMenu = (
    <Menu>
      {otherDays.map((day) => (
        <Menu.Item key={day.key} onClick={() => handleMenuClick(day.key)}>
          {day.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const sections = [
    { name: "Home", path: "/" },
    { name: "Daily Appointments", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "All Appointments", path: "/admin/all-appointments" },
    { name: "Taking a Day Off", path: "/admin/day-off" },
  ];

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#001529",
          padding: "0 10px",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          {location.pathname === "/admin" && (
            <div style={{ display: "flex", gap: "5px" }}>
              {todayAndTomorrow.map((item) => (
                <p
                  key={item.key}
                  className="cursor-pointer"
                  onClick={() => handleMenuClick(item.key)}
                  style={{
                    margin: 0,
                    color: "#fff",
                    padding: "0 10px",
                    borderRadius: "4px",
                    backgroundColor:
                      selectedDate === item.date ? "#1890ff" : "transparent",
                  }}
                >
                  {item.label}
                </p>
              ))}
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
        style={{ padding: "15px 24px 0", marginTop: 64, flex: "1 0 auto" }}
      >
        <Outlet />
      </Content>
      <Drawer
        width={300}
        title={<p className="text-xl font-semibold font-serif">Admin Menu</p>}
        onClose={onClose}
        open={open}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-3 ">
            {sections.map((section, index) => (
              <Link
                key={index}
                to={section.path}
                onClick={() => handleMenuLinkClick(section.name)}
              >
                <p
                  className={`font-serif font-semibold ${
                    selectedPageLink === section.name ? "text-blue-500" : ""
                  }`}
                >
                  {section.name}
                </p>
              </Link>
            ))}
          </div>
          <Button type="primary" onClick={handleLogout}>
            <p className="font-serif">Logout</p>
          </Button>
        </div>
      </Drawer>
      <Footer
        style={{
          textAlign: "center",
          background: colorBgContainer,
          flexShrink: 0,
          marginTop: "20px",
        }}
      >
        <p className="font-serif">
          Whatever Shop©{new Date().getFullYear()} Created by{" "}
          <a href="mailto:fehermark88@gmail.com">Mark Feher</a>
        </p>
      </Footer>
    </Layout>
  );
};

export default AdminLayoutComponent;
