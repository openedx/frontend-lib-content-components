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
    const requestsList = ['fetchUnit', 'fetchBlock', 'saveBlock'];
    const createTestParams = (requestKey) => [
      {
        target: requestKey, action: 'startRequest', payload: requestKey, testValue: { status: RequestStates.pending },
      },
      {
        target: requestKey, action: 'completeRequest', payload: { requestKey }, testValue: { status: RequestStates.completed, response: undefined },
      },
      {
        target: requestKey, action: 'failRequest', payload: { requestKey }, testValue: { status: RequestStates.failed, error: undefined },
      },
      {
        target: requestKey, action: 'clearRequest', payload: { requestKey }, testValue: {},
      },
    ];
    requestsList.forEach(requestKey => {
      createTestParams(requestKey).map((params) => {
        const {
          target, action, payload, testValue,
        } = params;
        describe(action, () => {
          it(`load ${target} from payload`, () => {
            expect(reducer(testingState, actions[action](payload))).toEqual({
              ...testingState,
              [target]: testValue,
            });
          });
        });
      });
    });
  });
});
