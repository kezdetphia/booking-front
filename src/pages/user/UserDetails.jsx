import { Divider, InputNumber, Tag, Skeleton, message, Button } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import useAdminDeleteAppointment from "../../hooks/useAdminDeleteAppointment";
import { useAuth } from "../../context/authContext";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("today");
  const { id } = useParams();
  const [userAppointmentLength, setUserAppointmentLength] = useState();
  const [loading, setLoading] = useState(true); // Loading state
  const [messageApi, contextHolder] = message.useMessage();
  const { deleteAppointment } = useAdminDeleteAppointment();
  const [userDataRefetch, setUserDataRefetch] = useState(false);

  const { user, setUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/getuser/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUserDetails(data);
        setUserAppointmentLength(data?.usualAppointmentLength);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUser();
  }, [id, userDataRefetch]);

  const today = dayjs().format("YYYY-MM-DD");

  const categorizeAppointments = (appointments) => {
    const past = [];
    const todayAppointments = [];
    const future = [];

    appointments.forEach((appointment) => {
      const appointmentDate = dayjs(appointment.date).format("YYYY-MM-DD");
      if (appointmentDate < today) {
        past.push(appointment);
      } else if (appointmentDate === today) {
        todayAppointments.push(appointment);
      } else {
        future.push(appointment);
      }
    });

    return { past, todayAppointments, future };
  };

  const { past, todayAppointments, future } = userDetails
    ? categorizeAppointments(userDetails.appointments)
    : { past: [], todayAppointments: [], future: [] };

  const renderAppointments = (appointments) => {
    if (appointments.length === 0) {
      return (
        <div className="flex flex-col items-center">
          <p className="text-center font-serif pt-10">
            No appointments for this time period.
          </p>
          <p className="text-center font-serif">Give them a call?</p>
          <a
            className="text-center font-serif block"
            href={`tel:${userDetails?.phoneNumber}`}
            style={{ textAlign: "center" }}
          >
            {userDetails?.phoneNumber}
          </a>
        </div>
      );
    }

    return appointments.map((appointment) => (
      <div
        key={appointment._id}
        className="flex justify-between items-center  "
      >
        <Link
          to={`/admin/one-appointment/${appointment?._id}`}
          className="flex-1"
        >
          <div>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            <p>
              Description:{" "}
              {appointment.desc.substring(0, 20) || "No description"}
              ...
            </p>
            <Divider />
          </div>
        </Link>

        <Button
          danger
          type="primary"
          onClick={() => handleDeleteAppointment(appointment._id)}
          className="mb-8 "
        >
          Delete
        </Button>
      </div>
    ));
  };

  const handleBlur = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/adminedituserdetails`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: id,
            updateField: "usualAppointmentLength",
            updateValue: userAppointmentLength,
          }),
        }
      );

      if (!res.ok) {
        messageApi.open({
          content: res.message,
          type: "error",
        });
        throw new Error("Failed to update user details");
      }

      const data = await res.json();
      console.log("User details updated successfully:", data);

      if (res.status === 200) {
        messageApi.open({
          content: data.message,
          type: "success",
        });
        setUser((prevUser) => ({
          ...prevUser,
          usualAppointmentLength: data?.user?.usualAppointmentLength,
        }));
      } else {
        messageApi.open({
          type: "error",
          content: data.message,
        });
      }
    } catch (err) {
      console.error("Error updating user details:", err);
    }
  };

  const handleAppointmentLengthChange = (value) => {
    setUserAppointmentLength(value);
  };

  const handleDeleteAppointment = async (appId) => {
    await deleteAppointment(appId);
    messageApi.open({
      content: "Appointment deleted successfully",
      type: "success",
    });
    setUserDataRefetch(!userDataRefetch);
  };

  return (
    <div>
      {contextHolder}
      <Skeleton loading={loading} active>
        <Divider orientation="center">
          <p className="font-serif text-2xl font-bold pt-5 pb-10">
            {userDetails?.username}
          </p>
        </Divider>
        <div className="flex flex-row justify-between pt-4">
          <p className="font-serif font-semibold ">Member since:</p>
          <p className="font-serif ">{userDetails?.createdAt.slice(0, 10)}</p>
        </div>
        <Divider />
        <div className="flex flex-row justify-between">
          <p className="font-serif font-semibold ">Appointments so far:</p>
          <p className="font-serif ">{userDetails?.appointments.length}</p>
        </div>
        <Divider />
        <div className="flex flex-row justify-between">
          <p className="font-serif font-semibold ">Usual appointment length:</p>
          <div className="flex gap-x-4 items-center ">
            <InputNumber
              min={0}
              value={userAppointmentLength}
              onChange={handleAppointmentLengthChange}
              onBlur={handleBlur}
              style={{ width: 100 }}
            />
            <p className="font-serif ">minutes</p>
          </div>
        </div>
        <Divider />

        <div className="flex justify-around pb-2">
          <Tag
            color={selectedCategory === "past" ? "volcano" : "red"}
            onClick={() => setSelectedCategory("past")}
            style={{
              padding: "8px",
              borderRadius: "10px",
              fontSize: "medium",
              cursor: "pointer",
              border:
                selectedCategory === "past" ? "1px solid #fa541c" : "none",
            }}
          >
            Past: {past.length}
          </Tag>
          <Tag
            color={selectedCategory === "today" ? "geekblue" : "blue"}
            onClick={() => setSelectedCategory("today")}
            style={{
              padding: "8px",
              borderRadius: "10px",
              fontSize: "medium",
              cursor: "pointer",
              border:
                selectedCategory === "today" ? "1px solid #2f54eb" : "none",
            }}
          >
            Today: {todayAppointments.length}
          </Tag>
          <Tag
            color={selectedCategory === "future" ? "lime" : "green"}
            onClick={() => setSelectedCategory("future")}
            style={{
              padding: "8px",
              borderRadius: "10px",
              fontSize: "medium",
              cursor: "pointer",
              border:
                selectedCategory === "future" ? "1px solid #52c41a " : "none",
            }}
          >
            Future: {future.length}
          </Tag>
        </div>

        <Divider />

        {selectedCategory === "past" && renderAppointments(past)}
        {selectedCategory === "today" && renderAppointments(todayAppointments)}
        {selectedCategory === "future" && renderAppointments(future)}
      </Skeleton>
    </div>
  );
};

export default UserDetails;
