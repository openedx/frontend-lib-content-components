import React from 'react';
import { shallow } from 'enzyme';

import { TranscriptListItem, mapDispatchToProps } from './TranscriptListItem';
import { thunkActions } from '../../../../../../data/redux';
import hooks from './hooks';

jest.mock('react-redux', () => {
  const dispatchFn = jest.fn().mockName('mockUseDispatch');
  return {
    ...jest.requireActual('react-redux'),
    dispatch: dispatchFn,
    useDispatch: jest.fn(() => dispatchFn),
  };
});

jest.mock('../../../../../../data/redux', () => ({
  thunkActions: {
    video: {
      downloadTranscript: jest.fn().mockName('actions.video.downloadTranscript'),
      deleteTranscript: jest.fn().mockName('actions.video.deleteTranscript'),
    },
  },
}));

jest.mock('./hooks', () => ({
  fileInput: jest.fn((args) => ({ fileInput: args, click: jest.fn().mockName('mockInputClick') })),
  replaceFileCallback: jest.fn((args) => ({ replaceFileCallback: args })),
  setUpDeleteConfirmation: jest.fn((args) => ({ setUpDeleteConfirmation: args })).mockName('setUpDeleteConfirmation'),
}));

describe('TranscriptListItem', () => {
  const props = {
    title: 'sOmeTiTLE',
    language: 'lAnG',
    downloadTranscript: jest.fn().mockName('actions.video.downloadTranscript'),
    deleteTranscript: jest.fn().mockName('actions.video.deleteTranscript'),
  };

  describe('Snapshots', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });
    test('snapshots: renders as expected with default props: dont show confirm delete', () => {
      jest.spyOn(hooks, 'setUpDeleteConfirmation').mockImplementationOnce(() => ({
        inDeleteConfirmation: false,
        launchDeleteConfirmation: jest.fn().mockName('launchDeleteConfirmation'),
        cancelDelete: jest.fn().mockName('cancelDelete'),
      }));
      expect(
        shallow(<TranscriptListItem {...props} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with default props: show confirm delete', () => {
      jest.spyOn(hooks, 'setUpDeleteConfirmation').mockImplementationOnce(() => ({
        inDeleteConfirmation: true,
        launchDeleteConfirmation: jest.fn().mockName('launchDeleteConfirmation'),
        cancelDelete: jest.fn().mockName('cancelDelete'),
      }));
      expect(
        shallow(<TranscriptListItem {...props} />),
      ).toMatchSnapshot();
    });
  });
  describe('mapDispatchToProps', () => {
    test('initializeEditor from actions.app.initializeEditor', () => {
      expect(mapDispatchToProps.downloadTranscript).toEqual(thunkActions.video.downloadTranscript);
      expect(mapDispatchToProps.deleteTranscript).toEqual(thunkActions.video.deleteTranscript);
    });
  });
});