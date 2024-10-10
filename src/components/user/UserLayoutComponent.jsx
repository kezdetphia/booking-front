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
      label: <Link to="/">Home</Link>,
    },
    {
      key: "Book",
      label: <Link to="/book">Book</Link>,
    },
    {
      key: "Contact",
      label: <Link to="/contact">Contact</Link>,
    },
    ...(!authToken
      ? [
          {
            key: "Sign In",
            label: <Link to="/signin">SignIn</Link>,
          },
        ]
      : []),
    ...(user && user.isAdmin
      ? [
          {
            key: "Admin",
            label: <Link to="/admin">Admin</Link>,
          },
        ]
      : []),
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
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
      </Header>
      <Content
        style={{
          padding: "0px 0px",
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
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "left",
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
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
