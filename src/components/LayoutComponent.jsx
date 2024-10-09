import React, { useState } from "react";
import { Button, Drawer, Layout, Menu, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { UserOutlined } from "@ant-design/icons";
import UserDrawer from "./userDrawer";

const { Header, Content, Footer } = Layout;

const LayoutComponent = ({ children }) => {
  const { user, setUser } = useAuth();
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  const showDrawer = () => {
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/signin");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Function to close all drawers
  const closeAllDrawers = () => {
    setDrawerOpen(false);
    setChildrenDrawer(false);
  };

  const links = [
    {
      key: "Home",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "Book",
      label: (
        <Link to="/book" onClick={closeAllDrawers}>
          Book
        </Link>
      ),
    },
    {
      key: "Contact",
      label: <Link to="/contact">Contact</Link>,
    },
    ...(!authToken
      ? [
          {
            key: "Sign Up",
            label: <Link to="/signup">SignUp</Link>,
          },
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
        <div className="demo-logo" />
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
        <Button
          type="text"
          icon={<UserOutlined />}
          onClick={toggleDrawer}
          style={{ color: "white" }}
        />
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
      <Drawer
        title="Menu"
        width={200}
        closable={false}
        onClose={onClose}
        open={drawerOpen}
      >
        <h1
          className="cursor-pointer"
          onClick={() => {
            showChildrenDrawer();
            setSelectedContent("Profile");
          }}
        >
          My Profile
        </h1>
        <h1
          className={"cursor-pointer"}
          onClick={() => {
            showChildrenDrawer();
            setSelectedContent("Appointments");
          }}
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
          <UserDrawer
            selectedContent={selectedContent}
            closeAllDrawers={closeAllDrawers}
          />
        </Drawer>
      </Drawer>
    </Layout>
  );
};

export default LayoutComponent;
