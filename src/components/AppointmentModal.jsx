import React, { useState } from "react";
import { Button, Drawer, Radio, Space } from "antd";
import DayCalendar from "./DayCalendar";
const AppointmentModal = ({
  setModalOpen,
  modalOpen,
  setSelectedTime,
  selectedTime,
  selectedDate,
}) => {
  const showDrawer = () => {
    setModalOpen(true);
  };

  const onClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Drawer
        title={selectedTime ? selectedTime : "Select spot"} // Update title to include selectedDate
        placement="right"
        width={500}
        onClose={onClose}
        open={modalOpen}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              OK
            </Button>
          </Space>
        }
      >
        <DayCalendar
          selectedDate={selectedDate}
          setSelectedTime={setSelectedTime}
          isInteractive={true}
        />
      </Drawer>
    </>
  );
};
export default AppointmentModal;
