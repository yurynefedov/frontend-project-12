import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes';

const fetchInitialData = createAsyncThunk(
  'fetchInitialData',
  async (authHeader) => {
    const response = await axios.get(
      routes.dataPath(),
      { headers: authHeader },
    );

    return response.data;
  },
);

const channelsAdapter = createEntityAdapter();

const defaultCurrentChannelId = 1;

const initialState = {
  ...channelsAdapter.getInitialState(),
  currentChannelId: defaultCurrentChannelId,
  loading: false,
};

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    renameChannel: channelsAdapter.updateOne,
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
      if (state.currentChannelId === payload) {
        state.currentChannelId = defaultCurrentChannelId;
      }
    },
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        const { channels, currentChannelId } = payload;
        state.loading = false;
        channelsAdapter.addMany(state, channels);
        state.currentChannelId = currentChannelId;
      })
      .addCase(fetchInitialData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);

export const actions = { ...channelsSlice.actions, fetchInitialData };

export default channelsSlice.reducer;
