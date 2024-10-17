import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, Select, Input, Button } from "antd";
import dayjs from "dayjs";
import { useAppointmentContext } from "../../context/AppointmentContext";
import { Link } from "react-router-dom";

const { Option } = Select;

// TODO: Need to change the layout of the appointment details since Link messed it uo
function AdminAllAppointments() {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { appointments, deleteAppointment } = useAppointmentContext();

  useEffect(() => {
    setInitLoading(false);
    setList(appointments);
  }, [appointments]);

  const handleFilterChange = (value) => {
    setFilter(value);
    filterAppointments(value, searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterAppointments(filter, value);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    await deleteAppointment(appointmentId);
  };

  const filterAppointments = (filter, searchTerm) => {
    let filteredAppointments = [...appointments];

    if (filter === "past") {
      filteredAppointments = filteredAppointments.filter((appointment) =>
        dayjs(appointment.date).isBefore(dayjs(), "day")
      );
    } else if (filter === "today") {
      filteredAppointments = filteredAppointments.filter((appointment) =>
        dayjs(appointment.date).isSame(dayjs(), "day")
      );
    } else if (filter === "future") {
      filteredAppointments = filteredAppointments.filter((appointment) =>
        dayjs(appointment.date).isAfter(dayjs(), "day")
      );
    }

    if (searchTerm) {
      filteredAppointments = filteredAppointments.filter((appointment) =>
        appointment.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort appointments by date and time, closest to today first
    filteredAppointments.sort((a, b) => {
      const dateTimeA = dayjs(`${a.date} ${a.time}`);
      const dateTimeB = dayjs(`${b.date} ${b.time}`);
      return dateTimeA.diff(dateTimeB);
    });

    setList(filteredAppointments);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold font-serif text-center pt-2 pb-10">
          All Appointments
        </h1>
        <div>
          <div>
            <div className="mb-4 flex justify-center">
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ width: 200 }}
              />
              <Select
                defaultValue="all"
                style={{ width: 120, marginRight: 8 }}
                onChange={handleFilterChange}
              >
                <Option value="all">All</Option>
                <Option value="past">Past</Option>
                <Option value="today">Today</Option>
                <Option value="future">Future</Option>
              </Select>
            </div>
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="horizontal"
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Link
                        to={`/admin/one-appointment/${item._id}`}
                        style={{
                          display: "flex",
                          textDecoration: "none",
                          alignItems: "flex-start",
                          flex: 1, // Allow the link to take available space
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor: "#FFDAB9", // Peach background
                                color: "#FFFFFF", // White text
                              }}
                            >
                              {item.username
                                ? item.username.charAt(0).toUpperCase()
                                : "?"}
                            </Avatar>
                          }
                          title={
                            <p className="font-semibold text-black">
                              {item.username}
                            </p>
                          }
                          description={
                            <div className=" flex flex-col justify-center">
                              <div>{item.desc.slice(0, 20)}...</div>
                              <div>
                                <p className="font-semibold text-black">{`${item.date} at ${item.time}`}</p>
                              </div>
                            </div>
                          }
                        />
                      </Link>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "10px",
                        }}
                      >
                        <Button
                          onClick={() => handleDeleteAppointment(item._id)}
                          type="primary"
                          danger
                          key="list-loadmore-more"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Skeleton>
                </List.Item>
              )}
            />
          </div>
        </div>
        {/* ))} */}
      </div>
    </div>
  );
}

export default AdminAllAppointments;
