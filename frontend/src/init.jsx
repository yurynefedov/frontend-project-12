import React from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider as StoreProvider } from 'react-redux';
import leoProfanity from 'leo-profanity';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import ApiProvider from './contexts/ApiProvider';
import App from './components/App';
import store, { actions } from './slices/index.js';
import resources from './locales/index.js';

const init = async (socket) => {
  const russianDictionary = leoProfanity.getDictionary('ru');
  leoProfanity.add(russianDictionary);

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
    environment: 'production',
    captureUncaught: true,
    captureUnhandledRejections: true,
    addErrorContext: true,
    captureIp: true,
  };

  socket.on('newMessage', (message) => {
    store.dispatch(actions.addMessage(message));
  });
  socket.on('newChannel', (channel) => {
    store.dispatch(actions.addChannel(channel));
    store.dispatch(actions.setCurrentChannel(channel.id));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(actions.removeChannel(id));
  });
  socket.on('renameChannel', ({ id, name }) => {
    store.dispatch(actions.renameChannel({ id, changes: { name } }));
  });

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <StoreProvider store={store}>
          <I18nextProvider i18n={i18n}>
            <ApiProvider socket={socket}>
              <App />
            </ApiProvider>
          </I18nextProvider>
        </StoreProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
