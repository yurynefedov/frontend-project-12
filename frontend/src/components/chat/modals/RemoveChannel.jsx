import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { modalsSelectors } from '../../../slices/modalSlice';
import { useApi } from '../../../contexts/ApiProvider';

const RemoveChannel = ({ closeModal }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const channelId = useSelector(modalsSelectors.selectChosenChannel);

  const removeChannel = async () => {
    setLoading(true);
    try {
      await api.removeChannel(channelId);
      toast.success(t('modals.removed'));
      closeModal();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.isAxiosError) {
        toast.error(t('errors.network'));
      } else toast.error(t('errors.unknown'));
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.confirm')}</p>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            type="button"
            onClick={closeModal}
            disabled={loading}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={removeChannel}
            disabled={loading}
          >
            {t('modals.delete')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default RemoveChannel;
