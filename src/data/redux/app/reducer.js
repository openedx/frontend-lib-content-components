import { StrictDict } from 'utils';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blockValue: null,
  unitUrl: null,
  blockContent: null,
  saveResponse: null,

  studioEndpointUrl: null,
  blockId: null,
  courseId: null,
  blockType: null,
};

// eslint-disable-next-line no-unused-vars
const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initialize: (state, { payload }) => ({
      ...state,
      studioEndpointUrl: payload.studioEndpointUrl,
      blockId: payload.blockId,
      courseId: payload.courseId,
      blockType: payload.blockType,
    }),
    setUnitUrl: (state, { payload }) => ({ ...state, unitUrl: payload }),
    setBlockContent: (state, { payload }) => ({ ...state, blockContent: payload }),
    setSaveResponse: (state, { payload }) => ({ ...state, saveResponse: payload }),
  },
});

const actions = StrictDict(app.actions);

const { reducer } = app;

export {
  actions,
  initialState,
  reducer,
};
