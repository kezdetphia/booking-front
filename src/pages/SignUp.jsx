import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (authToken) {
      navigate("/"); // Redirect to home if logged in
    }
  }, [authToken, navigate]);

  const onFinish = async (values) => {
    console.log(values);
    registerUser(values);
  };
  //
  const registerUser = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("User registered successfully:", data);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="flex justify-center">Sign Up</h1>
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
                required: false,
                message: "Please input your Email Address!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email Address" />
          </Form.Item>
          {/* //username */}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          {/* //phone number */}
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,

                message: "Please input your Phone Number!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Phone Number" />
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
          <Form.Item
            name="passwordRepeat"
            rules={[
              {
                required: true,
                message: "Please input your Password again!",
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
              Register
            </Button>
            or <a href="/signin">Log in!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default SignUp;
