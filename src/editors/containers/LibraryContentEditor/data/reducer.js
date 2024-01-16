import { createSlice } from '@reduxjs/toolkit';
import { modes } from '../constants';
import { StrictDict } from '../../../utils';

const initialState = {
  libraries: {},
  selectedLibraryId: null,
  savedLibraryId: null,
  settings: {
    // [libraryId]: initialLibrarySettings,
    //  This reducer structure allows selected settings
    //  to persist when user switches between libraries.
  },
};

const initialLibrarySettings = {
  version: null,
  mode: modes.random.value,
  count: -1,
  showReset: false,
  blocks: [],               // [ { id: 'id', display_name: 'name', block_type: 'type' } ]
  candidates: [],           // ['id1', 'id2']
  v1BlockRequests: {},      // { [blockId]: 'RequestkeyState' }
};

const library = createSlice({
  name: 'library',
  initialState,
  reducers: {
    initializeFromBlockValue: (state, { payload }) => ({
      ...state,
      savedLibraryId: payload.libraryId,
      selectedLibraryId: payload.libraryId,
      settings: payload.settings,
    }),
    addLibraries: (state, { payload }) => ({
      ...state,
      libraries: {
        ...state.libraries,
        ...payload.libraries,
      },
    }),
    initialLibrarySettings: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [payload.selectedLibraryId]: initialLibrarySettings,
      },
    }),
    setLibraryId: (state, { payload }) => ({
      ...state,
      selectedLibraryId: payload.selectedLibraryId,
    }),
    setLibraryVersion: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          version: payload.version,
        },
      },
    }),
    setModeForLibrary: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          mode: payload.mode,
        },
      },
    }),
    setCountForLibrary: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          count: payload.count,
        },
      },
    }),
    setShowResetForLibrary: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          showReset: payload.showReset,
        },
      },
    }),
    setLibraryBlocks: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          blocks: payload.blocks,
        },
      },
    }),
    setCandidatesForLibrary: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          candidates: payload.candidates,
        },
      },
    }),
    setV1BlockRequests: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          v1BlockRequests: payload.v1BlockRequests,
        },
      },
    }),
    updateV1BlockRequestStatus: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          v1BlockRequests: {
            ...state.settings[state.selectedLibraryId].v1BlockRequests,
            [payload.blockId]: payload.status,
          },
        },
      },
    }),
    addLibraryBlock: (state, { payload }) => ({
      ...state,
      settings: {
        ...state.settings,
        [state.selectedLibraryId]: {
          ...state.settings[state.selectedLibraryId],
          blocks: [
            ...state.settings[state.selectedLibraryId].blocks,
            payload.block,
          ],
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
  initialLibrarySettings,
  reducer,
};
