import React from 'react';
import { useTranslation } from 'react-i18next';

import notFoundImage from '../assets/notFoundImage.svg';

const NotFound = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'notFound' });

  return (
    <div className="text-center">
      <img className="img-fluid h-25" src={notFoundImage} alt={t('header')} />
      <h1 className="h4 text-muted">
        {t('header')}
      </h1>
      <p className="text-muted">
        {t('redirectionText')}
        {' '}
        <a href="/">{t('redirectionLink')}</a>
      </p>
    </div>
  );
};

export default NotFound;
