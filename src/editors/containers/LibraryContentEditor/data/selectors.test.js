import * as selectors from './selectors';
import { keyStore } from '../../../utils';
import modes from '../constants';

jest.mock('reselect', () => ({
  createSelector: jest.fn((preSelectors, cb) => ({ preSelectors, cb })),
}));

const testState = { some: 'arbitraryValue' };
const testValue = 'my VALUE';
const selectedLibraryId = 'a LiB iD';
const blockId1 = 'block-v1:a bLOCk@id@1usageid';
const blockName1 = 'nam1';
const blockType1 = 'a BLOck Type';
const blockId2 = 'lb:a blocK ID:tOO:2usageid';
const blockName2 = 'name2';
const blockType2 = 'a Different BLOck Type';
const testData = {
  savedLibraryId: selectedLibraryId,
  selectedLibraryId,
  settings: {
    [selectedLibraryId]: {
      version: 0,
      mode: modes.selected.value,
      count: 123456,
      showReset: 'sHOw ReseT',
      blocks: [
        {
          id: blockId1,
          display_name: blockName1,
          block_type: blockType1,
        },
        {
          id: blockId2,
          block_type: blockType2,
          display_name: blockName2,
        },
      ],
      candidates: [blockId1, blockId2],
      v1BlockRequests: {},
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
        simpleKeys.savedLibraryId,
        simpleKeys.selectedLibraryId,
        simpleKeys.settings,
      ].map(testSimpleSelector);
    });
  });

  describe('blocks', () => {
    const { cb } = selectors.blocks;
    it('is memoized based on the below listed selectors', () => {
      expect(selectors.blocks.preSelectors).toEqual([
        simpleSelectors.selectedLibraryId,
        simpleSelectors.settings,
      ]);
    });
    it('returns the blocks list for the selected library', () => {
      expect(
        cb(
          testData.selectedLibraryId,
          testData.settings,
        ),
      ).toEqual(testData.settings[selectedLibraryId].blocks);
    });
    it('returns an empty array when there is no selected library', () => {
      expect(cb(null, testData.settings)).toEqual([]);
    });
  });

  describe('v1BlockRequests', () => {
    const { cb } = selectors.v1BlockRequests;
    it('is memoized based on the below listed selectors', () => {
      expect(selectors.v1BlockRequests.preSelectors).toEqual([
        simpleSelectors.selectedLibraryId,
        simpleSelectors.settings,
      ]);
    });
    it('returns the v1BlockRequests for the selected library', () => {
      expect(
        cb(
          testData.selectedLibraryId,
          testData.settings,
        ),
      ).toEqual(testData.settings[selectedLibraryId].v1BlockRequests);
    });
    it('returns an empty object when there is no selected library', () => {
      expect(cb(null, testData.settings)).toEqual({});
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
        simpleSelectors.settings,
      ]);
    });
    it('returns the relevant settings values given the library for selected mode', () => {
      expect(
        cb(
          testData.selectedLibraryId,
          testData.settings,
        ),
      ).toEqual({
        libraryId: selectedLibraryId,
        libraryVersion: testData.settings[selectedLibraryId].version,
        manual: true,
        shuffle: false,
        count: -1,
        showReset: testData.settings[selectedLibraryId].showReset,
        candidates: [blockId1, blockId2],
      });
    });
    it('returns the relevant settings values given the library for random mode', () => {
      testData.settings[selectedLibraryId].mode = modes.random.value;
      expect(
        cb(
          testData.selectedLibraryId,
          testData.settings,
        ),
      ).toEqual({
        libraryId: selectedLibraryId,
        libraryVersion: testData.settings[selectedLibraryId].version,
        manual: false,
        shuffle: true,
        count: testData.settings[selectedLibraryId].count,
        showReset: testData.settings[selectedLibraryId].showReset,
        candidates: [blockId1, blockId2],
      });
    });
  });
});
