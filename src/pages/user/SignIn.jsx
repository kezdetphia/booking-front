import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (authToken) {
      navigate("/"); // Redirect to home if logged in
    }
  }, [authToken, navigate]);

  const onFinish = async (values) => {
    console.log(values);
    loginUser(values);
  };

  const loginUser = async (values) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          // Display a generic error message
          messageApi.open({
            type: "error",
            content: "Username or password is incorrect.",
          });
        } else {
          console.error("Unhandled error:", data.message);
        }
        return;
      }

      localStorage.setItem("authToken", data.token);
      // await setUserInfo(data.userData);
      setUser(data.userData);
      messageApi.open({
        type: "success",
        content: "Login successful!",
      });

      navigate("/"); // Redirect to home after successful login
    } catch (error) {
      console.error("Error signing in user:", error);
      messageApi.open({
        type: "error",
        content: "Error signing in. Please try again later.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen ">
      <h1 className="flex justify-center font-semibold font-serif text-xl">
        Sign In
      </h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 ">
        {contextHolder}
        <Form
          form={form}
          name="login"
          initialValues={{
            remember: true,
          }}
          style={{
            maxWidth: 360,
          }}
          onFinish={onFinish}
        >
          {/* Email */}
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

          {/* Password */}
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
              <p className="font-serif">Login</p>
            </Button>
            <div className="flex justify-center pt-4">
              <p className="font-serif">Don't have an account yet? &nbsp; </p>
              <a href="/signup">
                <p className="text-blue-500 font-semibold font-serif">
                  Sign Up!
                </p>
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
