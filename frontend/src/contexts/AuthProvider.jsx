import React, {
  useState,
  useContext,
  useCallback,
  useMemo,
  createContext,
} from 'react';

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const currentUserData = JSON.parse(localStorage.getItem('user'));

  const [user, setUser] = useState(currentUserData
    ? {
      token: currentUserData.token,
      username: currentUserData.username,
    }
    : null);

  const [loggedIn, setLoggedIn] = useState(!!currentUserData);

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username, token: userData.token });
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setLoggedIn(false);
  };

  const getAuthHeader = useCallback(() => (user?.token ? { Authorization: `Bearer ${user.token}` } : {}), [user]);

  const authData = useMemo(
    () => (
      {
        user,
        loggedIn,
        logIn,
        logOut,
        getAuthHeader,
      }),
    [user, loggedIn, getAuthHeader],
  );

  return (
    <AuthContext.Provider
      value={authData}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
