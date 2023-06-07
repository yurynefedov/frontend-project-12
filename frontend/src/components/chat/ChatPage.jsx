import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthProvider';
import { actions } from '../../slices/index';
import routes from '../../routes.js';

import Channels from './Channels';
import Messages from './Messages';

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logOut, getAuthHeader } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      const authHeader = getAuthHeader();
      dispatch(actions.fetchInitialData(authHeader))
        .unwrap()
        .catch((error) => {
          console.error(error);
          if (error.name === 'AxiosError') {
            if (error.message.includes('401')) {
              logOut();
              navigate(routes.loginPagePath());
            } else toast.error(t('errors.network'));
          } else toast.error(t('errors.unknown'));
        });
    };

    fetchData();
  }, [dispatch, logOut, getAuthHeader, t, navigate]);

  const loadingStatus = useSelector((state) => state.channels).loading;

  return loadingStatus ? (
    <div className="h-100 d-flex flex-column justify-content-center align-items-center">
      <Spinner animation="border" role="status" variant="secondary" />
      <span className="text-secondary fw-light">{t('chatPage.loading')}</span>
    </div>
  ) : (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <Messages />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
