// src/pages/admin/OnHoliday.jsx
import React from "react";
import { Button, DatePicker, Form, Input, Card, Space, message } from "antd";
import dayjs from "dayjs"; // Import dayjs for date formatting
import { useAppointmentContext } from "../../context/AppointmentContext";
const { RangePicker } = DatePicker;

const OnHoliday = () => {
  const { disableDates } = useAppointmentContext();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    if (!values.date && (!values.range || values.range.length === 0)) {
      message.error("Please select at least one date or date range.");
      return;
    }
    console.log("Form Values:", values);
    submitDisabledDates(values);
  };

  const submitDisabledDates = async (values) => {
    const formattedDate = values.date
      ? dayjs(values.date).format("YYYY/MM/DD")
      : null;
    const formattedRange = values.range
      ? values.range.map((date) => dayjs(date).format("YYYY/MM/DD"))
      : null;

    console.log("Formatted Date:", formattedDate);
    console.log("Formatted Range:", formattedRange);

    // Assuming disableDates can handle both single date and range
    await disableDates(formattedDate || formattedRange, values.reason);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Space direction="vertical" size={16}>
        <Card
          title="Block dates"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            layout="horizontal"
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: true, message: "Please input the reason!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Date" name="date">
              <DatePicker />
            </Form.Item>

            <Form.Item label="Range" name="range">
              <RangePicker />
            </Form.Item>

            <div className="flex justify-center">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default OnHoliday;
