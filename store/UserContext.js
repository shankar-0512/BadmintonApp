import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Retrieve the userName from AsyncStorage on mount
    async function fetchUserName() {
      const storedUserName = await AsyncStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
    fetchUserName();
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}
