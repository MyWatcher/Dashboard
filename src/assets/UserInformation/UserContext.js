import React, { createContext, useContext, useState } from 'react';
import Subscription from './Subscription';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    height: 0,
    subscription: Subscription | undefined,
    weight: 0,
    birthDate: "",
    createdAt: "",
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    password: "",
    updatedAt: "",
    stripeCustomerId: "",
    userId: "",
    token: "",
    tokens : 0,
    heartRate : [],
  });


  const updateUser = (userInfo) => {
    // setUser(userInfo);
    setUser((prevUser) => ({ ...prevUser, ...userInfo }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);