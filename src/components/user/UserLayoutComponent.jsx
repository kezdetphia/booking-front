// src/components/user/UserLayoutComponent.jsx
import React, { useState } from "react";
import { Button, Layout, Menu, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { UserOutlined } from "@ant-design/icons";
import UserDrawer from "./userDrawer";

const { Header, Content, Footer } = Layout;

const UserLayoutComponent = ({ children }) => {
  const { user, setUser } = useAuth();
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/signin");
  };

  const links = [
    {
      key: "Home",
      label: (
        <Link to="/">
          {" "}
          <p className="font-serif">Home</p>
        </Link>
      ),
    },
    {
      key: "Book",
      label: (
        <Link to="/book">
          {" "}
          <p className="font-serif">Book</p>
        </Link>
      ),
    },
    // {
    //   key: "Contact",
    //   label: (
    //     <Link to="/contact">
    //       {" "}
    //       <p className="font-serif">Contact</p>
    //     </Link>
    //   ),
    // },
    ...(!authToken
      ? [
          {
            key: "Sign In",
            label: (
              <Link to="/signin">
                {" "}
                <p className="font-serif">SignIn</p>
              </Link>
            ),
          },
        ]
      : []),
    ...(user && user.isAdmin
      ? [
          {
            key: "Admin",
            label: (
              <Link to="/admin">
                {" "}
                <p className="font-serif">Admin</p>
              </Link>
            ),
          },
        ]
      : []),
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      {/* <Layout className="min-h-screen bg-gray-100"> */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* <div className="demo-logo" /> */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={links}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        {authToken && (
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => setDrawerOpen(true)}
            style={{ color: "white" }}
          />
        )}
        {/* conditionally render the profile icon if admin goes to admin page if user uses their own */}
        {/* {authToken && (
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => {
              if (user && user.isAdmin) {
                navigate("/admin"); // Navigate to admin page if user is admin
              } else {
                setDrawerOpen(true); // Open drawer if user is not admin
              }
            }}
            style={{ color: "white" }}
          />
        )} */}
      </Header>
      <Content
        style={{
          padding: "0px 0px",
        }}
      >
        <div
          style={{
            background: "#FDFDFE",
            // background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: colorBgContainer,
        }}
      >
        <p className="font-serif">
          Whatever Shop©{new Date().getFullYear()} Created by{" "}
          <a href="mailto:fehermark88@gmail.com">Mark Feher</a>
        </p>
      </Footer>
      <UserDrawer
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        handleLogout={handleLogout}
      />
    </Layout>
  );
};

export default UserLayoutComponent;
