/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const modalsAdapter = createEntityAdapter();

const initialState = {
  isOpen: false,
  type: null,
  data: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, { payload }) => {
      const { type, data } = payload;
      state.isOpen = true;
      state.type = type;
      state.data = data ?? null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.data = null;
    },
  },
});

const selectors = modalsAdapter.getSelectors((state) => state.messages);

const customSelectors = {
  selectChosenChannel: (state) => state.modal.data?.channelId,
};

export const modalsSelectors = { ...selectors, ...customSelectors };

export const { actions } = modalSlice;
export default modalSlice.reducer;
