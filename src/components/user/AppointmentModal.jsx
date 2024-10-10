// src/components/user/AppointmentModal.jsx
import React, { useState } from "react";
import { Button, Drawer, Space } from "antd";
import DayCalendar from "../DayCalendar";
import PopUpModal from "../PopUpModal";

const AppointmentModal = ({
  setModalOpen,
  modalOpen,
  setSelectedTime,
  selectedTime,
  selectedDate,
  appointments,
  submitAppointment,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const onClose = () => {
    setModalOpen(false);
  };

  const onSubmit = () => {
    setShowConfirmModal(true); // Open the PopUpModal
    setModalOpen(false);
    submitAppointment();
  };

  return (
    <>
      <Drawer
        title={selectedTime ? `${selectedDate} ${selectedTime}` : "Select spot"}
        placement="right"
        width={500}
        onClose={onClose}
        open={modalOpen}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onSubmit}>
              OK
            </Button>
          </Space>
        }
      >
        <DayCalendar
          selectedDate={selectedDate}
          setSelectedTime={setSelectedTime}
          isInteractive={true}
          appointments={appointments}
        />
      </Drawer>
      <PopUpModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        selectedTime={selectedTime}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default AppointmentModal;
