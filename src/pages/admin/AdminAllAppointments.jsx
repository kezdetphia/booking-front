import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, Select, Input } from "antd";
import dayjs from "dayjs";
import { useAppointmentContext } from "../../context/AppointmentContext";

const { Option } = Select;

function AdminAllAppointments() {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { appointments } = useAppointmentContext();

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
                <List.Item
                  actions={[
                    <a key="list-loadmore-edit">edit</a>,
                    <a key="list-loadmore-more">more</a>,
                  ]}
                >
                  <Skeleton avatar title={false} loading={item.loading} active>
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
                      title={<a href="https://ant.design">{item.username}</a>}
                      description={
                        <div>
                          <div>{item.desc.slice(0, 20)}...</div>
                          <div>{`${item.date} at ${item.time}`}</div>
                        </div>
                      }
                    />
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
