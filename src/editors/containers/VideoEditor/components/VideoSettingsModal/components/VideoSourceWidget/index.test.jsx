import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../../../testUtils';
import { actions } from '../../../../../../data/redux';
import { VideoSourceWidget, mapDispatchToProps } from '.';

jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      updateField: jest.fn().mockName('actions.video.updateField'),
    },
  },
  selectors: {
    video: {
      videoSource: jest.fn(state => ({ videoSource: state })),
      fallbackVideos: jest.fn(state => ({ fallbackVideos: state })),
      allowVideoDownloads: jest.fn(state => ({ allowVideoDownloads: state })),
    },
  },
}));

describe('VideoSourceWidget', () => {
  const props = {
    error: {},
    title: 'tiTLE',
    // inject
    intl: { formatMessage },
    // redux
    updateField: jest.fn().mockName('args.updateField'),
  };

  describe('snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<VideoSourceWidget {...props} />),
      ).toMatchSnapshot();
    });
  });
  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();
    test('updateField from actions.video.updateField', () => {
      expect(mapDispatchToProps.updateField).toEqual(dispatch(actions.video.updateField));
    });
  });
});
