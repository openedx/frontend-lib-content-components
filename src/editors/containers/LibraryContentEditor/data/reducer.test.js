import { initialState, actions, reducer } from './reducer';

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
      const libId = 'anOther lIb Id';
      const data = {
        libraries: 'soMe LibS',
        selectedLibraryId: libId,
        selectedLibraryVersion: 'a lib veRsioN (oFteN an Int)',
        settings: {
          value: 'sOmE sETTings vAlue',
        },
        blocksInSelectedLibrary: 'SoME bLocKs',
      };
      expect(reducer(
        testingState,
        actions.initialize({ ...data, other: 'field' }),
      )).toEqual({
        ...testingState,
        ...data,
        settings: {
          [libId]: {
            ...data.settings,
          },
        },
      });
    });

    describe('Manipulate Library Data', () => {
      const testLib = {
        id: 'a lIb id',
        version: 'a lib veRsioN (oFteN an Int)',
        settings: { value: testValue },
        blocks: ['b1', 'b2'],
        other: 'data',
      };
      it('LoadLibrary sets selected library, which has a version, id, blocks, and settings.', () => {
        expect(reducer(testingState, actions.loadLibrary(testLib))).toEqual({
          ...testingState,
          selectedLibraryId: testLib.id,
          selectedLibraryVersion: testLib.version,
          settings: {
            ...testingState.settings,
            [testLib.id]: testLib.settings,
          },
          blocksInSelectedLibrary: testLib.blocks,
        });
      });
      it('unloadLibrary sets library version, id, and blocks to null/[]', () => {
        expect(reducer(testingState, actions.unloadLibrary())).toEqual({
          ...testingState,
          selectedLibraryId: null,
          selectedLibraryVersion: null,
          blocksInSelectedLibrary: [],
        });
      });
    });
    describe('Library Settings Updates', () => {
      const testSettingsChanges = {
        libraryId: 'a lIb id',
        mode: 'a MOdE',
        count: 'A iNT',
        showReset: 'a vaLue',
        candidates: 'sOme CandiDates',
      };
      const setterTest = (action, target) => describe('action', () => {
        it(`load ${target} from payload`, () => {
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
        ['onModeChange', 'mode'],
        ['onCountChange', 'count'],
        ['onShowResetChange', 'showReset'],
        ['onCandidatesChange', 'candidates'],
      ].map(args => setterTest(...args));
    });
  });
});
