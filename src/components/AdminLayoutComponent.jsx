import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import dayjs from "dayjs";
import Admin from "../pages/Admin";
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
  const [appointmentDate, setAppointmentDate] = useState([]);

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

  console.log("appointmentDate", appointmentDate);

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
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
      </Header>
      <Content
        style={{
          padding: "0 48px",
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
          <Admin appointmentDate={appointmentDate} />
        </div>
      </Content>
    </Layout>
  );
};

export default AdminLayoutComponent;
