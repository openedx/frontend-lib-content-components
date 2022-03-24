import { actions } from '..';
import { camelizeKeys } from '../../../utils';
import * as thunkActions from './app';

jest.mock('./requests', () => ({
  fetchBlock: (args) => ({ fetchBlock: args }),
  fetchUnit: (args) => ({ fetchUnit: args }),
  saveBlock: (args) => ({ saveBlock: args }),
  fetchImages: (args) => ({ fetchImages: args }),
  uploadImage: (args) => ({ uploadImage: args }),
}));

jest.mock('../../../utils', () => ({
  camelizeKeys: (args) => ([{ camelizeKeys: args }]),
  ...jest.requireActual('../../../utils'),
}));

const testValue = { data: { assets: 'test VALUE' } };

describe('app thunkActions', () => {
  let dispatch;
  let dispatchedAction;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });
  describe('fetchBlock', () => {
    beforeEach(() => {
      thunkActions.fetchBlock()(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches fetchBlock action', () => {
      expect(dispatchedAction.fetchBlock).not.toEqual(undefined);
    });
    it('dispatches actions.app.setBlockValue on success', () => {
      dispatch.mockClear();
      dispatchedAction.fetchBlock.onSuccess(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setBlockValue(testValue));
    });
    it('dispatches actions.app.setBlockValue on failure', () => {
      dispatch.mockClear();
      dispatchedAction.fetchBlock.onFailure(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setBlockValue(testValue));
    });
  });
  describe('fetchUnit', () => {
    beforeEach(() => {
      thunkActions.fetchUnit()(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches fetchUnit action', () => {
      expect(dispatchedAction.fetchUnit).not.toEqual(undefined);
    });
    it('dispatches actions.app.setUnitUrl on success', () => {
      dispatch.mockClear();
      dispatchedAction.fetchUnit.onSuccess(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setUnitUrl(testValue));
    });
    it('dispatches actions.app.setUnitUrl on failure', () => {
      dispatch.mockClear();
      dispatchedAction.fetchUnit.onFailure(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setUnitUrl(testValue));
    });
  });
  describe('fetchImages', () => {
    const mockSucess = jest.fn();
    beforeEach(() => {
      thunkActions.fetchImages({ setImages: mockSucess })(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches fetchUnit action', () => {
      expect(dispatchedAction.fetchImages).not.toEqual(undefined);
    });
    it('calls onSuceaa on success with camleized keys', () => {
      dispatch.mockClear();
      dispatchedAction.fetchImages.onSuccess(testValue);
      expect(mockSucess).toHaveBeenCalledWith(camelizeKeys(testValue.data.assets));
    });
    it('dispatches actions.app.setUnitUrl on failure', () => {
      dispatch.mockClear();
      dispatchedAction.fetchImages.onFailure(testValue);
      expect(mockSucess).toHaveBeenCalledWith(testValue);
    });
  });
  describe('initialize', () => {
    it('dispatches actions.app.initialize, and then fetches both block and unit', () => {
      const { fetchBlock, fetchUnit } = thunkActions;
      thunkActions.fetchBlock = () => 'fetchBlock';
      thunkActions.fetchUnit = () => 'fetchUnit';
      thunkActions.initialize(testValue)(dispatch);
      expect(dispatch.mock.calls).toEqual([
        [actions.app.initialize(testValue)],
        [thunkActions.fetchBlock()],
        [thunkActions.fetchUnit()],
      ]);
      thunkActions.fetchBlock = fetchBlock;
      thunkActions.fetchUnit = fetchUnit;
    });
  });
  describe('saveBlock', () => {
    let returnToUnit;
    let calls;
    beforeEach(() => {
      returnToUnit = jest.fn();
      thunkActions.saveBlock({ content: testValue, returnToUnit })(dispatch);
      calls = dispatch.mock.calls;
    });
    it('dispatches actions.app.setBlockContent with content, before dispatching saveBlock', () => {
      expect(calls[0]).toEqual([actions.app.setBlockContent(testValue)]);
      const saveCall = calls[1][0];
      expect(saveCall.saveBlock).not.toEqual(undefined);
    });
    it('dispatches saveBlock with passed content', () => {
      expect(calls[1][0].saveBlock.content).toEqual(testValue);
    });
    it('dispatches actions.app.setSaveResponse with response and then calls returnToUnit', () => {
      dispatch.mockClear();
      const response = 'testRESPONSE';
      calls[1][0].saveBlock.onSuccess(response);
      expect(dispatch).toHaveBeenCalledWith(actions.app.setSaveResponse(response));
      expect(returnToUnit).toHaveBeenCalled();
    });
  });
  describe('uploadImage', () => {
    const resetFile = jest.fn();
    let calls;
    beforeEach(() => {
      thunkActions.uploadImage({ file: testValue, resetFile })(dispatch);
      calls = dispatch.mock.calls;
    });
    it('On success calls resetFile', () => {
      dispatch.mockClear();
      const response = 'testRESPONSE';
      calls[0][0].uploadImage.onSuccess(response);
      expect(resetFile).toHaveBeenCalled();
    });
  });
});
