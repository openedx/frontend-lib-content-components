import {
  initialState,
  initialLibrarySettings,
  actions,
  reducer,
} from './reducer';

const testingState = {
  ...initialState,
  arbitraryField: 'arbitrary',
};

describe('app reducer', () => {
  it('has initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  const testValue = 'Hiatus Kaiyote';

  describe('handling actions', () => {
    it('loads initial input fields into the store', () => {
      const data = {
        libraries: 'soMe LibS',
        libraryId: 'anOther lIb Id',
        version: 'a lib veRsioN (oFteN an Int)',
        settings: {
          value: 'sOmE sETTings vAlue',
        },
      };
      expect(reducer(
        testingState,
        actions.initializeFromBlockValue({ ...data, other: 'field' }),
      )).toEqual({
        ...testingState,
        savedLibraryId: data.libraryId,
        selectedLibraryId: data.libraryId,
        settings: data.settings,
      });
    });

    describe('Manipulate Library Data', () => {
      const testLibraryList = {
        lib1: { libValue: 'someVAL' },
        lib2: { property: 'sOmEproP' },
      };
      describe('addLibraries adds to the list of libraries', () => {
        expect(reducer(testingState, actions.addLibraries({ libraries: testLibraryList }))).toEqual({
          ...testingState,
          libraries: {
            ...testingState.libraries,
            ...testLibraryList,
          },
        });
      });
      describe('loadV1LibraryBlockIds saves block ids to v1BlockRequests', () => {
        const blockIds = ['somv1id'];
        expect(reducer(testingState, actions.loadV1LibraryBlockIds({ blockIds }))).toEqual({
          ...testingState,
          v1BlockRequests: blockIds,
        });
      });
      describe('setLibraryId sets the id', () => {
        expect(reducer(testingState, actions.setLibraryId({ selectedLibraryId: testValue }))).toEqual({
          ...testingState,
          selectedLibraryId: testValue,
        });
      });
      describe('setLibraryBlocks sets the blocks for the library', () => {
        expect(reducer(testingState, actions.setLibraryBlocks({ blocks: testValue }))).toEqual({
          ...testingState,
          blocksInSelectedLibrary: testValue,
        });
      });
      describe('addLibraryBlock adds a block for the library', () => {
        const block = 'newBlock';
        expect(reducer(testingState, actions.addLibraryBlock({ block }))).toEqual({
          ...testingState,
          blocksInSelectedLibrary: [
            ...testingState.blocksInSelectedLibrary,
            block,
          ],
        });
      });
    });
    describe('Library Settings Updates', () => {
      describe('initialLibrarySettings sets the initial settings for an id', () => {
        expect(reducer(testingState, actions.initialLibrarySettings({ selectedLibraryId: testValue }))).toEqual({
          ...testingState,
          settings: {
            ...testingState.settings,
            [testValue]: initialLibrarySettings,
          },
        });
      });

      const testSettingsChanges = {
        libraryId: 'a lIb id',
        mode: 'a MOdE',
        count: 'A iNT',
        showReset: 'a vaLue',
        candidates: 'sOme CandiDates',
      };
      const setterTest = (action, target) => describe('action', () => {
        describe(`load ${target} from payload`, () => {
          expect(reducer(testingState, actions[action](testSettingsChanges))).toEqual({
            ...testingState,
            settings: {
              ...testingState.settings,
              [testSettingsChanges.libraryId]: {
                [target]: testSettingsChanges[target],
              },
            },
          });
        });
      });
      [
        ['setModeForLibrary', 'mode'],
        ['setCountForLibrary', 'count'],
        ['setShowResetForLibrary', 'showReset'],
        ['setCandidatesForLibrary', 'candidates'],
      ].map(args => setterTest(...args));
    });
  });
});
