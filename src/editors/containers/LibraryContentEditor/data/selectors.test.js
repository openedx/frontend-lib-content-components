import * as selectors from './selectors';
import { keyStore } from '../../../utils';
import modes from '../constants';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const testState = { some: 'arbitraryValue' };
const testValue = 'my VALUE';
const selectedLibraryId = 'a LiB iD';
const blockId1 = 'a bLOCk id:1usageid';
const blockType1 = 'a BLOck Type';
const blockUsageId1 = '1usageid';
const blockId2 = 'a blocK ID tOO:2usageid';
const blockType2 = 'a Different BLOck Type';
const blockUsageId2 = '2usageid';
const testData = {
  savedChildren: {
    0: {
      block_type: blockId1,
      id: blockId1,
    },
  },
  savedLibraryId: selectedLibraryId,
  selectedLibraryId,
  selectedLibraryVersion: 'a lIb VERsion',
  settings: {
    [selectedLibraryId]: {
      candidates: [[blockType1, blockId1], [blockType2, blockId2]],
      count: 123456,
      mode: modes.selected.value,
      showReset: 'sHOw ReseT',
    },
  },
  blocksInSelectedLibrary: {
    0: {
      block_type: blockType1,
      id: blockId1,
    },
    1: {
      block_type: blockType2,
      id: blockId2,
    },
  },
};

describe('Library Selectors', () => {
  const {
    libraryState,
    simpleSelectors,
  } = selectors;
  describe('Simple Selectors', () => {
    const testSimpleSelector = (key) => {
      test(`${key} simpleSelector returns its value from the app store`, () => {
        const { preSelectors, cb } = simpleSelectors[key];
        expect(preSelectors).toEqual([libraryState]);
        expect(cb({ ...testState, [key]: testValue })).toEqual(testValue);
      });
    };
    const simpleKeys = keyStore(simpleSelectors);
    describe('simple selectors link their values from app store', () => {
      [
        simpleKeys.libraries,
        simpleKeys.selectedLibraryId,
        simpleKeys.selectedLibraryVersion,
        simpleKeys.settings,
        simpleKeys.blocksInSelectedLibrary,
      ].map(testSimpleSelector);
    });
  });

  describe('candidates', () => {
    const { cb } = selectors.candidates;
    it('is memoized based on the below listed selectors', () => {
      expect(selectors.candidates.preSelectors).toEqual([
        simpleSelectors.selectedLibraryId,
        simpleSelectors.settings,
      ]);
    });
    it('returns the candidates list for the selected library', () => {
      expect(
        cb(
          testData.selectedLibraryId,
          testData.settings,
        ),
      ).toEqual(testData.settings[selectedLibraryId].candidates);
    });
    it('returns an empty array when there is no selected library', () => {
      expect(cb(null, testData.settings)).toEqual([]);
    });
  });

  describe('mode', () => {
    const { cb } = selectors.mode;
    it('is memoized based on the below listed selectors', () => {
      expect(selectors.mode.preSelectors).toEqual([
        simpleSelectors.selectedLibraryId,
        simpleSelectors.settings,
      ]);
    });
    it('returns the mode for the selected library', () => {
      expect(
        cb(
          testData.selectedLibraryId,
          testData.settings,
        ),
      ).toEqual(testData.settings[selectedLibraryId].mode);
    });
    it('returns random mode when there is no selected library', () => {
      expect(cb(null, testData.settings)).toEqual(modes.random.value);
    });
  });

  describe('libraryPayload', () => {
    const { cb } = selectors.libraryPayload;
    it('is memoized based on the below listed selectors', () => {
      expect(selectors.libraryPayload.preSelectors).toEqual([
        simpleSelectors.selectedLibraryId,
        simpleSelectors.selectedLibraryVersion,
        simpleSelectors.settings,
        simpleSelectors.blocksInSelectedLibrary,
      ]);
    });
    it('returns the relevant settings values given the library for selected mode', () => {
      expect(
        cb(
          testData.selectedLibraryId,
          testData.selectedLibraryVersion,
          testData.settings,
          testData.blocksInSelectedLibrary,
        ),
      ).toEqual({
        libraryId: selectedLibraryId,
        libraryVersion: testData.selectedLibraryVersion,
        manual: true,
        shuffle: false,
        count: -1,
        showReset: testData.settings[selectedLibraryId].showReset,
        candidates: [[blockType1, blockUsageId1], [blockType2, blockUsageId2]],
      });
    });
    it('returns the relevant settings values given the library for random mode', () => {
      testData.settings[selectedLibraryId].mode = modes.random.value;
      expect(
        cb(
          testData.selectedLibraryId,
          testData.selectedLibraryVersion,
          testData.settings,
          testData.blocksInSelectedLibrary,
        ),
      ).toEqual({
        libraryId: selectedLibraryId,
        libraryVersion: testData.selectedLibraryVersion,
        manual: false,
        shuffle: true,
        count: testData.settings[selectedLibraryId].count,
        showReset: testData.settings[selectedLibraryId].showReset,
        candidates: [[blockType1, blockUsageId1], [blockType2, blockUsageId2]],
      });
    });
  });
});
