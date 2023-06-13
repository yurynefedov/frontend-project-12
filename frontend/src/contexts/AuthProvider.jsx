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

  const logIn = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser({ username: userData.username, token: userData.token });
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = useCallback(() => (user?.token ? { Authorization: `Bearer ${user.token}` } : {}), [user]);

  const authData = useMemo(
    () => (
      {
        user,
        logIn,
        logOut,
        getAuthHeader,
      }),
    [user, getAuthHeader],
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
