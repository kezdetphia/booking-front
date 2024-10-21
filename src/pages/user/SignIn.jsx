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
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signin`,
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
    <div className="flex  justify-center shadow-lg pt-10 ">
      <div className="w-full max-w-md p-5 space-y-6 bg-white rounded-lg shadow-lg h-[700px]">
        <h1 className="text-3xl font-bold text-center text-gray-800 font-serif">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500">Sign in to your account</p>
        <Form
          name="login"
          initialValues={{
            remember: true,
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
            <Input
              prefix={<UserOutlined />}
              placeholder="Email Address"
              className="px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
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
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="w-full px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <span className="font-serif">Sign In</span>
            </Button>
          </Form.Item>

          <div className="flex justify-center pt-4">
            <p className="font-serif text-gray-500">
              Don't have an account? &nbsp;
            </p>
            <a href="/signup">
              <p className="text-blue-500 font-semibold font-serif hover:underline">
                Sign Up
              </p>
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
