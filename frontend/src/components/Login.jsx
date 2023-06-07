import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/index.js';
import routes from '../routes';

import loginImage from '../assets/loginImage.jpeg';

const Login = () => {
  const { t } = useTranslation();

  const { logIn } = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    username: yup.string().trim().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const response = await axios.post(routes.loginPath(), values);
        logIn(response.data);
        const { from } = location.state || { from: { pathname: routes.chatPagePath() } };
        navigate(from);
      } catch (error) {
        console.error(error);
        formik.setSubmitting(false);
        if (error.isAxiosError) {
          if (error.response.status === 401) {
            setAuthFailed(true);
            navigate(routes.loginPagePath());
            inputRef.current.select();
          } else {
            toast.error(t('errors.network'));
          }
        } else {
          toast.error(t('errors.unknown'));
        }
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={loginImage}
                  className="rounded-circle"
                  alt={t('login.header')}
                />
              </div>
              <Form
                onSubmit={formik.handleSubmit}
                className="col-12 col-md-6 mt-3 mt-mb-0"
              >
                <h1 className="text-center mb-4">{t('login.header')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={authFailed}
                    required
                    ref={inputRef}
                    placeholder={t('login.username')}
                  />
                  <label htmlFor="username">{t('login.username')}</label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    isInvalid={authFailed}
                    required
                    placeholder={t('login.password')}
                  />
                  <Form.Label htmlFor="password">
                    {t('login.password')}
                  </Form.Label>
                  {authFailed && <Form.Control.Feedback type="invalid" tooltip>{t('login.authFailed')}</Form.Control.Feedback>}
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100 mb-3"
                >
                  {t('login.submit')}
                </Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.noAccount')}</span>
                {' '}
                <Link to={routes.signupPagePath()}>{t('login.registrationLink')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
