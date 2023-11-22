import { createSelector } from 'reselect';
import { modes } from '../constants';
import * as module from './selectors';

export const libraryState = (state) => state.library;

const mkSimpleSelector = (cb) => createSelector([module.libraryState], cb);

export const simpleSelectors = {
  libraries: mkSimpleSelector(library => library.libraries),
  selectedLibraryId: mkSimpleSelector(library => library.selectedLibraryId),
  selectedLibraryVersion: mkSimpleSelector(library => library.selectedLibraryVersion),
  settings: mkSimpleSelector(library => library.settings),
  blocksInSelectedLibrary: mkSimpleSelector(library => library.blocksInSelectedLibrary),
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
    if (!!selectedLibraryId) {
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
    if (!!selectedLibraryId) {
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
    blocksInSelectedLibrary,
  ) => {
    let manual = false;
    let shuffle = true;
    let count = null;
    let showReset = false;
    let candidates = [];
    if (selectedLibraryId && settings[selectedLibraryId]) {
      if (settings[selectedLibraryId].mode === modes.selected.value) {
        manual = true;
        shuffle = false;
      }
      count = settings[selectedLibraryId].count.toString();
      showReset = settings[selectedLibraryId].showReset;
      for (const [key, selected] of Object.entries(settings[selectedLibraryId].candidates)) {
        if (selected) {
          // candidates.push([ blocksInSelectedLibrary[key]?.block_type, blocksInSelectedLibrary[key]?.id ]);
          candidates.push(blocksInSelectedLibrary[key]?.id);
        }
      }
    }
    return {
      libraryId: selectedLibraryId,
      libraryVersion: selectedLibraryVersion,
      manual,
      shuffle,
      count,
      showReset,
      candidates,
    };
  },
);

export default {
  ...simpleSelectors,
  candidates,
  mode,
  libraryPayload,
};