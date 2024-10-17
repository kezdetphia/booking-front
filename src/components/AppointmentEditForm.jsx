import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, TimePicker } from "antd";
import dayjs from "dayjs";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};

const AppointmentEditForm = ({ appointment }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});

  const initialValues = {
    appointmentId: appointment?._id,
    Input: appointment?.username,
    TextArea: appointment?.desc,
    length: appointment?.length,
    DatePicker: appointment.date ? dayjs(appointment.date) : null,
    TimePicker: appointment.time ? dayjs(appointment.time, "HH:mm") : null,
  };

  // Set initial form values based on the appointment details
  useEffect(() => {
    if (appointment) {
      form.setFieldsValue(initialValues);
      setFormValues(initialValues);
    }
  }, [appointment, form]);

  const onValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const onFinish = () => {
    // Prepare the data for submission
    const dataToSubmit = {
      appointmentId: initialValues.appointmentId,
      username: appointment?.username,
      desc: formValues.TextArea,
      length: formValues.length,
      date: formValues.DatePicker
        ? formValues.DatePicker.format("YYYY/MM/DD")
        : null,
      time: formValues.TimePicker
        ? formValues.TimePicker.format("HH:mm")
        : null,
    };

    submitEditData(dataToSubmit);
  };

  const submitEditData = async (dataToSubmit) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      console.log("no authtoken in submitEditData ");
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/admineditappointment/${dataToSubmit.appointmentId}`,
        // `http://localhost:3001/api/admin/admineditappointment/${dataToSubmit.appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const data = await res.json();
    } catch (err) {
      console.log("Server error", err);
    }
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      style={{
        maxWidth: 250,
      }}
    >
      <Form.Item
        label="Length"
        name="length"
        rules={[
          {
            required: true,
            message: "Please input!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Desc"
        name="TextArea"
        rules={[
          {
            required: true,
            message: "Please input!",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Date"
        name="DatePicker"
        rules={[
          {
            required: true,
            message: "Please input!",
          },
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Time"
        name="TimePicker"
        rules={[
          {
            required: true,
            message: "Please input!",
          },
        ]}
      >
        <TimePicker />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 6,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          <p className="font-serif">Submit</p>
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AppointmentEditForm;
