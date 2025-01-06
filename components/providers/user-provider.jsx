"use client";

import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: null,
  updateUser: () => {},
});

export function UserProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);

  const updateUser = (newUser) => {
    if (!newUser) {
      setUser(null);
      return;
    }

    // Always create a new object to ensure React detects the change
    setUser((current) => ({
      ...current,
      ...newUser,
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
