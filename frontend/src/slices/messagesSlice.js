import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, action) => {
        const restMessages = Object.values(state.entities)
          .filter(({ channelId }) => channelId !== action.payload);
        messagesAdapter.setAll(state, restMessages);
      })
      .addCase(channelsActions.fetchInitialData.fulfilled, (state, action) => {
        const { messages } = action.payload;
        messagesAdapter.addMany(state, messages);
      });
  },
});

const selectors = messagesAdapter.getSelectors((state) => state.messages);

const customSelectors = {
  selectCurrentChannelMessages: (state) => {
    const { currentChannelId } = state.channels;
    return selectors.selectAll(state).filter((message) => message.channelId === currentChannelId);
  },
};

export const messagesSelectors = { ...selectors, ...customSelectors };

export const { actions } = messagesSlice;

export default messagesSlice.reducer;
