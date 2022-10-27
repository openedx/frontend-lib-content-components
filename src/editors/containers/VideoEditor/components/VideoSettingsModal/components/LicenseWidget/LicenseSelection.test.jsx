import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../../../testUtils';
import { actions, selectors } from '../../../../../../data/redux';
import { LicenseSelection, mapStateToProps, mapDispatchToProps } from './LicenseSelection';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({ license: ['error.license', jest.fn().mockName('error.setLicense')] })),
}));

jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      updateField: jest.fn().mockName('actions.video.updateField'),
    },
  },
  selectors: {
    video: {
      courseLicenseType: jest.fn(state => ({ courseLicenseType: state })),
    },
  },
}));

describe('LicenseSelection', () => {
  const props = {
    intl: { formatMessage },
    license: 'all-rights-reserved',
    level: 'course',
    courseLicenseType: 'all-rights-reserved',
    updateField: jest.fn().mockName('args.updateField'),
  };

  describe('snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<LicenseSelection {...props} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with block level', () => {
      expect(
        shallow(<LicenseSelection {...props} level="block" />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with no license', () => {
      expect(
        shallow(<LicenseSelection {...props} license="" />),
      ).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    test('courseLicenseType from video.courseLicenseType', () => {
      expect(
        mapStateToProps(testState).courseLicenseType,
      ).toEqual(selectors.video.courseLicenseType(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();
    test('updateField from actions.video.updateField', () => {
      expect(mapDispatchToProps.updateField).toEqual(dispatch(actions.video.updateField));
    });
  });
});
