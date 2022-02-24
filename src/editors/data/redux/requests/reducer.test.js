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
      [requestKey, 'startRequest', requestKey, { status: RequestStates.pending }],
      [requestKey, 'completeRequest', { requestKey }, { status: RequestStates.completed, response: undefined }],
      [requestKey, 'failRequest', { requestKey }, { status: RequestStates.failed, error: undefined }],
      [requestKey, 'clearRequest', { requestKey }, {}],
    ];
    const lifecycletest = (target, action, payload, testValue) => {
      describe(action, () => {
        it(`load ${target} from payload`, () => {
          expect(reducer(testingState, actions[action](payload))).toEqual({
            ...testingState,
            [target]: testValue,
          });
        });
      });
    };
    requestsList.flatMap(val => createTestParams(val)).map((value) => lifecycletest(...value));
  });
});
