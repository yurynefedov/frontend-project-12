import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import routes from '../routes';

import unknownErrorImage from '../assets/unknownErrorImage.svg';

const UnknownError = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'errors' });

  const preventScroll = { overflow: 'hidden' };

  return (
    <div className="text-center d-flex flex-column align-items-center justify-content-center" style={preventScroll}>
      <img className="img-fluid h-25" src={unknownErrorImage} alt={t('unknown')} />
      <h1 className="h4 text-muted mt-3">
        {t('goesWrong')}
      </h1>
      <p className="text-muted">
        {t('refreshText')}
      </p>
      <Button as={Link} to={routes.chatPagePath()}>{t('refreshButton')}</Button>
    </div>
  );
};

export default UnknownError;
