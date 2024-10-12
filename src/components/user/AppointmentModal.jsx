// src/components/user/AppointmentModal.jsx
import React, { useEffect, useState } from "react";
import { Button, Drawer, Space } from "antd";
import DayCalendar from "../DayCalendar";
import PopUpModal from "../PopUpModal";
import { useNavigate } from "react-router-dom";

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
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const navigate = useNavigate();

  const onClose = () => {
    setModalOpen(false);
  };

  const onOk = () => {
    setShowConfirmModal(true); // Open the PopUpModal
    console.log("Show Confirm Modal:", showConfirmModal); // Debugging line

    setModalOpen(false);

    // if (confirmSubmit === true) {
    //   submitAppointment();
    // } else {
    //   console.log("not true");
    // }
  };

  useEffect(() => {
    if (confirmSubmit === true) {
      submitAppointment();
      navigate("/appointment-confirm");
    }
  }, [confirmSubmit]);

  return (
    <>
      <Drawer
        title={
          <p className="font-serif">
            {selectedTime ? `${selectedDate} ${selectedTime}` : "Select spot"}
          </p>
        }
        placement="right"
        width={400}
        onClose={onClose}
        open={modalOpen}
        extra={
          <Space>
            <Button onClick={onClose}>
              <p className="font-serif">Cancel</p>
            </Button>
            <Button type="primary" onClick={onOk}>
              <p className="font-serif">OK</p>
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
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        selectedTime={selectedTime}
        selectedDate={selectedDate}
        setConfirmSubmit={setConfirmSubmit}
      />
    </>
  );
};

export default AppointmentModal;
