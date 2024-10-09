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

  // Set initial form values based on the appointment details
  useEffect(() => {
    if (appointment) {
      const initialValues = {
        appointmentId: appointment?._id,
        Input: appointment.username,
        TextArea: appointment.desc,
        DatePicker: appointment.date ? dayjs(appointment.date) : null,
        TimePicker: appointment.time ? dayjs(appointment.time, "HH:mm") : null,
      };
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
      appointmentId: formValues.appointmentId,
      username: formValues.Input,
      desc: formValues.TextArea,
      date: formValues.DatePicker
        ? formValues.DatePicker.format("YYYY/MM/DD")
        : null,
      time: formValues.TimePicker
        ? formValues.TimePicker.format("HH:mm")
        : null,
    };

    submitEditData(dataToSubmit);
    console.log("Data to submit", dataToSubmit);
  };

  const submitEditData = async (dataToSubmit) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/admin/admineditappointment/${dataToSubmit.appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const data = await res.json();

      console.log(data);
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
        maxWidth: 600,
      }}
    >
      <Form.Item label="ID" name="appointmentId">
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="Input"
        name="Input"
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
        label="TextArea"
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
        label="DatePicker"
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
        label="TimePicker"
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
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AppointmentEditForm;
