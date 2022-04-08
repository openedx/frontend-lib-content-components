import * as reactRedux from 'react-redux';

import { formatMessage } from '../../../../../testUtils';
import {
  selectors,
  thunkActions,
} from '../../../../data/redux';
import { RequestKeys } from '../../../../data/constants/requests';
import * as textEditorHooks from '../../hooks';
import * as module from './hooks';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn((...args) => ({ dispatch: args })).mockName('react-redux.dispatch'),
  useSelector: jest.fn((selector) => ({ useSelector: selector })),
}));

jest.mock('../../../../data/redux', () => ({
  thunkActions: {
    app: {
      saveBlock: jest.fn().mockName('thunkActions.app.saveBlock'),
    },
  },
  selectors: {
    app: {
      isInitialized: jest.fn(state => ({ isInitialized: state })),
      studioEndpointUrl: jest.fn(state => ({ studioEndpointUrl: state })),
      returnUrl: jest.fn(state => ({ returnUrl: state })),
    },
    requests: {
      isFailed: jest.fn((state, params) => ({ isFailed: { state, params } })),
    },
  },
}));

jest.mock('../../hooks', () => ({
  navigateCallback: jest.fn(args => ({ navigateCallback: args })),
  nullMethod: jest.fn().mockName('nullMethod'),
  saveBlock: jest.fn(),
}));

let dispatch;
const { useSelector } = reactRedux;
describe('EditorFooter hooks', () => {
  const props = {
    intl: { formatMessage },
    editorRef: jest.fn().mockName('args.editorRef'),
  };
  beforeEach(() => {
    dispatch = reactRedux.useDispatch();
    jest.resetAllMocks();
  });
  it('forwards navigateCallback from textEditorHooks', () => {
    expect(module.navigateCallback).toEqual(textEditorHooks.navigateCallback);
  });
  it('forwards navigateCallback from textEditorHooks', () => {
    expect(module.nullMethod).toEqual(textEditorHooks.nullMethod);
  });
  it('forwards navigateCallback from textEditorHooks', () => {
    expect(module.saveBlock).toEqual(textEditorHooks.saveBlock);
  });
  test('handleSaveClicked calls saveBlock', () => {
    const createdCallback = module.handleSaveClicked({ dispatch, editorRef: props.editorRef });
    createdCallback();
    expect(module.saveBlock).toHaveBeenCalled();
    const [[callArgs]] = module.saveBlock.mock.calls;
    expect(callArgs.editorRef).toEqual(props.editorRef);
    expect(callArgs.returnUrl).toEqual(useSelector(selectors.app.returnUrl));
    const testArgs = ['some', 'test', 'args', 'for', 'saveBlockContent'];
    expect(callArgs.saveBlockContent(...testArgs)).toEqual(
      dispatch(thunkActions.app.saveBlock(...testArgs)),
    );
  });
  test('handleCancelClicked calls navigateCallback', () => {
    expect(module.handleCancelClicked()).toEqual(
      textEditorHooks.navigateCallback(useSelector(selectors.app.returnUrl)),
    );
  });
  test('isInitialized returns selectors.app.isInitialized', () => {
    expect(module.isInitialized()).toEqual(useSelector(selectors.app.isInitialized));
  });
  test('saveFalied returns selectors.app.isFailed with saveBlock requestKey', () => {
    module.saveFailed();
    expect(useSelector).toHaveBeenCalled();
    const testState = { some: 'test state' };
    expect(useSelector.mock.calls[0][0](testState)).toEqual(
      useSelector(selectors.requests.isFailed(testState, { requestKey: RequestKeys.saveBlock })),
    );
  });
  test('studioEndpointUrl returns selectors.app.studioEndpointUrl', () => {
    expect(module.studioEndpointUrl()).toEqual(useSelector(selectors.app.studioEndpointUrl));
  });
});
