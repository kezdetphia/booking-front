// src/pages/admin/OnHoliday.jsx
import React from "react";
import { Button, DatePicker, Form, Input, Card, Space, message } from "antd";
import dayjs from "dayjs"; // Import dayjs for date formatting
import { useAppointmentContext } from "../../context/AppointmentContext";

const OnHoliday = () => {
  const { disableDates } = useAppointmentContext();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    if (!values.date1 || !values.date2) {
      message.error("Please select both start and end dates.");
      return;
    }
    console.log("Form Values:", values);
    submitDisabledDates(values);
  };

  const submitDisabledDates = async (values) => {
    const formattedDates = [
      dayjs(values.date1).format("YYYY/MM/DD"),
      dayjs(values.date2).format("YYYY/MM/DD"),
    ];

    console.log("Formatted Dates:", formattedDates);

    // Assuming disableDates can handle an array of dates
    await disableDates(formattedDates, values.reason);
  };

  return (
    <div className="flex justify-center items-center  flex-col   ">
      <h1 className="text-2xl font-bold font-serif text-center pt-5 pb-10">
        Take a day off or two
      </h1>
      <Space direction="vertical" size={16}>
        <Card
          title={<p className="font-serif">Block dates</p>}
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
              label={<p className="font-serif">Reason</p>}
              name="reason"
              rules={[{ required: true, message: "Please input the reason!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label={<p className="font-serif">From</p>} name="date1">
              <DatePicker />
            </Form.Item>

            <Form.Item label={<p className="font-serif">Till</p>} name="date2">
              <DatePicker />
            </Form.Item>

            <div className="flex justify-center pt-10">
              <Form.Item>
                <Button size="large" type="primary" htmlType="submit">
                  <p className="font-serif">Submit</p>
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
