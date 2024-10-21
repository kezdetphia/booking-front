import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const setUserAuthenticated = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("no token in authcontext");
        setUser(null);
        setIsAuthenticated(false);
        return;
      }
      try {
        if (token) {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/getmyuser`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error("Authcontext user fetch went wrong a bit");
          }

          const data = await res.json();
          setUser(data.user);

          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log("No user or authentication token found");
        }
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

  // const handleLogout = () => {
  //   localStorage.removeItem("authToken");
  //   setUser(null);
  //   // navigate("/signin");
  // };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        authLoading,
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
