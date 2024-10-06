import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { setUserInfo } = useAuth();
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  const onFinish = async (values) => {
    console.log(values);
    LoginUser(values);
  };

  //Redirect to home if logged in
  useEffect(() => {
    if (authToken) {
      navigate("/"); // Redirect to home if logged in
    }
  }, [authToken, navigate]);
  const LoginUser = async (values) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        throw new Error("Network res was not ok", Error);
      }

      if (res.status === 200) {
        const data = await res.json();
        console.log("User signed in successfully:", data);
        localStorage.setItem("authToken", data.token);
        await setUserInfo(data.userData);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="flex justify-center">Sign In</h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
        <Form
          name="login"
          initialValues={{
            remember: true,
          }}
          style={{
            maxWidth: 360,
          }}
          onFinish={onFinish}
        >
          {/* //email */}
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email Address!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email Address" />
          </Form.Item>

          {/* //password */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Login
            </Button>
            or <a href="/signup">Sign Up!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default SignIn;
