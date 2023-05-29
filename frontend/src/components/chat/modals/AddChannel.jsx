import React, { useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import leoProfanity from 'leo-profanity';
import { selectors as channelsSelectors } from '../../../slices/channelsSlice';
import { actions } from '../../../slices/index.js';
import { useApi } from '../../../hooks/index.js';

const getValidationSchema = (names) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(3, 'modals.min')
    .max(20, 'modals.max')
    .notOneOf(names, 'modals.uniq')
    .required('modals.required'),
});

const AddChannel = ({ closeModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const api = useApi();
  const inputRef = useRef();

  const channelNames = useSelector(channelsSelectors.selectAll).map((channel) => channel.name);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      try {
        const safeName = leoProfanity.clean(name);
        const data = await api.addChannel({ name: safeName });
        dispatch(actions.setCurrentChannel(data.id));
        toast.success(t('modals.created'));
        closeModal();
      } catch (error) {
        console.error(error);
        if (error.isAxiosError) {
          toast.error(t('errors.network'));
        } else toast.error(t('errors.unknown'));
      }
    },
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              required
              className="mb-2"
              ref={inputRef}
              disabled={formik.isSubmitting}
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.errors.name}
              name="name"
              id="name"
            />
            <label className="visually-hidden" htmlFor="name">{t('modals.channelName')}</label>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={closeModal}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};
export { getValidationSchema };

export default AddChannel;
