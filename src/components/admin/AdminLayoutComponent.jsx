// // src/components/admin/AdminLayoutComponent.jsx
// import React, { useEffect, useState } from "react";
// import { Layout, Menu, Button, Drawer, Dropdown, theme } from "antd";
// import { Link, useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import { EllipsisOutlined } from "@ant-design/icons";
// import Admin from "../../pages/admin/Admin";
// import { useAppointmentContext } from "../../context/AppointmentContext";
// import { useAuth } from "../../context/authContext";

// const { Header, Content } = Layout;

// // Generate menu items for "Today", "Tomorrow", and the next 13 days
// const dateItems = Array.from({ length: 15 }, (_, index) => {
//   const date = dayjs().add(index, "day");

//   let label;
//   if (index === 0) {
//     label = "Today";
//   } else if (index === 1) {
//     label = "Tomorrow";
//   } else {
//     label = date.format("ddd, MMM D");
//   }

//   return {
//     key: index + 1,
//     label: label,
//     date: date.format("YYYY/MM/DD"), // Store date in the desired format
//   };
// });

// const AdminLayoutComponent = () => {
//   const { appointments } = useAppointmentContext();
//   const { setUser } = useAuth();
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");
//   const todayDate = `${year}/${month}/${day}`;

//   const [appointmentDate, setAppointmentDate] = useState(todayDate);
//   const [open, setOpen] = useState(false);
//   const [componentToRender, setComponentToRender] = useState("Appointments");
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     setUser(null);
//     navigate("/signin");
//   };

//   useEffect(() => {
//     if (componentToRender === "Home") {
//       navigate("/");
//     }
//   }, [componentToRender]);

//   useEffect(() => {
//     setOpen(false);
//   }, [componentToRender]);

//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   const handleMenuClick = (e) => {
//     const selectedItem = dateItems.find((item) => item.key === parseInt(e.key));
//     if (selectedItem) {
//       const selectedDate = selectedItem.date;
//       setAppointmentDate(selectedDate);
//     }
//   };

//   const showDrawer = () => {
//     setOpen(true);
//   };

//   const onClose = () => {
//     setOpen(false);
//   };

//   // Separate "Today" and "Tomorrow" from the rest
//   const todayAndTomorrow = dateItems.slice(0, 2);
//   const otherDays = dateItems.slice(2);

//   // Dropdown menu for other days
//   const otherDaysMenu = (
//     <Menu
//       items={otherDays.map((day) => ({
//         key: day.key,
//         label: day.label,
//         onClick: handleMenuClick,
//       }))}
//     />
//   );

//   const sections = () => {
//     const links = [
//       "Home",
//       "Appointments",
//       "Users",
//       "All Appointments",
//       "Taking a day off",
//     ];

//     return (
//       <>
//         {links.map((link, index) => (
//           <div key={index}>
//             <Link to="#" onClick={() => setComponentToRender(link)}>
//               <p
//                 className="cursor-pointer font-serif font-semibold"
//                 style={{
//                   color: componentToRender === link ? "#fff" : "#000",
//                   backgroundColor:
//                     componentToRender === link ? "#1890ff" : "transparent",
//                   padding: "0 10px",
//                   borderRadius: "4px",
//                 }}
//               >
//                 {link}
//               </p>
//             </Link>
//           </div>
//         ))}
//       </>
//     );
//   };

//   return (
//     <Layout>
//       <Header
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             overflow: "hidden",
//           }}
//         >
//           {componentToRender === "Appointments" && (
//             <div style={{ display: "flex", gap: "10px" }}>
//               {/* Render "Today" and "Tomorrow" as text links */}
//               {todayAndTomorrow.map((item) => (
//                 <p
//                   key={item.key}
//                   className="cursor-pointer"
//                   onClick={() => handleMenuClick({ key: item.key })}
//                   style={{
//                     margin: 0,
//                     color: "#fff",
//                     padding: "0 10px",
//                     borderRadius: "4px",
//                     backgroundColor:
//                       appointmentDate === item.date ? "#1890ff" : "transparent",
//                   }}
//                 >
//                   {item.label}
//                 </p>
//               ))}

//               {/* Dropdown for other days */}
//               <Dropdown overlay={otherDaysMenu} trigger={["click"]}>
//                 <p
//                   className="cursor-pointer"
//                   style={{
//                     margin: 0,
//                     color: "#fff",
//                     padding: "0 10px",
//                     borderRadius: "4px",
//                     backgroundColor: "#001529",
//                   }}
//                 >
//                   <EllipsisOutlined />
//                 </p>
//               </Dropdown>
//             </div>
//           )}
//         </div>
//         <Button type="primary" onClick={showDrawer}>
//           ☰
//         </Button>
//       </Header>
//       <Content
//         style={{
//           padding: "0 0px",
//         }}
//       >
//         <div
//           style={{
//             background: colorBgContainer,
//             minHeight: 280,
//             padding: 24,
//             borderRadius: borderRadiusLG,
//           }}
//         >
//           <Admin
//             appointmentDate={appointmentDate}
//             componentToRender={componentToRender}
//           />
//         </div>
//       </Content>
//       {/* Its always needed in admin layout */}
//       <Drawer
//         width={300}
//         title={<p className="text-xl font-semibold font-serif">Admin Menu</p>}
//         onClose={onClose}
//         open={open}
//       >
//         <div className="flex flex-col justify-between h-full">
//           <div className="flex flex-col gap-3 ">{sections()}</div>
//           <Button type="primary" onClick={handleLogout}>
//             <p className="font-serif ">Logout</p>
//           </Button>
//         </div>
//       </Drawer>
//     </Layout>
//   );
// };

// export default AdminLayoutComponent;

// src/components/admin/AdminLayoutComponent.jsx
import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Dropdown } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { EllipsisOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../../context/authContext";
import AdminDailyAppointments from "../../pages/admin/AdminDailyAppointments";

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
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateItems[0].date); // Default to "Today"

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/signin");
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleMenuClick = (key) => {
    const selectedItem = dateItems.find((item) => item.key === key);
    if (selectedItem) {
      setSelectedDate(selectedItem.date);
    }
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
        onClick: () => handleMenuClick(day.key),
      }))}
    />
  );

  const sections = [
    { name: "Home", path: "/" },
    { name: "Daily Appointments", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "All Appointments", path: "/admin/all-appointments" },
    { name: "Taking a Day Off", path: "/admin/day-off" },
  ];

  return (
    <Layout>
      <Header
        style={{
          position: "fixed", // Fix the header at the top
          zIndex: 1, // Ensure it stays above other content
          width: "100%", // Full width
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#001529", // Ensure background color is set
          padding: "0 10px",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          {location.pathname === "/admin" && (
            <div style={{ display: "flex", gap: "5px" }}>
              {/* Render "Today" and "Tomorrow" as text links */}
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
      <Content style={{ padding: "15px 24px 0", marginTop: 64 }}>
        {/* <Outlet />
        {location.pathname === "/admin" ? (
          <AdminDailyAppointments selectedDate={selectedDate} />
        ) : (
          )} */}
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
              <Link key={index} to={section.path}>
                <p className="font-serif font-semibold">{section.name}</p>
              </Link>
            ))}
          </div>
          <Button type="primary" onClick={handleLogout}>
            <p className="font-serif ">Logout</p>
          </Button>
        </div>
      </Drawer>
    </Layout>
  );
};

export default AdminLayoutComponent;
