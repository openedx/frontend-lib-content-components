import { createSelector } from 'reselect';
import { modes } from '../constants';
import { getUsageKey } from '../utils';
import * as module from './selectors';

export const libraryState = (state) => state.library;

const mkSimpleSelector = (cb) => createSelector([module.libraryState], cb);

export const simpleSelectors = {
  libraries: mkSimpleSelector(library => library.libraries),
  savedLibraryId: mkSimpleSelector(library => library.savedLibraryId),
  selectedLibraryId: mkSimpleSelector(library => library.selectedLibraryId),
  settings: mkSimpleSelector(library => library.settings),
};

export const blocks = createSelector(
  [
    module.simpleSelectors.selectedLibraryId,
    module.simpleSelectors.settings,
  ],
  (
    selectedLibraryId,
    settings,
  ) => {
    if (selectedLibraryId) {
      return settings[selectedLibraryId]?.blocks ?? [];
    }
    return [];
  },
);

export const v1BlockRequests = createSelector(
  [
    module.simpleSelectors.selectedLibraryId,
    module.simpleSelectors.settings,
  ],
  (
    selectedLibraryId,
    settings,
  ) => {
    if (selectedLibraryId) {
      return settings[selectedLibraryId]?.v1BlockRequests ?? {};
    }
    return [];
  },
);

export const candidates = createSelector(
  [
    module.simpleSelectors.selectedLibraryId,
    module.simpleSelectors.settings,
  ],
  (
    selectedLibraryId,
    settings,
  ) => {
    if (selectedLibraryId) {
      return settings[selectedLibraryId]?.candidates ?? [];
    }
    return [];
  },
);

export const mode = createSelector(
  [
    module.simpleSelectors.selectedLibraryId,
    module.simpleSelectors.settings,
  ],
  (
    selectedLibraryId,
    settings,
  ) => {
    if (selectedLibraryId) {
      return settings[selectedLibraryId]?.mode ?? modes.random.value;
    }
    return modes.random.value;
  },
);

export const libraryPayload = createSelector(
  [
    module.simpleSelectors.selectedLibraryId,
    module.simpleSelectors.settings,
  ],
  (
    selectedLibraryId,
    settings,
  ) => {
    let manual = false;
    let shuffle = true;
    let count = null;
    if (selectedLibraryId && settings[selectedLibraryId]) {
      count = settings[selectedLibraryId].count ?? 1;
      if (settings[selectedLibraryId].mode === modes.selected.value) {
        manual = true;
        shuffle = false;
        count = -1;
      }
    }
    return {
      libraryId: selectedLibraryId,
      libraryVersion: settings[selectedLibraryId]?.version,
      manual,
      shuffle,
      count,
      showReset: settings[selectedLibraryId]?.showReset,
      candidates: settings[selectedLibraryId]?.candidates || [],
    };
  },
);

export default {
  ...simpleSelectors,
  blocks,
  candidates,
  mode,
  libraryPayload,
  v1BlockRequests,
};
