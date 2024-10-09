import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/hu"; // Import Hungarian locale for dayjs
import {
  Calendar,
  Col,
  Radio,
  Row,
  Select,
  theme,
  Typography,
  ConfigProvider,
  Button,
} from "antd";
import huHU from "antd/es/locale/hu_HU"; // Import Hungarian locale for Ant Design
import dayLocaleData from "dayjs/plugin/localeData";
import AppointmentModal from "../components/AppointmentModal";
import { useAuth } from "../context/authContext";
import { useAppointments } from "../context/AppointmentContext";
dayjs.extend(dayLocaleData);
// dayjs.locale("hu"); // Set dayjs to use Hungarian locale

const Book = () => {
  const { user } = useAuth();
  const { appointments, addAppointment } = useAppointments();
  const [modalOpen, setModalOpen] = useState(false);
  const { token } = theme.useToken();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const currentYear = dayjs().year(); // Get the current year

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const onDateSelect = (value) => {
    setSelectedDate(value.format("YYYY/MM/DD"));
    setModalOpen(true);
  };

  const onPanelChange = (value, mode) => {
    console.log("Panel changed:", value.format("YYYY-MM-DD"), mode);
  };

  const submitAppointment = async () => {
    //context function
    await addAppointment({
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
      <div style={wrapperStyle}>
        <div style={calendarStyle}>
          <AppointmentModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            setSelectedTime={setSelectedTime}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            appointments={appointments}
          />
          <Calendar
            fullscreen={false}
            onSelect={onDateSelect}
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const start = 0;
              const end = 12;
              const monthOptions = [];
              let current = value.clone();
              const localeData = value.localeData();
              const months = [];
              for (let i = 0; i < 12; i++) {
                current = current.month(i);
                months.push(localeData.monthsShort(current));
              }
              for (let i = start; i < end; i++) {
                monthOptions.push(
                  <Select.Option key={i} value={i} className="month-item">
                    {months[i + 1]}
                  </Select.Option>
                );
              }
              const year = currentYear;
              const month = value.month();
              const options = [];
              for (let i = year - 10; i < year + 10; i += 1) {
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
                    {selectedDate
                      ? `${selectedDate} ${selectedTime}`
                      : "Book an appointment"}
                  </Typography.Title>
                  <Row gutter={8}>
                    <Col>
                      <Radio.Group
                        size="small"
                        onChange={(e) => onTypeChange(e.target.value)}
                        value={type}
                      >
                        <Radio.Button value="month">Month</Radio.Button>
                        <Radio.Button value="year">Year</Radio.Button>
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
      <Button onClick={submitAppointment}>Book</Button>
    </ConfigProvider>
  );
};

export default Book;
