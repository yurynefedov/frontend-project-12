import { configureStore } from '@reduxjs/toolkit';

import channelsReducer, { actions as channelsActions } from './channelsSlice.js';
import messagesReducer, { actions as messagesActions } from './messagesSlice.js';
import modalReducer, { actions as modalActions } from './modalSlice.js';

const actions = {
  ...channelsActions,
  ...messagesActions,
  ...modalActions,
};

export { actions };

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
  },
});
