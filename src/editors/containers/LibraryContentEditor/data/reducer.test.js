import {
  initialState,
  initialLibrarySettings,
  actions,
  reducer,
} from './reducer';

const testingState = {
  ...initialState,
  selectedLibraryId: 'libID',
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

      describe('setLibraryId sets the id', () => {
        expect(reducer(testingState, actions.setLibraryId({ selectedLibraryId: testValue }))).toEqual({
          ...testingState,
          selectedLibraryId: testValue,
        });
      });
    });

    describe('Library Settings Updates', () => {
      const stateWithSettings = {
        ...testingState,
        settings: {
          [testingState.selectedLibraryId]: {
            blocks: [],
            v1BlockRequests: {},
          },
        },
      };

      describe('initialLibrarySettings sets the initial settings for an id', () => {
        expect(reducer(testingState, actions.initialLibrarySettings({ selectedLibraryId: testValue }))).toEqual({
          ...testingState,
          settings: {
            ...testingState.settings,
            [testValue]: initialLibrarySettings,
          },
        });
      });

      describe('addLibraryBlock adds a block for the library', () => {
        expect(reducer(stateWithSettings, actions.addLibraryBlock({ block: 'newBloC' }))).toEqual({
          ...stateWithSettings,
          settings: {
            ...stateWithSettings.settings,
            [stateWithSettings.selectedLibraryId]: {
              ...stateWithSettings.settings[stateWithSettings.selectedLibraryId],
              blocks: [
                ...stateWithSettings.settings[stateWithSettings.selectedLibraryId].blocks,
                'newBloC',
              ],
            },
          },
        });
      });

      describe('updateV1BlockRequestStatus updates the status of a v1 block request', () => {
        expect(reducer(stateWithSettings, actions.updateV1BlockRequestStatus({ blockId: 'somebloc', status: 'stat' }))).toEqual({
          ...stateWithSettings,
          settings: {
            ...stateWithSettings.settings,
            [stateWithSettings.selectedLibraryId]: {
              ...stateWithSettings.settings[stateWithSettings.selectedLibraryId],
              v1BlockRequests: {
                ...stateWithSettings.settings[stateWithSettings.selectedLibraryId].v1BlockRequests,
                somebloc: 'stat',
              },
            },
          },
        });
      });

      const testSettingsChanges = {
        libraryId: 'a lIb id',
        version: 'veR',
        mode: 'a MOdE',
        count: 'A iNT',
        showReset: 'a vaLue',
        blocks: ['bunchoblocks'],
        candidates: ['sOme CandiDates'],
        v1BlockRequests: { mockBlock: 'mockstatus' },
      };
      const setterTest = (action, target) => describe('action', () => {
        describe(`load ${target} from payload`, () => {
          expect(reducer(testingState, actions[action](testSettingsChanges))).toEqual({
            ...testingState,
            settings: {
              ...testingState.settings,
              [testingState.selectedLibraryId]: {
                [target]: testSettingsChanges[target],
              },
            },
          });
        });
      });
      [
        ['setLibraryVersion', 'version'],
        ['setModeForLibrary', 'mode'],
        ['setCountForLibrary', 'count'],
        ['setShowResetForLibrary', 'showReset'],
        ['setLibraryBlocks', 'blocks'],
        ['setCandidatesForLibrary', 'candidates'],
        ['setV1BlockRequests', 'v1BlockRequests'],
      ].map(args => setterTest(...args));
    });
  });
});
