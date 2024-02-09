import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from '@edx/react-unit-test-utils';

import { formatMessage } from '../../../../../testUtils';
import { localTitleHooks } from './hooks';
import * as module from '.';

jest.mock('./hooks', () => ({
  localTitleHooks: jest.fn(),
}));
jest.mock('@edx/paragon', () => ({
  ...jest.requireActual('@edx/paragon'),
  Truncate: ({ children }) => <div>{children}</div>, // eslint-disable-line react/prop-types
  IconButton: 'IconButton',
  Icon: 'Icon',
}));
jest.mock('./EditableHeader');

describe('TitleHeader', () => {
  const props = {
    intl: { formatMessage },
    isInitialized: false,
    setTitle: jest.fn().mockName('args.setTitle'),
    title: 'html',
  };
  const localTitleHooksProps = {
    inputRef: jest.fn().mockName('localTitleHooks.inputRef'),
    isEditing: false,
    handleChange: jest.fn().mockName('localTitleHooks.handleChange'),
    handleKeyDown: jest.fn().mockName('localTitleHooks.handleKeyDown'),
    localTitle: 'TeST LocALtitLE',
    startEditing: jest.fn().mockName('localTitleHooks.startEditing'),
    updateTitle: jest.fn().mockName('localTitleHooks.updateTitle'),
  };

  describe('behavior', () => {
    it(' calls localTitleHooks with initialization args', () => {
      localTitleHooks.mockReturnValue(localTitleHooksProps);
      shallow(<module.TitleHeader {...props} isInitialized />);
      const dispatch = useDispatch();
      expect(localTitleHooks).toHaveBeenCalledWith({
        dispatch,
      });
    });
  });

  describe('snapshots', () => {
    test('not initialized', () => {
      expect(shallow(<module.TitleHeader {...props} />).snapshot).toMatchSnapshot();
    });
    test('initialized', () => {
      localTitleHooks.mockReturnValue(localTitleHooksProps);
      expect(shallow(<module.TitleHeader {...props} isInitialized />).shallowWrapper).toMatchSnapshot();
    });
    test('editing', () => {
      localTitleHooks.mockReturnValue({ ...localTitleHooksProps, isEditing: true });
      expect(shallow(<module.TitleHeader {...props} isInitialized />).snapshot).toMatchSnapshot();
    });
  });
});
