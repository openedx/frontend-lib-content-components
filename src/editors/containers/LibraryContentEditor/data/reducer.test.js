import {
  initialState,
  initialSettings,
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
        blocksInSelectedLibrary: 'SoME bLocKs',
      };
      expect(reducer(
        testingState,
        actions.initializeFromBlockValue({ ...data, other: 'field' }),
      )).toEqual({
        ...testingState,
        savedLibraryId: data.libraryId,
        selectedLibraryId: data.libraryId,
        selectedLibraryVersion: data.version,
        settings: data.settings,
      });
    });

    describe('Manipulate Library Data', () => {
      const testLibraryList = {
        lib1: { libValue: 'someVAL' },
        lib2: { property: 'sOmEproP' },
      };
      describe('loadLibraries adds to the list of libraries', () => {
        expect(reducer(testingState, actions.loadLibraries({ libraries: testLibraryList }))).toEqual({
          ...testingState,
          libraries: {
            ...testingState.libraries,
            ...testLibraryList,
          },
        });
      });
      describe('loadChildren sets the savedChildren', () => {
        const children = ['tEStChildRen'];
        expect(reducer(testingState, actions.loadChildren({ children }))).toEqual({
          ...testingState,
          savedChildren: children,
        });
      });
      describe('setLibraryId sets the id', () => {
        expect(reducer(testingState, actions.setLibraryId({ selectedLibraryId: testValue }))).toEqual({
          ...testingState,
          selectedLibraryId: testValue,
        });
      });
      describe('setLibraryVersion sets the library version', () => {
        expect(reducer(testingState, actions.setLibraryVersion({ version: testValue }))).toEqual({
          ...testingState,
          selectedLibraryVersion: testValue,
        });
      });
      describe('setLibraryBlocks sets the blocks for the library', () => {
        expect(reducer(testingState, actions.setLibraryBlocks({ blocks: testValue }))).toEqual({
          ...testingState,
          blocksInSelectedLibrary: testValue,
        });
      });
      describe('unloadLibrary sets library version, id, and blocks to null/[]', () => {
        expect(reducer(testingState, actions.unloadLibrary())).toEqual({
          ...testingState,
          selectedLibraryId: null,
          selectedLibraryVersion: null,
          blocksInSelectedLibrary: [],
        });
      });
    });
    describe('Library Settings Updates', () => {
      describe('initializeSettings sets the initial settings for an id', () => {
        expect(reducer(testingState, actions.initializeSettings({ selectedLibraryId: testValue }))).toEqual({
          ...testingState,
          settings: {
            ...testingState.settings,
            [testValue]: initialSettings,
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
