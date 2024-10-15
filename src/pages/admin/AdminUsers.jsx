// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { Avatar, List, Skeleton, Input } from "antd";
import { Link } from "react-router-dom";
import { PhoneTwoTone, MailTwoTone } from "@ant-design/icons";

const AdminUsers = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/admin/admingetallusers`,
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
          <Link
            to={`/admin/user/${user?._id}`}
            style={{ display: "block", textDecoration: "none" }}
          >
            <List.Item
              actions={[
                <div className="flex gap-5">
                  <a key="list-loadmore-email" href={`mailto:${user.email}`}>
                    <MailTwoTone
                      twoToneColor="#1890ff"
                      style={{ fontSize: "25px" }}
                    />
                  </a>
                  <a key="list-loadmore-call" href={`tel:${user.phoneNumber}`}>
                    <PhoneTwoTone
                      twoToneColor="#32CD32"
                      style={{ fontSize: "28px" }}
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
                  title={
                    <p className="font-serif font-semibold">{user.username}</p>
                  }
                  description={
                    <div>
                      <div>
                        <span>Email: </span>
                        <span>{user.email}</span>
                      </div>
                      <div>
                        <span>Number: </span>
                        <span>{user.phoneNumber}</span>
                      </div>
                      <div>
                        <span>Registered: </span>
                        <span>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span>Appointments: </span>
                        <span>{user.appointments?.length || 0}</span>
                      </div>
                    </div>
                  }
                />
              </Skeleton>
            </List.Item>
          </Link>
        )}
      />
    </div>
  );
};

export default AdminUsers;
