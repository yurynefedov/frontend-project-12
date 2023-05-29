import React, { useState, useMemo } from 'react';
import { AuthContext } from './index.js';

const AuthProvider = ({ children }) => {
  const currentUserData = JSON.parse(localStorage.getItem('user'));

  const [user, setUser] = useState(currentUserData ? { username: currentUserData.username } : null);
  const [loggedIn, setLoggedIn] = useState(!!currentUserData);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username });
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setLoggedIn(false);
  };

  const getAuthHeader = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData?.token ? { Authorization: `Bearer ${userData.token}` } : {};
  };

  const authData = useMemo(
    () => (
      {
        user,
        loggedIn,
        logIn,
        logOut,
        getAuthHeader,
      }),
    [user, loggedIn],
  );

  return (
    <AuthContext.Provider
      value={authData}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
