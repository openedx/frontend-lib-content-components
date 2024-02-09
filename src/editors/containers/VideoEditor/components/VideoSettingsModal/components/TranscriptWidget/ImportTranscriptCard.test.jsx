import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { Button, IconButton } from '@edx/paragon';

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
  let el;
  describe('snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<module.ImportTranscriptCard {...props} />).snapshot,
      ).toMatchSnapshot();
    });
  });
  describe('behavior inspection', () => {
    beforeEach(() => {
      el = shallow(<module.ImportTranscriptCard {...props} />);
    });
    test('close behavior is linked to IconButton', () => {
      expect(el.instance.findByType(IconButton)[0]
        .props.onClick).toBeDefined();
    });
    test('import behavior is linked to Button onClick', () => {
      expect(el.instance.findByType(Button)[0]
        .props.onClick).toEqual(props.importTranscript);
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
