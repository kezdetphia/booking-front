import React, { useEffect } from "react";
import { useAuth } from "../../context/authContext";

const Home = () => {
  // useEffect(() => {
  //   const getUserByToken = async () => {
  //     const res = await fetch("http://localhost:3001/api/users/getmyuser", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //       },
  //     });

  //     const data = await res.json();
  //     console.log("home userrrr from token", data.user);
  //   };
  //   getUserByToken();
  // }, []);

  return (
    <div className="flex justify-center items-center bg-red-200">
      <h1>home</h1>
    </div>
  );
};
export default Home;
