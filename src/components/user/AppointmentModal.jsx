// src/components/user/AppointmentModal.jsx
import React, { useEffect, useState } from "react";
import { Button, Drawer, Space } from "antd";
import DayCalendar from "../DayCalendar";
import PopUpModal from "../PopUpModal";
import { useNavigate } from "react-router-dom";
import { useAppointmentDateContext } from "../../context/appointmentDateContext";
import { useAppointmentContext } from "../../context/AppointmentContext";
const AppointmentModal = ({
  setModalOpen,
  modalOpen,
  // appointments,
  submitAppointment,
}) => {
  const { selectedTime, selectedDate } = useAppointmentDateContext();
  const { appointments } = useAppointmentContext();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const navigate = useNavigate();

  const onClose = () => {
    setModalOpen(false);
  };

  const onOk = () => {
    setShowConfirmModal(true); // Open the PopUpModal
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
        {/* <DayCalendar isInteractive={true} appointments={appointments} /> */}
        <DayCalendar isInteractive={true} />
      </Drawer>
      <PopUpModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        setConfirmSubmit={setConfirmSubmit}
      />
    </>
  );
};

export default AppointmentModal;
