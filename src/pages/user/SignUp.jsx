import React, { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Space } from "antd";
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

      console.log("User registered successfully:", data);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="flex justify-center font-serif font-semibold text-xl">
        Sign Up
      </h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
        {contextHolder}
        <Form
          scrollToFirstError={true}
          form={form}
          name="signup"
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
                type: "email",
                message: "Please input a valid Email Address!",
              },
            ]}
            hasFeedback
          >
            <Input prefix={<UserOutlined />} placeholder="Email Address" />
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
            <Input prefix={<UserOutlined />} placeholder="Username" />
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
            <Input prefix={<UserOutlined />} placeholder="Phone Number" />
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
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
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
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Repeat Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <div className="flex justify-center pt-4">
              <p className="font-serif">Already have an account?&nbsp;</p>
              <a href="/signin">
                <p className="text-blue-500 font-semibold font-serif">
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
