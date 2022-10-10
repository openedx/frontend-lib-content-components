import React from 'react';
import { shallow } from 'enzyme';

import * as module from './ErrorSummary';

describe('ErrorSummary', () => {
  const error = {
    duration: ['durationErrors', jest.fn().mockName('setDurationErrors')],
    handout: ['handoutErrors', jest.fn().mockName('setHandoutErrors')],
    license: ['licenseErrors', jest.fn().mockName('setLicenseErrors')],
    thumbnail: ['thumbnailErrors', jest.fn().mockName('setThumbnailErrors')],
    transcripts: ['transcriptsErrors', jest.fn().mockName('setTranscriptsErrors')],
    videoSource: ['videoSourceErrors', jest.fn().mockName('setVideoSourceErrors')],
  };
  describe('render', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('snapshots: renders as expected when there are no errors', () => {
      jest.spyOn(React, 'useContext').mockReturnValueOnce({});
      jest.spyOn(module, 'hasError').mockReturnValue(false);
      expect(
        shallow(<module.ErrorSummary/>),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected when there are errors', () => {
      jest.spyOn(React, 'useContext').mockReturnValueOnce(error);
      jest.spyOn(module, 'hasError').mockReturnValue(true);
      expect(
        shallow(<module.ErrorSummary/>),
      ).toMatchSnapshot();
    });
  });
  describe('hasError', () => {
    const notEmptyError = [
      { field1: 'eRrOrMsG' },
      () => jest.fn(),
    ];
    const emptyError = [
      {},
      () => jest.fn(),
    ];
    it('returns true', () => {
      expect(module.hasError(notEmptyError)).toEqual(true);
    });
    it('returns false', () => {
      expect(module.hasError(emptyError)).toEqual(false);
    });
  });
});
