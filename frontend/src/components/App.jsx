import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './Login';
import NotFound from './NotFound';
import NavBar from './NavBar';
import SignUp from './SignUp';
import ChatPage from './chat/ChatPage';

import routes from '../routes';
import { useAuth } from '../hooks/index.js';
import AuthProvider from '../contexts/AuthProvider.jsx';

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useAuth();
  const location = useLocation();

  return (
    loggedIn ? children : <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="d-flex flex-column vh-100">
        <NavBar />
        <Routes>
          <Route
            exact
            path={routes.chatPagePath()}
            element={
              <PrivateRoute><ChatPage /></PrivateRoute>
            }
          />
          <Route path={routes.loginPagePath()} element={<Login />} />
          <Route path={routes.signupPagePath()} element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
