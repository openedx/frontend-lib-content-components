import React from 'react';
import { shallow } from 'enzyme';

import { thunkActions } from '../../../../../../data/redux';
import * as module from './ImportTranscriptCard';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({ transcripts: ['error.transcripts', jest.fn().mockName('error.setTranscripts')] })),
}));

jest.mock('../../../../../../data/redux', () => ({
  thunkActions: {
    video: {
      importTranscript: jest.fn().mockName('thunkActions.video.importTranscript'),
    },
  },
}));

describe('ImportTranscriptCard', () => {
  const props = {
    setOpen: jest.fn().mockName('setOpen'),
    importTranscript: jest.fn().mockName('args.importTranscript'),
  };
  describe('snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<module.ImportTranscriptCard {...props} />),
      ).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    it('returns an empty object', () => {
      expect(module.mapStateToProps()).toEqual({});
    });
  });
  describe('mapDispatchToProps', () => {
    test('updateField from thunkActions.video.importTranscript', () => {
      expect(module.mapDispatchToProps.importTranscript).toEqual(thunkActions.video.importTranscript);
    });
  });
});
