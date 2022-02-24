import { RequestKeys } from '../../constants/requests';
import api from '../../services/cms/api';
import * as requests from './requests';

const studioEndpointUrl = 'ASVouAGE.S$e';
const blockId = 'CHalockIDmaiw@alcioUSness';
const blockType = 'hTMl';
const courseId = 'BEnX:INtrOToUNIttEsTing';
const title = 'MYbLock';

jest.mock('..', () => ({
  ...jest.requireActual('..'),
  selectors: ({
    app: {
      studioEndpointUrl: (args) => studioEndpointUrl,
      blockId: (args) => blockId,
      blockType: (args) => blockType,
      courseId: (args) => courseId,
      title: (args) => title,
    },
  }),
}));

jest.mock('../../services/cms/api', () => ({
  fetchBlockById: ({ blockId, studioEndpointUrl }) => ({ blockId, studioEndpointUrl }),
  initializeApp: (locationId) => ({ initializeApp: locationId }),
  fetchSubmissionStatus: (submissionUUID) => ({ fetchSubmissionStatus: submissionUUID }),
  fetchSubmission: (submissionUUID) => ({ fetchSubmission: submissionUUID }),
  lockSubmission: ({ submissionUUID }) => ({ lockSubmission: { submissionUUID } }),
  unlockSubmission: ({ submissionUUID }) => ({ unlockSubmission: { submissionUUID } }),
  updateGrade: (submissionUUID, gradeData) => ({ updateGrade: { submissionUUID, gradeData } }),
}));

let dispatch;
let onSuccess;
let onFailure;
describe('requests thunkActions module', () => {
  beforeEach(() => {
    dispatch = jest.fn();
    onSuccess = jest.fn();
    onFailure = jest.fn();
  });

  describe('networkRequest', () => {
    const requestKey = 'test-request';
    const testData = { some: 'test data' };
    let resolveFn;
    let rejectFn;
    beforeEach(() => {
      onSuccess = jest.fn();
      onFailure = jest.fn();
      requests.networkRequest({
        requestKey,
        promise: new Promise((resolve, reject) => {
          resolveFn = resolve;
          rejectFn = reject;
        }),
        onSuccess,
        onFailure,
      })(dispatch);
    });
    test('calls startRequest action with requestKey', async () => {
      expect(dispatch.mock.calls).toEqual([[actions.requests.startRequest(requestKey)]]);
    });
    describe('on success', () => {
      beforeEach(async () => {
        await resolveFn(testData);
      });
      it('dispatches completeRequest', async () => {
        expect(dispatch.mock.calls).toEqual([
          [actions.requests.startRequest(requestKey)],
          [actions.requests.completeRequest({ requestKey, response: testData })],
        ]);
      });
      it('calls onSuccess with response', async () => {
        expect(onSuccess).toHaveBeenCalledWith(testData);
        expect(onFailure).not.toHaveBeenCalled();
      });
    });
    describe('on failure', () => {
      beforeEach(async () => {
        await rejectFn(testData);
      });
      test('dispatches completeRequest', async () => {
        expect(dispatch.mock.calls).toEqual([
          [actions.requests.startRequest(requestKey)],
          [actions.requests.failRequest({ requestKey, error: testData })],
        ]);
      });
      test('calls onSuccess with response', async () => {
        expect(onFailure).toHaveBeenCalledWith(testData);
        expect(onSuccess).not.toHaveBeenCalled();
      });
    });
  });

  const testNetworkRequestAction = ({
    action,
    args,
    testState,
    expectedData,
    expectedString,
  }) => {
    let dispatchedAction;
    beforeEach(() => {
      action({ ...args, onSuccess, onFailure })(dispatch, testState);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches networkRequest', () => {
      expect(dispatchedAction.networkRequest).not.toEqual(undefined);
    });
    test('forwards onSuccess and onFailure', () => {
      expect(dispatchedAction.networkRequest.onSuccess).toEqual(onSuccess);
      expect(dispatchedAction.networkRequest.onFailure).toEqual(onFailure);
    });
    test(expectedString, () => {
      expect(dispatchedAction.networkRequest).toEqual({
        ...expectedData,
        onSuccess,
        onFailure,
      });
    });
  };

  describe('network request actions', () => {
    const sometestStateGetter=()=>({
      some: 'data',
    });
    beforeEach(() => {
      requests.networkRequest = jest.fn(args => ({ networkRequest: args }));
    });
    describe('fetchBlock', () => {
      testNetworkRequestAction({
        action: requests.fetchBlock,
        args: { some: 'data' },
        testState: sometestStateGetter,
        expectedString: 'with fetchBlock promise',
        expectedData: {
          requestKey: RequestKeys.initialize,
          promise: api.fetchBlockById({ studioEndpointUrl, blockId }),
        },
      });
    });
  });
});
