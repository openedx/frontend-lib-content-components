import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../../../testUtils';
import { TranscriptWidget, mapStateToProps, mapDispatchToProps } from '.';

describe('TranscriptWidget', () => {
  const props = {
    error: {},
    subtitle: 'SuBTItle',
    title: 'tiTLE',
    // inject
    intl: { formatMessage },
    //redux
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
      const transcripts = { english: 'sOMeUrl'}
      expect(
        shallow(<TranscriptWidget {...props} transcripts/>),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with allowTranscriptDownloads true', () => {
      const transcripts = { english: 'sOMeUrl'}
      expect(
        shallow(<TranscriptWidget {...props} allowTranscriptDownloads transcripts/>),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with showTranscriptByDefault true', () => {
      const transcripts = { english: 'sOMeUrl'}
      expect(
        shallow(<TranscriptWidget {...props} showTranscriptByDefault transcripts/>),
      ).toMatchSnapshot();
    });
  });
});
