import { createSlice } from '@reduxjs/toolkit';
import { modes } from '../constants';
import { StrictDict } from '../../../utils';

const initialState = {
  libraries: [],
  selectedLibrary: null,
  selectionMode: modes.all,
  selectionSettings: {
    count: false,
    showReset: false,
    //max count?
  },
  blocksInSelectedLibrary: [],
};

const library = createSlice({
  name: 'library',
  initialState,
  reducers: {
    initialize: (state, { payload }) => ({
      ...state,
      libraries: payload.libraries,
      selectedLibrary: payload.selectedLibrary,
      selectionMode: payload.selectionMode,
      selectionSettings: payload.selectionSettings,
    }),
    onSelectLibrary: (state, { payload }) => ({
      ...state,
      selectedLibrary: payload.selectedLibrary,
    }),
    onSelectionModeChange: (state, { payload }) => ({
      ...state,
      selectionMode: payload.selectionMode,
    }),
    onShowResetSettingsChange: (state, { payload }) => ({
      ...state,
      selectionSettings: {
        ...state.selectionSettings,
        showReset: payload.showReset,
      },
    }),
    onCountSettingsChange: (state, { payload }) => ({
      ...state,
      selectionSettings: {
        ...state.selectionSettings,
        count: payload.count,
      },
    }),
    loadBlocksInLibrary: (state, { payload }) => ({
      ...state,
      blocksInSelectedLibrary: payload.blocks,
    }),
  },
});

const actions = StrictDict(library.actions);

const { reducer } = library;

export {
  actions,
  initialState,
  reducer,
};
