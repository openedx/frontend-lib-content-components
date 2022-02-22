import { initialState, actions, reducer } from './reducer';

const testingState = {
  ...initialState,
  arbitraryField: 'arbitrary',
};

describe('requests reducer', () => {
  it('has initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  const testValue = 'roll for initiative';

  describe('handling actions', () => {
    describe('initialize', () => {
      it('loads initial input fields into the store', () => {
        const data = {
          studioEndpointUrl: 'testURL',
          blockId: 'anID',
          courseId: 'OTHERid',
          blockType: 'someTYPE',
        };
        expect(reducer(
          testingState,
          actions.initialize({ ...data, other: 'field' }),
        )).toEqual({
          ...testingState,
          ...data,
        });
      });
    });
    const setterTest = (action, target) => {
      describe(action, () => {
        it(`load ${target} from payload`, () => {
          expect(reducer(testingState, actions[action](testValue))).toEqual({
            ...testingState,
            [target]: testValue,
          });
        });
      });
    };
    [
      ['setUnitUrl', 'unitUrl'],
      ['setBlockValue', 'blockValue'],
      ['setBlockContent', 'blockContent'],
      ['setBlockTitle', 'blockTitle'],
      ['setSaveResponse', 'saveResponse'],
    ].map(args => setterTest(...args));
    describe('initializeEditor', () => {
      it('sets editorInitialized to true', () => {
        expect(reducer(testingState, actions.initializeEditor())).toEqual({
          ...testingState,
          editorInitialized: true,
        });
      });
    });
  });
});
