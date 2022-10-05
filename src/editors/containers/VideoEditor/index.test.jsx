import React from 'react';
import { shallow } from 'enzyme';

import { errorsHook } from './hooks';
import { VideoEditor, mapDispatchToProps } from '.';

jest.mock('../EditorContainer', () => 'EditorContainer');
jest.mock('./components/VideoEditorModal', () => 'VideoEditorModal');

jest.mock('./hooks', () => ({
  errorsHook: jest.fn(() => ({
    error: 'hooks.errorsHook.error',
    validateEntry: jest.fn().mockName('validateEntry'),
  })),
  fetchVideoContent: jest.fn().mockName('fetchVideoContent'),
}));

jest.mock('../../data/redux', () => ({
  selectors: {
    video: {
      videoSettings: state => ({ videoSettings: { state } }),
    },
  },
}));

describe('VideoEditor', () => {
  const props = {
    onClose: jest.fn().mockName('props.onClose'),
  };
  errorsHook.mockReturnValue({
    error: 'errORsHooKErroR',
    validateEntry: jest.fn().mockName('validateEntry'),
  });
  describe('snapshots', () => {
    test('renders as expected with default behavior', () => {
      expect(shallow(<VideoEditor {...props} />)).toMatchSnapshot();
    });
  });
  describe('mapDispatchToProps', () => {
    test('is empty', () => {
      expect(mapDispatchToProps).toEqual({});
    });
  });
});
