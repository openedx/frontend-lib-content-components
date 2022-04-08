import React from 'react';
import * as reactRedux from 'react-redux';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../testUtils';
import { keyStore } from '../../../../utils';
import {
  selectors,
  // thunkActions,
} from '../../../../data/redux';
// import { RequestKeys } from '../../../../data/constants/requests';
import { navigateCallback } from '../../../../hooks';
import { saveBlock } from '../../hooks';
import * as module from './index';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn((...args) => ({ dispatch: args })).mockName('react-redux.dispatch'),
  useSelector: (selector) => ({ useSelector: selector }),
}));

jest.mock('../../../../data/redux', () => ({
  thunkActions: {
    app: {
      saveBlock: jest.fn().mockName('thunkActions.app.saveBlock'),
      fetchImages: jest.fn().mockName('thunkActions.app.fetchImages'),
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
  saveBlock: jest.fn(),
}));
jest.mock('../../../../hooks', () => ({
  navigateCallback: jest.fn(),
  nullMethod: jest.fn().mockName('nullMethod'),
}));

describe('EditorFooter', () => {
  const props = {
    intl: { formatMessage },
    editorRef: jest.fn().mockName('args.editorRef'),
  };
  describe('behavior (hooks)', () => {
    beforeEach(() => {
      jest.spyOn(reactRedux, 'useSelector').mockImplementationOnce(
        (selector) => ({ useSelector: selector }),
      );
    });
    test('handleSaveClicked calls saveBlock', () => {
      const createdCallback = module.hooks.handleSaveClicked({ editorRef: props.editorRef });
      createdCallback();
      expect(saveBlock).toHaveBeenCalled();
      const [[callArgs]] = saveBlock.mock.calls;
      expect(callArgs.editorRef).toEqual(props.editorRef);
      expect(callArgs.returnUrl).toEqual({ useSelector: selectors.app.returnUrl });
      // TODO: add test for saveBlockContent behavior
    });
    test('handleCancelClicked calls navigateCallback', () => {
      module.hooks.handleCancelClicked();
      expect(navigateCallback).toHaveBeenCalledWith({ useSelector: selectors.app.returnUrl });
    });
    // TODO: add test for isInitialized
    // TODO: add test for saveFailed
    // TODO: add test for studioEndpointUrl
  });
  describe('snapshots', () => {
    const hookKeys = keyStore(module.hooks);
    beforeEach(() => {
      jest.spyOn(module.hooks, hookKeys.handleSaveClicked).mockImplementationOnce(
        (args) => ({ 'hooks.handleSaveClicked': args }),
      );
      jest.spyOn(module.hooks, hookKeys.handleCancelClicked).mockImplementationOnce(
        (args) => ({ 'hooks.handleCancelClicked': args }),
      );
    });
    test('renders as expected with default behavior', () => {
      jest.spyOn(module.hooks, hookKeys.isInitialized).mockReturnValueOnce(true);
      jest.spyOn(module.hooks, hookKeys.saveFailed).mockReturnValueOnce(false);
      expect(shallow(<module.EditorFooter {...props} />)).toMatchSnapshot();
    });
    test('not intialized, Spinner appears and button is disabled', () => {
      jest.spyOn(module.hooks, hookKeys.isInitialized).mockReturnValueOnce(false);
      jest.spyOn(module.hooks, hookKeys.saveFailed).mockReturnValueOnce(false);
      expect(shallow(<module.EditorFooter {...props} isInitialized={false} />)).toMatchSnapshot();
    });
    test('Save Failed, error message raised', () => {
      jest.spyOn(module.hooks, hookKeys.isInitialized).mockReturnValueOnce(true);
      jest.spyOn(module.hooks, hookKeys.saveFailed).mockReturnValueOnce(true);
      expect(shallow(<module.EditorFooter {...props} saveFailed />)).toMatchSnapshot();
    });
  });
});
