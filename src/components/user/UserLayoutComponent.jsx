import React, { useState } from "react";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { UserOutlined, CrownOutlined } from "@ant-design/icons";
import UserDrawer from "./userDrawer";

const { Header, Content, Footer } = Layout;

const UserLayoutComponent = () => {
  const { user, setUser } = useAuth();
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setDrawerOpen(false);
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
    !authToken && {
      key: "Sign In",
      label: (
        <Link to="/signin">
          {" "}
          <p className="font-serif">SignIn</p>
        </Link>
      ),
    },
  ].filter(Boolean);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={links}
          style={{ flex: 1, minWidth: 0 }}
        />
        {authToken && (
          <Button
            type="text"
            icon={user?.isAdmin ? <CrownOutlined /> : <UserOutlined />}
            onClick={() => {
              user?.isAdmin ? navigate("/admin") : setDrawerOpen(true);
            }}
            style={{ color: "white" }}
          />
        )}
      </Header>
      <Content style={{ flex: "1 0 auto", padding: "0px 0px" }}>
        <div
          style={{
            background: "#f7f7f7",
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: colorBgContainer,
          flexShrink: 0,
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
