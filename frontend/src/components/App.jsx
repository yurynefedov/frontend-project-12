import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './login/Login';
import NotFound from './errors/NotFound';
import NavBar from './common-components/NavBar';
import SignUp from './signup/SignUp';
import ChatPage from './chat/ChatPage';
import UnknownError from './errors/UnknownError';

import routes from '../routes';
import AuthProvider, { useAuth } from '../contexts/AuthProvider';

const PrivateRoute = () => {
  const { user } = useAuth();

  return (
    user ? <Outlet /> : <Navigate to={routes.loginPagePath()} />
  );
};

const PublicRoute = () => {
  const { user } = useAuth();

  return (
    user ? <Navigate to={routes.chatPagePath()} /> : <Outlet />
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
          <Route path={routes.unknownErrorPagePath()} element={<UnknownError />} />
        </Routes>
      </div>
      <ToastContainer />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
