import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './Login';
import NotFound from './NotFound';
import NavBar from './NavBar';
import SignUp from './SignUp';
import ChatPage from './chat/ChatPage';

import routes from '../routes';
import AuthProvider, { useAuth } from '../contexts/AuthProvider';

const PrivateRoute = () => {
  const { loggedIn } = useAuth();

  return (
    loggedIn ? <Outlet /> : <Navigate to={routes.loginPagePath()} />
  );
};

const PublicRoute = () => {
  const { loggedIn } = useAuth();

  return (
    loggedIn ? <Navigate to={routes.chatPagePath()} /> : <Outlet />
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="d-flex flex-column vh-100">
        <NavBar />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path={routes.chatPagePath()} element={<ChatPage />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path={routes.loginPagePath()} element={<Login />} />
            <Route path={routes.signupPagePath()} element={<SignUp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
