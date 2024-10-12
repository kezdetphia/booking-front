// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { PhoneTwoTone, MailTwoTone } from "@ant-design/icons";

//TODOL: Check if filteredUsers is necessary to update on fetch

const AdminUsers = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/admin/admingetallusers",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const data = await response.json();
        setUsers(data?.users || []);
        setFilteredUsers(data?.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setInitLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif text-center pt-2 pb-10">
        Users
      </h1>
      <div className="flex justify-center mb-4">
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: 16, width: 200 }}
        />
      </div>
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={filteredUsers}
        renderItem={(user) => (
          <List.Item
            actions={[
              <div className="flex gap-5">
                <a key="list-loadmore-email" href={`mailto:${user.email}`}>
                  <MailTwoTone
                    twoToneColor="#1890ff" // Blue color for email
                    style={{ fontSize: "25px" }}
                  />
                </a>

                <a key="list-loadmore-call" href={`tel:${user.phoneNumber}`}>
                  <PhoneTwoTone
                    twoToneColor="#32CD32"
                    style={{ fontSize: "28px" }} // Adjust the size here
                  />
                </a>
              </div>,
            ]}
          >
            <Skeleton avatar title={false} loading={initLoading} active>
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: "#87d068" }}>
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "?"}
                  </Avatar>
                }
                // Example usage in a component
                // title={
                //   <Link to={`/admin/user/${user?._id}`}>{user.username}</Link>
                // }
                title={<Link to={`/user/${user?._id}`}>{user.username}</Link>}
                description={
                  <div>
                    <div>Email: {user.email}</div>
                    <div>Number: {user.phoneNumber}</div>
                    <div>
                      Registered:{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div>Appointments: {user.appointments?.length || 0}</div>
                  </div>
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AdminUsers;
