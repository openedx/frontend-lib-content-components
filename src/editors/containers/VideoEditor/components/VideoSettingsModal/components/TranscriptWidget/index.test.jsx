import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../../../testUtils';
import { TranscriptWidget } from '.';

describe('TranscriptWidget', () => {
  const props = {
    error: {},
    subtitle: 'SuBTItle',
    title: 'tiTLE',
    // inject
    intl: { formatMessage },
    // redux
    transcripts: null,
    allowTranscriptDownloads: false,
    showTranscriptByDefault: false,
  };
  describe('render', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<TranscriptWidget {...props} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with transcripts', () => {
      expect(
        shallow(<TranscriptWidget {...props} transcripts={{ english: 'sOMeUrl' }} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with allowTranscriptDownloads true', () => {
      expect(
        shallow(<TranscriptWidget {...props} allowTranscriptDownloads transcripts={{ english: 'sOMeUrl' }} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with showTranscriptByDefault true', () => {
      expect(
        shallow(<TranscriptWidget {...props} showTranscriptByDefault transcripts={{ english: 'sOMeUrl' }} />),
      ).toMatchSnapshot();
    });
  });
});
