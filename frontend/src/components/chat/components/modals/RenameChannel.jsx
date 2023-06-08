import React, { useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { channelsSelectors } from '../../../../slices/channelsSlice';
import { modalsSelectors } from '../../../../slices/modalSlice';
import { useApi } from '../../../../contexts/ApiProvider';
import { getValidationSchema } from './AddChannel';

const RenameChannel = ({ closeModal }) => {
  const { t } = useTranslation();
  const api = useApi();
  const inputRef = useRef();

  const channelNames = useSelector(channelsSelectors.selectChannelNames);
  const channelId = useSelector(modalsSelectors.selectChosenChannel);
  const selectedChannel = useSelector((state) => channelsSelectors.selectById(state, channelId));

  useEffect(() => {
    setTimeout(() => inputRef.current?.select());
  }, []);

  const formik = useFormik({
    initialValues: {
      name: selectedChannel.name,
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      try {
        const safeName = leoProfanity.clean(name);
        await api.renameChannel({ name: safeName, id: channelId });
        toast.success(t('modals.renamed'));
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
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
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
            <label className="visually-hidden" htmlFor="name">{t('modals.newChannelName')}</label>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                disabled={formik.isSubmitting}
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

export default RenameChannel;
