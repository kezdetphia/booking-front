import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
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
