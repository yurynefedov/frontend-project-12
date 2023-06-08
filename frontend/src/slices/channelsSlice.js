/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes';

const fetchInitialData = createAsyncThunk(
  'fetchInitialData',
  async (authHeader, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        routes.dataPath(),
        { headers: authHeader },
      );

      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        return rejectWithValue(error);
      }
      throw error;
    }
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

const selectors = channelsAdapter.getSelectors((state) => state.channels);

const customSelectors = {
  selectChannelNames: (state) => selectors.selectAll(state).map((channel) => channel.name),
  selectCurrentChannelId: (state) => {
    const { currentChannelId } = state.channels;
    return currentChannelId;
  },
  selectCurrentChannel: (state) => {
    const { currentChannelId } = state.channels;
    return selectors.selectAll(state).find((channel) => channel.id === currentChannelId);
  },
};

export const channelsSelectors = { ...selectors, ...customSelectors };

export const actions = { ...channelsSlice.actions, fetchInitialData };

export default channelsSlice.reducer;
