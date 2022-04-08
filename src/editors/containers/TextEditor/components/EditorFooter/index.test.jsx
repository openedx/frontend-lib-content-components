import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../testUtils';
import * as hooks from './hooks';
import * as module from './index';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn((...args) => ({ dispatch: args })).mockName('react-redux.dispatch'),
  useSelector: (selector) => ({ useSelector: selector }),
}));

jest.mock('./hooks', () => ({
  nullMethod: jest.fn().mockName('hooks.nullMethod'),
  handleCancelClicked: () => jest.fn().mockName('hooks.handleCancelClicked'),
  handleSaveClicked: (args) => ({ 'hooks.handleSaveClicked': args }),
  isInitialized: jest.fn(),
  saveFailed: jest.fn(),
}));

const { EditorFooter } = module;

describe('EditorFooter', () => {
  const props = {
    intl: { formatMessage },
    editorRef: jest.fn().mockName('args.editorRef'),
  };
  describe('snapshots', () => {
    test('renders as expected with default behavior', () => {
      hooks.isInitialized.mockReturnValueOnce(true);
      hooks.saveFailed.mockReturnValueOnce(false);
      expect(shallow(<EditorFooter {...props} />)).toMatchSnapshot();
    });
    test('not intialized, Spinner appears and button is disabled', () => {
      hooks.isInitialized.mockReturnValueOnce(false);
      hooks.saveFailed.mockReturnValueOnce(false);
      expect(shallow(<EditorFooter {...props} />)).toMatchSnapshot();
    });
    test('Save Failed, error message raised', () => {
      hooks.isInitialized.mockReturnValueOnce(true);
      hooks.saveFailed.mockReturnValueOnce(true);
      expect(shallow(<EditorFooter {...props} />)).toMatchSnapshot();
    });
  });
});
