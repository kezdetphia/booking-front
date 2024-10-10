import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [authLoading, setAuthLoading] = useState(true);

  console.log("AuthContextProvider", user);

  useEffect(() => {
    console.log("AuthContextProvider useffect", user);
    const setUserAuthenticated = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          const res = await fetch("http://localhost:3001/api/users/getmyuser", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (!res.ok) {
            throw new Error("Authcontext user fetch went wrong a bit");
          }

          const data = await res.json();
          console.log("home userrrr from token", data.user);
          setUser(data.user);

          // const userDetails = localStorage.getItem("user");
          // if (userDetails) {
          //   setUser(JSON.parse(userDetails));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          //added after editing
          console.log("No user or authentication token found");
        }
        // } else {
        //   setUser(null);
        //   setIsAuthenticated(false);
        //   console.log("No user or authentication token found");
        // }
      } catch (error) {
        console.error("Failed to fetch auth token", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    setUserAuthenticated();
  }, []);

  // const setUserInfo = async (userDetails) => {
  //   localStorage.setItem("user", JSON.stringify(userDetails));
  //   setUser(userDetails);
  // setIsAuthenticated(true);
  // };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        authLoading,
        // setUserInfo,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside an AuthContextProvider");
  }
  return value;
};
