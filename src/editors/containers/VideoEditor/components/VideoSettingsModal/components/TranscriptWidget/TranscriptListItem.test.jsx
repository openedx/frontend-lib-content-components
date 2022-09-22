import React from 'react';
import { shallow } from 'enzyme';

import { TranscriptListItem, mapDispatchToProps } from './TranscriptListItem';
import { actions } from '../../../../../../data/redux';

jest.mock('react-redux', () => {
  const dispatchFn = jest.fn().mockName('mockUseDispatch');
  return {
    ...jest.requireActual('react-redux'),
    dispatch: dispatchFn,
    useDispatch: jest.fn(() => dispatchFn),
  };
});

jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      downloadTranscript: jest.fn().mockName('actions.video.downloadTranscript'),
      deleteTranscript: jest.fn().mockName('actions.video.deleteTranscript'),
    },
  },
}));

jest.mock('./hooks', () => ({
  fileInput: jest.fn((args) => ({ fileInput: args, click: jest.fn().mockName('mockInputClick') })),
  replaceFileCallback: jest.fn((args) => ({ replaceFileCallback: args })),
}));

describe('TranscriptListItem', () => {
  const props = {
    title: 'sOmeTiTLE',
    language: 'lAnG',
    downloadTranscript: jest.fn().mockName('actions.video.downloadTranscript'),
    deleteTranscript: jest.fn().mockName('actions.video.deleteTranscript'),
  };

  describe('Snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<TranscriptListItem {...props} />),
      ).toMatchSnapshot();
    });
  });
  describe('mapDispatchToProps', () => {
    test('initializeEditor from actions.app.initializeEditor', () => {
      expect(mapDispatchToProps.downloadTranscrip).toEqual(actions.video.downloadTranscript);
      expect(mapDispatchToProps.deleteTranscrip).toEqual(actions.video.deleteTranscript);
    });
  });
});
