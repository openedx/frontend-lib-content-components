import { createSelector } from 'reselect';
import { modes } from '../constants';
import * as module from './selectors';

const USAGE_ID_REGEX = '[^:]+$';

export const libraryState = (state) => state.library;

const mkSimpleSelector = (cb) => createSelector([module.libraryState], cb);

export const simpleSelectors = {
  libraries: mkSimpleSelector(library => library.libraries),
  savedChildren: mkSimpleSelector(library => library.savedChildren),
  savedLibraryId: mkSimpleSelector(library => library.savedLibraryId),
  selectedLibraryId: mkSimpleSelector(library => library.selectedLibraryId),
  selectedLibraryVersion: mkSimpleSelector(library => library.selectedLibraryVersion),
  settings: mkSimpleSelector(library => library.settings),
  blocksInSelectedLibrary: mkSimpleSelector(library => library.blocksInSelectedLibrary),
  v1LibraryBlockIds: mkSimpleSelector(library => library.v1LibraryBlockIds),
};

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
    module.simpleSelectors.selectedLibraryVersion,
    module.simpleSelectors.settings,
    module.simpleSelectors.blocksInSelectedLibrary,
  ],
  (
    selectedLibraryId,
    selectedLibraryVersion,
    settings,
  ) => {
    let manual = false;
    let shuffle = true;
    let count = null;
    let showReset = false;
    let candidateList = [];
    if (selectedLibraryId && settings[selectedLibraryId]) {
      count = settings[selectedLibraryId].count ?? 1;
      if (settings[selectedLibraryId].mode === modes.selected.value) {
        manual = true;
        shuffle = false;
        count = -1;
      }
      showReset = settings[selectedLibraryId].showReset;
      candidateList = settings[selectedLibraryId].candidates;
      candidateList = candidateList.map(candidate => {
        const usageId = candidate[1].match(USAGE_ID_REGEX)[0];
        return [candidate[0], usageId];
      });
    }
    return {
      libraryId: selectedLibraryId,
      libraryVersion: selectedLibraryVersion,
      manual,
      shuffle,
      count,
      showReset,
      candidates: candidateList,
    };
  },
);

export default {
  ...simpleSelectors,
  candidates,
  mode,
  libraryPayload,
};
