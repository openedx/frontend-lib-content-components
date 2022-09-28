import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../../../testUtils';
import { actions, selectors } from '../../../../../../data/redux';
import { ThumbnailWidget, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      updateField: jest.fn().mockName('actions.video.updateField'),
    },
  },
  selectors: {
    video: {
      thumbnail: jest.fn(state => ({ thumbnail: state })),
    },
  },
}));

describe('ThumbnailWidget', () => {
  const props = {
    error: {},
    title: 'tiTLE',
    intl: { formatMessage },
    thumbnail: null,
    updateField: jest.fn().mockName('args.updateField'),
  };

  describe('snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<ThumbnailWidget {...props} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with transcripts', () => {
      expect(
        shallow(<ThumbnailWidget {...props} thumbnail="sOMeUrl" />),
      ).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    test('thumbnail from video.thumbnail', () => {
      expect(
        mapStateToProps(testState).thumbnail,
      ).toEqual(selectors.video.thumbnail(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();
    test('updateField from actions.video.updateField', () => {
      expect(mapDispatchToProps.updateField).toEqual(dispatch(actions.video.updateField));
    });
  });
});
