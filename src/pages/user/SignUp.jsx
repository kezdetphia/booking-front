import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (authToken) {
      navigate("/"); // Redirect to home if logged in
    }
  }, [authToken, navigate]);

  const onFinish = async (values) => {
    console.log(values);
    registerUser(values);
  };

  const registerUser = async (values) => {
    setIsSubmitting(true);
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

      const data = await response.json();

      if (!response.ok) {
        setIsSubmitting(false);
        messageApi.open({
          type: "error",
          content: "Registration was unsuccessful! Please try again!",
        });

        if (response.status === 400) {
          // Display the error message under the appropriate field
          form.setFields([
            {
              name: "email",
              errors: data.message.includes("Email") ? [data.message] : [],
            },
            {
              name: "username",
              errors: data.message.includes("Username") ? [data.message] : [],
            },
            {
              name: "phoneNumber",
              errors: data.message.includes("Phone") ? [data.message] : [],
            },
            {
              name: "password",
              errors: data.message.includes("Password") ? [data.message] : [],
            },
          ]);
        } else {
          console.error("Unhandled error:", data.message);
        }
        return;
      }

      messageApi.open({
        type: "success",
        content: "User registered successfully!",
      });

      // Optionally redirect the user after successful registration
      navigate("/signin");
    } catch (error) {
      setIsSubmitting(false);
      messageApi.open({
        type: "error",
        content: "Error registering user. Please try again later.",
      });
      console.error("Error registering user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex  justify-center shadow-lg pt-10  ">
      <div className="w-full max-w-md p-5 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 font-serif">
          Create Your Account
        </h1>
        <p className="text-center text-gray-500">Join us to get started</p>
        <Form
          scrollToFirstError={true}
          name="signup"
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
                type: "email",
                message: "Please input a valid Email Address!",
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email Address"
              className="px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </Form.Item>

          {/* Username */}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Choose a username",
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              className="px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Phone Number is required!",
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Phone Number"
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
              {
                min: 6,
                message: "Password must be at least 6 characters.",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </Form.Item>

          {/* Password Repeat */}
          <Form.Item
            name="passwordRepeat"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your Password again!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Repeat Password"
              className="px-4 py-2 text-lg border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="w-full px-4 py-2 text-lg font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              loading={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <div className="flex justify-center pt-4">
              <p className="font-serif text-gray-500">
                Already have an account?&nbsp;
              </p>
              <a href="/signin">
                <p className="text-blue-500 font-semibold font-serif hover:underline">
                  Log in!
                </p>
              </a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
