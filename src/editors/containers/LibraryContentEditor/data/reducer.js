import { createSlice } from '@reduxjs/toolkit';
import { modes } from '../constants';
import { StrictDict } from '../../../utils';

const initialState = {
  libraries: [],
  selectedLibraryId: null,
  selectedLibraryVersion: null,
  settings: {
    // [libraryId]: initialSettings,
    //  This reducer structure allows selected settings
    //  to persist when user switches between libraries.
  },
  blocksInSelectedLibrary: [],
};

const initialSettings = {
  mode: modes.random.value,
  count: -1,
  showReset: false,
  candidates: [],
};

const library = createSlice({
  name: 'library',
  initialState,
  reducers: {
    initializeFromBlockValue: (state, { payload }) => ({
      ...state,
      selectedLibraryId: payload.selectedLibraryId,
      selectedLibraryVersion: payload.version,
      settings: payload.settings,
    }),
    loadLibraryList: (state, { payload }) => ({
      ...state,
      libraries: payload.libraries,
    }),
    setLibraryId: (state, { payload }) => ({
      ...state,
      selectedLibraryId: payload.selectedLibraryId,
    }),
    setLibraryVersion: (state, { payload }) => ({
      ...state,
      selectedLibraryVersion: payload.version,
    }),
    setLibraryBlocks: (state, { payload }) => ({
      ...state,
      blocksInSelectedLibrary: payload.blocks,
    }),
    initializeSettings: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.selectedLibraryId]: initialSettings,
      },
    }),
    unloadLibrary: (state) => ({
      ...state,
      selectedLibraryId: null,
      selectedLibraryVersion: null,
      blocksInSelectedLibrary: [],
    }),
    onModeChange: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.libraryId]: {
          ...state.settings[payload.libraryId],
          mode: payload.mode,
        },
      },
    }),
    onCountChange: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.libraryId]: {
          ...state.settings[payload.libraryId],
          count: payload.count,
        },
      },
    }),
    onShowResetChange: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.libraryId]: {
          ...state.settings[payload.libraryId],
          showReset: payload.showReset,
        },
      },
    }),
    onCandidatesChange: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.libraryId]: {
          ...state.settings[payload.libraryId],
          candidates: payload.candidates,
        },
      },
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
