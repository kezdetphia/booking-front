// src/components/PopUpModal.jsx
import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const PopUpModal = ({ visible, onClose, selectedTime, selectedDate }) => {
  return (
    <Modal
      title="Your appointment:"
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      okText="Book"
      cancelText="Cancel"
      icon={<ExclamationCircleOutlined />}
    >
      <p>{selectedDate}</p>
      <p>{selectedTime} o'clock</p>
    </Modal>
  );
};

export default PopUpModal;
