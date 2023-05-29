import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import leoProfanity from 'leo-profanity';
import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

import registrationImage from '../assets/registrationImage.jpg';

const SignUp = () => {
  const { t } = useTranslation();

  const { logIn } = useAuth();
  const [regFailedWithConflict, setRegFailedWithConflict] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .min(3, 'signup.usernameLength')
      .max(20, 'signup.usernameLength')
      .test('profanity-check', 'signup.noProfanity', (username) => !leoProfanity.check(username))
      .required('signup.required'),
    password: yup
      .string()
      .min(6, 'signup.passwordLength')
      .required('signup.required'),
    confirmPassword: yup
      .string()
      .min(6, 'signup.passwordLength')
      .required('signup.required')
      .oneOf([yup.ref('password'), null], 'signup.passwordMatch'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async ({ username, password }) => {
      setRegFailedWithConflict(false);
      try {
        const response = await axios.post(routes.signupPath(), { username, password });
        logIn(response.data);
        const { from } = location.state || { from: { pathname: routes.chatPagePath() } };
        navigate(from);
      } catch (error) {
        console.error(error);
        if (error.isAxiosError) {
          if (error.response.status === 409) {
            setRegFailedWithConflict(true);
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
            <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={registrationImage}
                  className="rounded-circle"
                  alt={t('signup.header')}
                />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('signup.header')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    placeholder={t('signup.usernameLength')}
                    name="username"
                    id="username"
                    autoComplete="username"
                    isInvalid={(formik.errors.username && formik.touched.username)
                      || regFailedWithConflict}
                    required
                    ref={inputRef}
                  />
                  <Form.Label htmlFor="username">
                    {t('signup.username')}
                  </Form.Label>
                  <Form.Control.Feedback
                    type="invalid"
                    tooltip
                    placement="right"
                  >
                    {t(formik.errors.username)}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder={t('signup.passwordLength')}
                    name="password"
                    id="password"
                    aria-describedby="passwordHelpBlock"
                    isInvalid={(formik.errors.password && formik.touched.password)
                      || regFailedWithConflict}
                    required
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {t(formik.errors.password)}
                  </Form.Control.Feedback>
                  <Form.Label htmlFor="password">
                    {t('signup.password')}
                  </Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    placeholder={t('signup.passwordsMatch')}
                    name="confirmPassword"
                    id="confirmPassword"
                    isInvalid={
                        (formik.errors.confirmPassword && formik.touched.confirmPassword)
                        || regFailedWithConflict
                    }
                    required
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {regFailedWithConflict
                      ? t('signup.userExists')
                      : t(formik.errors.confirmPassword)}
                  </Form.Control.Feedback>
                  <Form.Label htmlFor="confirmPassword">
                    {t('signup.confirmPassword')}
                  </Form.Label>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  className="w-100"
                >
                  {t('signup.signup')}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
