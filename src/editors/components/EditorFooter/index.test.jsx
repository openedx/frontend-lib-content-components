import React from 'react';
import { shallow } from 'enzyme';
import * as module from './index';
import { selectors, thunkActions } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import { saveTextBlock, navigateCallback } from '../../hooks';

jest.mock('../../data/redux', () => ({
  thunkActions: {
    app: {
      saveBlock: jest.fn().mockName('thunkActions.app.saveBlock'),
    },
  },
  selectors: {
    app: {
      isInitialized: jest.fn(state => ({ isInitialized: state })),
      studioEndpointUrl: jest.fn(state => ({ studioEndpointUrl: state })),
    },
    requests: {
      // eslint-disable-next-line no-unused-vars
      isFailed: jest.fn((state, requestkey) => ({ isFailed: state })),
    },
  },
}));

jest.mock('.', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('./index');
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    handleCancelClicked: jest.fn().mockName('handleCancelClicked'),
    handleSaveClicked: jest.fn().mockName('handleSaveClicked'),
  };
});

jest.mock('../../hooks', () => ({
  saveTextBlock: jest.fn(),
  navigateCallback: jest.fn(),
}));

describe('EditorFooter', () => {
  describe('Component', () => {
    const props = {
      editorRef: jest.fn(),
      isInitialized: true,
      returnUrl: 'hocuspocus.ca',
      saveFailed: false,
      saveBlock: jest.fn(),
    };
    test('renders as expected with default behavior', () => {
      expect(shallow(<module.EditorFooter {...props} />)).toMatchSnapshot();
    });
    test('not intialized, Spinner appears and button is disabled', () => {
      expect(shallow(<module.EditorFooter {...props} isInitialized={false} />)).toMatchSnapshot();
    });
    test('Save Failed, error message raised', () => {
      expect(shallow(<module.EditorFooter {...props} saveFailed />)).toMatchSnapshot();
    });
    describe('On Click Handlers', () => {
      const realmodule = jest.requireActual('./index');
      test('handleSaveClicked calls saveTextBlock', () => {
        const createdCallback = realmodule.handleSaveClicked(props);
        createdCallback();
        expect(saveTextBlock).toHaveBeenCalled();
      });
      test('handleCancelClicked calls navigateCallback', () => {
        realmodule.handleCancelClicked({ returnUrl: props.returnUrl });
        expect(navigateCallback).toHaveBeenCalledWith(props.returnUrl);
      });
    });
  });
  describe('MapStateToProps', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    test('isInitialized from app.isInitialized', () => {
      expect(
        module.mapStateToProps(testState).isInitialized,
      ).toEqual(selectors.app.isInitialized(testState));
    });
    test('studioEndpointUrl from app.studioEndpointUrl', () => {
      expect(
        module.mapStateToProps(testState).studioEndpointUrl,
      ).toEqual(selectors.app.studioEndpointUrl(testState));
    });
    test('saveFailed from requests.isFailed', () => {
      expect(
        module.mapStateToProps(testState).saveFailed,
      ).toEqual(selectors.requests.isFailed(testState, { requestKey: RequestKeys.saveBlock }));
    });
  });
  describe('MapDispatchToProps', () => {
    test('saveBlock from thunkActions.app.saveBlock', () => {
      expect(module.mapDispatchToProps.saveBlock).toEqual(thunkActions.app.saveBlock);
    });
  });
});
