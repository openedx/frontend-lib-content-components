import { createSlice } from '@reduxjs/toolkit';
import { modes } from '../constants';
import { StrictDict } from '../../../utils';

const initialState = {
  libraries: {},
  selectedLibraryId: null,
  selectedLibraryVersion: null,
  settings: {
    // [libraryId]: initialSettings,
    //  This reducer structure allows selected settings
    //  to persist when user switches between libraries.
  },
  blocksInSelectedLibrary: [],

  // The following two states are only loaded from a previously saved editor.
  savedLibraryId: null,
  savedChildren: [],
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
      savedLibraryId: payload.libraryId,
      selectedLibraryId: payload.libraryId,
      selectedLibraryVersion: payload.version,
      settings: payload.settings,
    }),
    loadLibraries: (state, { payload }) => ({
      ...state,
      libraries: {
        ...state.libraries,
        ...payload.libraries,
      },
    }),
    unloadLibrary: (state) => ({
      ...state,
      selectedLibraryId: null,
      selectedLibraryVersion: null,
      blocksInSelectedLibrary: [],
    }),
    loadChildren: (state, { payload }) => ({
      ...state,
      savedChildren: payload.children,
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
    setModeForLibrary: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.libraryId]: {
          ...state.settings[payload.libraryId],
          mode: payload.mode,
        },
      },
    }),
    setCountForLibrary: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.libraryId]: {
          ...state.settings[payload.libraryId],
          count: payload.count,
        },
      },
    }),
    setShowResetForLibrary: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.libraryId]: {
          ...state.settings[payload.libraryId],
          showReset: payload.showReset,
        },
      },
    }),
    setCandidatesForLibrary: (state, { payload }) => ({
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
  initialSettings,
  reducer,
};
