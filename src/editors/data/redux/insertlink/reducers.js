import { createSlice } from '@reduxjs/toolkit';
import { StrictDict } from '../../../utils';

const initialState = {
  selectedBlocks: {},
};

// eslint-disable-next-line no-unused-vars
const insertlink = createSlice({
  name: 'insertlink',
  initialState,
  reducers: {
    addBlock: (state, { payload }) => {
      state.selectedBlocks = { ...state.selectedBlocks, ...payload };
    },
  },
});

const actions = StrictDict(insertlink.actions);

const { reducer } = insertlink;

export {
  actions,
  initialState,
  reducer,
};
