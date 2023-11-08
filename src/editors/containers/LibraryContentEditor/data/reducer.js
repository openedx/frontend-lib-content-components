import { createSlice } from '@reduxjs/toolkit';
import { modes } from '../constants';
import { StrictDict } from '../../../utils';

const initialState = {
  libraries: [],
  selectedLibrary: null,
  selectedLibraryId: null,
  selectedLibraryVersion: null,
  settings: {
    // [libraryId]: { 
    //   mode: modes.random.value,
    //   count: -1,
    //   showReset: false,
    //   candidates: {},
    // },
    // This reducer structure allows selected settings 
    // to persist when user switches between libraries.
  },
  blocksInSelectedLibrary: [],
};

const initialSettings = {
  mode: modes.random.value,
  count: -1,
  showReset: false,
  candidates: {},
};

const library = createSlice({
  name: 'library',
  initialState,
  reducers: {
    initialize: (state, { payload }) => ({
      ...state,
      libraries: payload.libraries,
      selectedLibrary: payload.selectedLibrary,
      selectedLibraryId: payload.selectedLibraryId,
      selectedLibraryVersion: payload.selectedLibraryVersion,
      settings: {
        ...state.settings,
        [payload.selectedLibraryId]: payload.settings,
      },
      blocksInSelectedLibrary: payload.blocksInSelectedLibrary,
    }),
    loadLibrary: (state, { payload }) => ({
      ...state,
      selectedLibraryId: payload.id,
      selectedLibraryVersion: payload.version,
      settings: {
        ...state.settings,
        [payload.id]: payload.settings,
      },
      blocksInSelectedLibrary: payload.blocks,
    }),
    unloadLibrary: (state) => ({
      ...state,
      selectedLibraryId: null,
      selectedLibraryVersion: null,
      blocksInSelectedLibrary: [],
    }),
    onSelectLibrary: (state, { payload }) => ({
      ...state,
      selectedLibrary: payload.selectedLibrary,
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
