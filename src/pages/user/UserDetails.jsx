// src/pages/user/UserDetails.jsx
import { Divider, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("today"); // State to track selected category
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/getuser/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      console.log(data);
      setUserDetails(data);
    };

    fetchUser();
  }, [id]);

  console.log("userDetails", userDetails);

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
            className="text-center font-serif block" // Ensure it behaves like a block element
            href={`tel:${userDetails?.phoneNumber}`}
            style={{ textAlign: "center" }} // Additional inline style for centering
          >
            {userDetails?.phoneNumber}
          </a>
        </div>
      );
    }

    return appointments.map((appointment) => (
      <div key={appointment._id}>
        <p>Date: {appointment.date}</p>
        <p>Time: {appointment.time}</p>
        <p>Description: {appointment.desc || "No description"}</p>
        <Divider />
      </div>
    ));
  };

  return (
    <div>
      <Divider orientation="center">
        <p className="font-serif text-2xl font-bold">{userDetails?.username}</p>
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

      <div className="flex justify-around pb-2">
        <Tag
          color={selectedCategory === "past" ? "volcano" : "red"}
          onClick={() => setSelectedCategory("past")}
          style={{
            cursor: "pointer",
            border: selectedCategory === "past" ? "1px solid #fa541c" : "none",
          }}
        >
          Past: {past.length}
        </Tag>
        <Tag
          color={selectedCategory === "today" ? "geekblue" : "blue"}
          onClick={() => setSelectedCategory("today")}
          style={{
            cursor: "pointer",
            border: selectedCategory === "today" ? "1px solid #2f54eb" : "none",
          }}
        >
          Today: {todayAppointments.length}
        </Tag>
        <Tag
          color={selectedCategory === "future" ? "lime" : "green"}
          onClick={() => setSelectedCategory("future")}
          style={{
            cursor: "pointer",
            border:
              selectedCategory === "future" ? "1px solid #52c41a" : "none",
          }}
        >
          Future: {future.length}
        </Tag>
      </div>

      <Divider />

      {selectedCategory === "past" && renderAppointments(past)}
      {selectedCategory === "today" && renderAppointments(todayAppointments)}
      {selectedCategory === "future" && renderAppointments(future)}
    </div>
  );
};

export default UserDetails;
