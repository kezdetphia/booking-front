// src/pages/user/Book.jsx
import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/hu"; // Import Hungarian locale for dayjs
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"; // Import the plugin
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"; // Import the plugin
import {
  Calendar,
  Col,
  Radio,
  Row,
  Select,
  theme,
  Typography,
  ConfigProvider,
  message,
} from "antd";
import huHU from "antd/es/locale/hu_HU"; // Import Hungarian locale for Ant Design
import dayLocaleData from "dayjs/plugin/localeData";
import AppointmentModal from "../../components/user/AppointmentModal";
import { useAuth } from "../../context/authContext";
import { useAppointmentContext } from "../../context/AppointmentContext";
import { useAppointmentDateContext } from "../../context/appointmentDateContext";

dayjs.extend(dayLocaleData);
dayjs.extend(isSameOrAfter); // Extend dayjs with the plugin
dayjs.extend(isSameOrBefore); // Extend dayjs with the plugin

const Book = () => {
  const { user } = useAuth();
  const { postAppointment, appointments, disabledDates } =
    useAppointmentContext();
  const [modalOpen, setModalOpen] = useState(false);
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const { selectedDate, setSelectedDate, selectedTime } =
    useAppointmentDateContext();

  const currentYear = dayjs().year(); // Get the current year
  const currentMonth = dayjs().month(); // Get the current month (0-indexed)

  console.log("user in book page", user);

  const disabledDate = (current) => {
    if (!current) return false;

    // Disable days before today
    if (current < dayjs().startOf("day")) {
      return true;
    }

    // Disable dates from the disabledDates array
    const currentDateStr = current.format("YYYY/MM/DD");
    for (const disabled of disabledDates) {
      if (disabled.date.length === 2) {
        const [start, end] = disabled.date;
        if (
          dayjs(currentDateStr).isSameOrAfter(dayjs(start)) &&
          dayjs(currentDateStr).isSameOrBefore(dayjs(end))
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const onClickonWeekends = (value) => {
    const dayOfWeek = value.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setSelectedDate(value.format("YYYY/MM/DD"));
      messageApi.info(
        `Weekends are not available for booking!😔 Please give me a call in advance to book! 🥰`
      );
      return;
    }

    // Only open the modal if a specific date is selected
    if (value.isSameOrAfter(dayjs(), "day")) {
      setSelectedDate(value.format("YYYY/MM/DD"));
      setModalOpen(true);
    }
  };

  const onPanelChange = (value, mode) => {
    // Handle panel change without opening the modal
    console.log("Panel changed:", value.format("YYYY-MM-DD"), mode);
  };

  const submitAppointment = async () => {
    //context function
    await postAppointment({
      userId: user?._id,
      username: user?.username,
      email: user?.email,
      desc: "Appointment description",
      date: selectedDate,
      time: selectedTime,
      length: "1 hour",
      booked: true,
    });
  };

  const wrapperStyle = {
    display: "flex", // Add flex display
    justifyContent: "center", // Center horizontally
    width: "100%", // Full width to allow centering
    padding: "20px 0", // Optional padding for aesthetics
  };

  const calendarStyle = {
    width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  return (
    <ConfigProvider locale={huHU}>
      {contextHolder}
      <div style={wrapperStyle}>
        <div style={calendarStyle}>
          <AppointmentModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            appointments={appointments}
            submitAppointment={submitAppointment}
          />
          <Calendar
            fullscreen={false}
            onSelect={onClickonWeekends}
            disabledDate={disabledDate} // Disable past dates and specified ranges
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const monthOptions = [];
              const localeData = value.localeData();
              const months = localeData.months(); // Get full month names

              for (let i = currentMonth; i < 12; i++) {
                monthOptions.push(
                  <Select.Option key={i} value={i} className="month-item">
                    {months[i]}
                  </Select.Option>
                );
              }

              const year = currentYear;
              const month = value.month();
              const options = [];
              for (let i = year; i <= year + (month === 10 ? 1 : 0); i += 1) {
                options.push(
                  <Select.Option key={i} value={i} className="year-item">
                    {i}
                  </Select.Option>
                );
              }

              return (
                <div
                  style={{
                    padding: 8,
                  }}
                >
                  <Typography.Title level={4}>
                    {selectedDate ? (
                      `${selectedDate} ${selectedTime}`
                    ) : (
                      <p className="text-xl font-semibold font-serif">
                        Book an Appointment
                      </p>
                    )}
                  </Typography.Title>
                  <Row gutter={8}>
                    <Col>
                      <Radio.Group
                        size="small"
                        onChange={(e) => onTypeChange(e.target.value)}
                        value={type}
                      >
                        <Radio.Button value="month">
                          <p className="font-serif">Month</p>
                        </Radio.Button>
                        <Radio.Button value="year">
                          <p className="font-serif">Year</p>
                        </Radio.Button>
                      </Radio.Group>
                    </Col>
                    <Col>
                      <Select
                        size="small"
                        popupMatchSelectWidth={false}
                        className="my-year-select"
                        value={year}
                        onChange={(newYear) => {
                          const now = value.clone().year(newYear);
                          onChange(now);
                        }}
                      >
                        {options}
                      </Select>
                    </Col>
                    <Col>
                      <Select
                        size="small"
                        popupMatchSelectWidth={false}
                        value={month}
                        onChange={(newMonth) => {
                          const now = value.clone().month(newMonth);
                          onChange(now);
                        }}
                      >
                        {monthOptions}
                      </Select>
                    </Col>
                  </Row>
                </div>
              );
            }}
            onPanelChange={onPanelChange}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Book;
