/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

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

export const { actions } = modalSlice;
export default modalSlice.reducer;
