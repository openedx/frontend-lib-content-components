import { createSelector } from 'reselect';
import * as module from './selectors';

export const libraryState = (state) => state.library;

const mkSimpleSelector = (cb) => createSelector([module.libraryState], cb);

export const simpleSelectors = {
  libraries: mkSimpleSelector(library => library.libraries),
  selectedLibrary: mkSimpleSelector(library => library.selectedLibrary),
  selectedLibraryId: mkSimpleSelector(library => library.selectedLibraryId),
  selectedLibraryVersion: mkSimpleSelector(library => library.selectedLibraryVersion),
  settings: mkSimpleSelector(library => library.settings),
  blocksInSelectedLibrary: mkSimpleSelector(library => library.blocksInSelectedLibrary),
};

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
    let count = 0;
    let showReset = false;
    let candidates = [];
    if (selectedLibraryId && settings[selectedLibraryId]) {
      count = settings[selectedLibraryId].count;
      showReset = settings[selectedLibraryId].showReset;
      for (const [key, value] of Object.entries(settings[selectedLibraryId].candidates)) {
        if (value) {
          candidates.push([ blocksInSelectedLibrary[key]?.block_type, blocksInSelectedLibrary[key]?.id ]);
        }
      }
    }
    return {
      libraryId: selectedLibraryId,
      libraryVersion: selectedLibraryVersion,
      count,
      showReset,
      candidates,
    };
  },
);

export default {
  ...simpleSelectors,
  libraryPayload,
};