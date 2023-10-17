import { createSlice } from '@reduxjs/toolkit';
import { modes } from '../constants';

const initialState = {
    libraries: [],
    selectedLibrary: null,
    selectionMode: modes.all,
    selectionSettings: {
        count: false,
        showReset: false,
    },
    blocksInSelectedLibrary: [],
};

const library = createSlice({
    name: 'library',
    initialState,
    reducers: {
      initialize: (state, { payload }) => ({
        ...state,
        studioEndpointUrl: payload.studioEndpointUrl,
        lmsEndpointUrl: payload.lmsEndpointUrl,
        blockId: payload.blockId,
        learningContextId: payload.learningContextId,
        blockType: payload.blockType,
        blockValue: null,
      }),
      onSelectLibrary: (state, {payload}) => ({
        ...state,
        selectedLibrary: payload.selectedLibrary,
      }),
      onSelectionModeChange: (state, {payload}) => ({
        ...state,
        selectionMode: payload.selectionMode,
      }),
      onSelectionSettingsChange: (state,{payload})=>({
        ...state,
        selectionSettings:payload.selectionSettings,
      }),
    },
  });

const actions = StrictDict(app.actions);

const { reducer } = library;

export {
  actions,
  initialState,
  reducer,
};