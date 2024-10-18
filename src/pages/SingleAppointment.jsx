import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Divider,
  List,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Typography,
  Skeleton,
} from "antd";
import dayjs from "dayjs"; // For managing date and time formatting
import { useAppointmentContext } from "../context/AppointmentContext";

const SingleAppointment = () => {
  const [appointment, setAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [editedAppointment, setEditedAppointment] = useState({}); // To store edited values
  const [loading, setLoading] = useState(true); // Loading state
  const { appointmentId } = useParams();
  const { updateAppointment } = useAppointmentContext();

  useEffect(() => {
    const fetchAppointment = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/admin/getoneappointment/${appointmentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch appointment");
        }

        const data = await res.json();
        setAppointment(data.appointment);
        setEditedAppointment(data.appointment); // Initialize edited appointment with fetched data
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleEditAppointment = async () => {
    if (isEditing) {
      // If saving changes
      await updateAppointment(appointment._id, editedAppointment);
      setAppointment(editedAppointment); // Update local state after submission
    }
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleInputChange = (field, value) => {
    setEditedAppointment({ ...editedAppointment, [field]: value });
  };

  // Generate options for length in 15-minute increments from 30 minutes to 4 hours
  const generateLengthOptions = () => {
    const options = [];
    for (let minutes = 30; minutes <= 240; minutes += 15) {
      options.push({
        label: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
        value: minutes,
      });
    }
    return options;
  };

  const lengthOptions = generateLengthOptions();

  // Fields to display and edit
  const fieldsToRender = ["date", "time", "length", "description"];

  return (
    <div>
      <Divider orientation="center">
        <p className="font-sans font-bold text-xl pb-10 pt-5">
          Appointment Details
        </p>
      </Divider>
      <Skeleton loading={loading} active>
        <List
          header={
            <Link to={`/admin/user/${appointment?.userId}`}>
              <p className="font-serif  text-lg text-blue-600">
                {appointment?.username}
              </p>
            </Link>
          }
          bordered
          dataSource={fieldsToRender}
          renderItem={(key) => (
            <List.Item>
              <Typography.Text className="font-sans " strong>
                {key}:
              </Typography.Text>
              {!isEditing ? (
                key === "username" ? (
                  <span className="font-sans font-lg ">
                    {appointment ? appointment.username : ""}
                  </span>
                ) : key === "date" ? (
                  <span>
                    {appointment
                      ? dayjs(appointment.date).format("YYYY-MM-DD")
                      : ""}
                  </span>
                ) : key === "time" ? (
                  <span>
                    {appointment
                      ? dayjs(appointment.time, "HH:mm").format("HH:mm")
                      : ""}
                  </span>
                ) : key === "length" ? (
                  <span>{appointment ? appointment.length : ""}</span>
                ) : (
                  <span>{appointment ? appointment.description : ""}</span>
                )
              ) : key === "date" ? (
                <DatePicker
                  value={
                    editedAppointment.date
                      ? dayjs(editedAppointment.date)
                      : null
                  }
                  onChange={(date, dateString) =>
                    handleInputChange("date", dateString)
                  }
                />
              ) : key === "time" ? (
                <TimePicker
                  value={
                    editedAppointment.time
                      ? dayjs(editedAppointment.time, "HH:mm")
                      : null
                  }
                  onChange={(time, timeString) =>
                    handleInputChange("time", timeString)
                  }
                  format="HH:mm"
                />
              ) : key === "length" ? (
                <Select
                  value={editedAppointment.length}
                  onChange={(value) => handleInputChange("length", value)}
                  options={lengthOptions}
                />
              ) : (
                <Input
                  value={editedAppointment[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              )}
            </List.Item>
          )}
          footer={
            <div className="flex justify-center items-center">
              <Button
                onClick={handleEditAppointment}
                size="middle"
                type="primary"
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          }
        />
      </Skeleton>
    </div>
  );
};

export default SingleAppointment;
