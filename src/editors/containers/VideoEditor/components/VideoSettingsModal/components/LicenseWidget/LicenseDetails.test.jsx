import React from 'react';
import { shallow } from 'enzyme';

import { actions } from '../../../../../../data/redux';
import { LicenseDetails, mapStateToProps, mapDispatchToProps } from './LicenseDetails';

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
}));

describe('LicenseDetails', () => {
  const props = {
    license: 'all-rights-reserved',
    details: {},
    level: 'course',
    updateField: jest.fn().mockName('args.updateField'),
  };

  describe('snapshots', () => {
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<LicenseDetails {...props} />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with level set to library', () => {
      expect(
        shallow(<LicenseDetails {...props} level="library" />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with level set to block', () => {
      expect(
        shallow(<LicenseDetails {...props} level="block" />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with level set to block and license set to Creative Commons', () => {
      expect(
        shallow(<LicenseDetails {...props} level="block" license="creative-commons" />),
      ).toMatchSnapshot();
    });
  });
  describe('mapStateToProps', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    test('mapStateToProps equals an empty object', () => {
      expect(mapStateToProps(testState)).toEqual({});
    });
  });
  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();
    test('updateField from actions.video.updateField', () => {
      expect(mapDispatchToProps.updateField).toEqual(dispatch(actions.video.updateField));
    });
  });
});
