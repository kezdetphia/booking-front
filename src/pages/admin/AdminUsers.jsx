import React, { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
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
      // console.log("usersssss", data);
      setUsers(data?.users);
    };
    fetchUsers();
  }, []);

  console.log("usersssss", users);

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user?._id}>{user?.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;
