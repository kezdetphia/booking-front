import React from "react";
import { Layout, Menu, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Import the useAuth hook

const { Header, Content, Footer } = Layout;

const LayoutComponent = ({ children }) => {
  const { user, setUser } = useAuth(); // Access the user and setUser from context
  const authToken = localStorage.getItem("authToken"); // Check for authToken
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the authToken
    setUser(null); // Clear user context
    navigate("/signin"); // Redirect to sign-in page
  };

  // Define the links, including the admin link conditionally
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
    // Conditionally add the sign-up link if no authToken
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
    // Conditionally add the admin link
    ...(user && user.isAdmin
      ? [
          {
            key: "Admin",
            label: <Link to="/admin">Admin</Link>,
          },
        ]
      : []),
    // Conditionally add the logout link
    ...(authToken
      ? [
          {
            key: "Logout",
            label: (
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            ),
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
    </Layout>
  );
};

export default LayoutComponent;
