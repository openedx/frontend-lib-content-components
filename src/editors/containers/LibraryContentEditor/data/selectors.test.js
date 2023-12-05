import * as selectors from './selectors';
import { keyStore } from '../../../utils';
import modes from '../constants';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const testState = { some: 'arbitraryValue' };
const testValue = 'my VALUE';

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

  describe('libraryPayload', () => {
    it('is memoized based on the below listed selectors', () => {
      expect(selectors.libraryPayload.preSelectors).toEqual([
        simpleSelectors.selectedLibraryId,
        simpleSelectors.selectedLibraryVersion,
        simpleSelectors.settings,
        simpleSelectors.blocksInSelectedLibrary,
      ]);
    });
    it('returns the relevant settings values given the library', () => {
      const { cb } = selectors.libraryPayload;
      const selectedLibraryId = 'a LiB iD';
      const blockId1 = 'a bLOCk id';
      const blockType1 = 'a BLOck Type';
      const blockId2 = 'a blocK ID tOO';
      const blockType2 = 'a Different BLOck Type';
      const testData = {
        selectedLibraryId,
        selectedLibraryVersion: 'a lIb VERsion',
        settings: {
          [selectedLibraryId]: {
            candidates: [blockId1, blockId2],
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
        manual,
        shuffle,
        count: testData.settings[selectedLibraryId].count,
        showReset: testData.settings[selectedLibraryId].showReset,
        candidates: [[blockType1, blockId1], [blockType2, blockId2]],
      });
    });
  });
});
