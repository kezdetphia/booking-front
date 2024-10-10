import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, theme } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Admin from "../../pages/admin/Admin";
import { useAppointmentContext } from "../../context/AppointmentContext";
const { Header, Content } = Layout;

const items = Array.from({ length: 15 }, (_, index) => {
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
  // const { appointments } = useAppointmentContext();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${year}/${month}/${day}`;

  const [appointmentDate, setAppointmentDate] = useState(todayDate);
  const [open, setOpen] = useState(false);
  const [componentToRender, setComponentToRender] = useState("Appointments");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === parseInt(e.key));
    if (selectedItem) {
      const selectedDate = selectedItem.date;
      setAppointmentDate(selectedDate);

      console.log(`Date: ${selectedDate}`); // Print the date in "YYYY/MM/DD" format
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const sections = () => {
    const links = ["Appointments", "All Appointments", "Users"];
    return (
      <>
        <Link to="/home">Home</Link>
        {links.map((link, index) => (
          <div key={index}>
            <Link to="#" onClick={() => setComponentToRender(link)}>
              {link}
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
          justifyContent: "space-between", // Align items to the ends
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={handleMenuClick}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
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
          {/* <AdminAppointments appointmentDate={appointmentDate} /> */}
          <Admin
            appointmentDate={appointmentDate}
            componentToRender={componentToRender}
          />
        </div>
      </Content>
      <Drawer width={300} title="Admin Menu" onClose={onClose} open={open}>
        {sections()}
      </Drawer>
    </Layout>
  );
};

export default AdminLayoutComponent;
