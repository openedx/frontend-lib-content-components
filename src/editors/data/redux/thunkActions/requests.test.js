import { actions } from '..';
import { RequestKeys } from '../../constants/requests';
import api from '../../services/cms/api';
import * as requests from './requests';
import { actions, selectors } from '../index';

const studioEndpointUrl = 'ASVouAGE.S$e';
const blockId = 'CHalockIDmaiw@alcioUSness';
const blockType = 'hTMl';
const courseId = 'BEnX:INtrOToUNIttEsTing';
const title = 'MYbLock';

jest.spyOn(selectors.app, 'studioEndpointUrl').mockImplementation(() => studioEndpointUrl);
jest.mock('../app/selectors', () => ({
  studioEndpointUrl: () => (studioEndpointUrl),
  blockId: () => (blockId),
  blockType: () => (blockType),
  courseId: () => (courseId),
  blockTitle: () => (title),
}));

jest.mock('../../services/cms/api', () => ({
  fetchBlockById: ({ id, url }) => ({ id, url }),
  fetchByUnitId: ({ id, url }) => ({ id, url }),
  saveBlock: (args) => args,
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
    const testData = ({ some: 'test data' });
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
    const sometestStateGetter = () => ({
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
          ...sometestStateGetter(),
          requestKey: RequestKeys.fetchBlock,
          promise: api.fetchBlockById({ studioEndpointUrl, blockId }),
        },
      });
    });
    describe('fetchUnit', () => {
      testNetworkRequestAction({
        action: requests.fetchUnit,
        args: { some: 'data' },
        testState: sometestStateGetter,
        expectedString: 'with fetchUnit promise',
        expectedData: {
          ...sometestStateGetter(),
          requestKey: RequestKeys.fetchUnit,
          promise: api.fetchByUnitId({ studioEndpointUrl, blockId }),
        },
      });
    });
    describe('saveBlock', () => {
      const content = 'SoME HtMl CoNtent As String';
      testNetworkRequestAction({
        action: requests.saveBlock,
        args: { content, some: 'data' },
        testState: sometestStateGetter,
        expectedString: 'with saveBlock promise',
        expectedData: {
          ...sometestStateGetter(),
          requestKey: RequestKeys.saveBlock,
          promise: api.saveBlock({
            blockId, blockType, courseId, content, studioEndpointUrl, title,
          }),
        },
      });
    });
  });
});
