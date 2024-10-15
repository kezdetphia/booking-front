// src/components/PopUpModal.jsx
import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useAppointmentDateContext } from "../context/appointmentDateContext";

const PopUpModal = ({ visible, onClose, setConfirmSubmit }) => {
  const { selectedTime, selectedDate } = useAppointmentDateContext();

  return (
    <Modal
      title="Your appointment:"
      open={visible}
      onOk={() => {
        setConfirmSubmit(true);
        onClose();
      }}
      onCancel={onClose}
      okText="Book"
      cancelText="Cancel"
      icon={<ExclamationCircleOutlined />}
    >
      <p className="font-serif">{selectedDate}</p>
      <p className="font-serif">{selectedTime} o'clock</p>
    </Modal>
  );
};

export default PopUpModal;
