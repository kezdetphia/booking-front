import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/hu"; // Import Hungarian locale for dayjs
import {
  Calendar,
  Col,
  Row,
  Select,
  Typography,
  ConfigProvider,
  message,
} from "antd";
import huHU from "antd/es/locale/hu_HU";
import AppointmentModal from "../../components/user/AppointmentModal";
import { useAuth } from "../../context/authContext";
import { useAppointmentContext } from "../../context/AppointmentContext";
import { useAppointmentDateContext } from "../../context/appointmentDateContext";

// Extend dayjs functionality
dayjs.extend(require("dayjs/plugin/localeData"));
dayjs.extend(require("dayjs/plugin/isSameOrAfter"));
dayjs.extend(require("dayjs/plugin/isSameOrBefore"));

const Book = () => {
  const { user } = useAuth();
  const { postAppointment, disabledDates } = useAppointmentContext();
  const { selectedDate, setSelectedDate, selectedTime } =
    useAppointmentDateContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [calendarValue, setCalendarValue] = useState(dayjs());

  // Ensure that the selected date is null when the component mounts
  useEffect(() => {
    setSelectedDate(null);
  }, [setSelectedDate]);

  // Function to disable past and blocked dates
  const disabledDate = (current) => {
    if (!current) return false;
    if (current < dayjs().startOf("day")) return true;

    const currentDateStr = current.format("YYYY/MM/DD");
    return disabledDates.some((disabled) => {
      const [start, end] = disabled.date;
      return (
        dayjs(currentDateStr).isSameOrAfter(dayjs(start)) &&
        dayjs(currentDateStr).isSameOrBefore(dayjs(end))
      );
    });
  };

  // Function for handling day clicks, including weekends and validation
  const handleDayClick = (value) => {
    const dayOfWeek = value.day();
    const formattedDate = value.format("YYYY/MM/DD");

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setSelectedDate(formattedDate);
      messageApi.info(
        `Weekends are not available for booking! Please call to book.`
      );
      return;
    }

    if (value.isSameOrAfter(dayjs(), "day")) {
      setSelectedDate(formattedDate);
      setModalOpen(true);
    }
  };

  // Function to handle month or year changes
  const handlePanelChange = () => {
    setSelectedDate(null);
  };

  const renderCalendarHeader = ({ value, onChange }) => {
    const today = dayjs();

    // Calculate available months
    const availableMonths = [];
    for (let i = 0; i < 3; i++) {
      const nextMonth = today.add(i, "month");
      availableMonths.push({
        month: nextMonth.format("MMMM"),
        index: nextMonth.month(),
        year: nextMonth.year(),
      });
    }

    const monthOptions = availableMonths.map(({ month, index, year }) => (
      <Select.Option key={`${year}-${index}`} value={`${year}-${index}`}>
        {month} {year}
      </Select.Option>
    ));

    const handleMonthYearChange = (selectedValue) => {
      const [year, month] = selectedValue.split("-").map(Number);
      onChange(value.year(year).month(month));
    };

    return (
      <div style={{ padding: 8 }}>
        <Typography.Title level={4}>
          {selectedDate ? selectedDate : "Book an Appointment"}
        </Typography.Title>
        <Row gutter={8}>
          <Col>
            <Select
              size="small"
              value={`${value.year()}-${value.month()}`}
              onChange={handleMonthYearChange}
              style={{ minWidth: 150 }}
            >
              {monthOptions}
            </Select>
          </Col>
        </Row>
      </div>
    );
  };

  // Function to submit appointment data
  const submitAppointment = async () => {
    await postAppointment({
      userId: user._id,
      username: user.username,
      email: user.email,
      desc: "Appointment description",
      date: selectedDate,
      time: selectedTime,
      length: user.usualAppointmentLength,
      booked: true,
    });
  };

  return (
    <ConfigProvider locale={huHU}>
      {contextHolder}
      <div className="flex justify-center items-center w-full py-5">
        <div className="w-full border border-gray-300 rounded-lg">
          <AppointmentModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            submitAppointment={submitAppointment}
          />
          <div className="shadow-lg">
            <Calendar
              fullscreen={false}
              onSelect={handleDayClick}
              disabledDate={disabledDate}
              headerRender={renderCalendarHeader}
              onPanelChange={handlePanelChange}
              value={calendarValue}
              onChange={(newValue) => setCalendarValue(newValue)}
            />
          </div>
        </div>
      </div>
      <p className="font-serif text-lg pt-10 text-center">
        If you have any questions or weekend booking, please give me a call at
        1234567890
      </p>
    </ConfigProvider>
  );
};

export default Book;
