import { initialState, actions, reducer } from './reducer';
import { RequestStates, RequestKeys } from '../../constants/requests';

const testingState = {
  ...initialState,
  arbitraryField: 'arbitrary',
};
describe('requests reducer', () => {
  test('intial state generated on create', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  describe('handling actions', () => {
    const requestsList = [RequestKeys.fetchUnit, RequestKeys.fetchBlock, RequestKeys.saveBlock];
    requestsList.forEach(requestKey => {
      describe(`${requestKey} lifecycle`, () => {
        const testAction = (action, args, expected) => {
          expect(reducer(testingState, actions[action](args))).toEqual({
            ...testingState,
            [requestKey]: expected,
          });
        };
        test('startRequest sets pending status', () => {
          testAction('startRequest', requestKey, { status: RequestStates.pending });
        });
        test('completeRequest sets completed status and loads response', () => {
          testAction(
            'completeRequest',
            { requestKey },
            { status: RequestStates.completed },
          );
        });
        test('failRequest sets failed state and loads error', () => {
          testAction(
            'failResponse',
            { requestKey },
            { status: RequestStates.failed },
          );
        });
        test('clearRequest clears request state', () => {
          testAction('clearRequest', { requestKey }, {});
        });
      });
    });
  });
});
