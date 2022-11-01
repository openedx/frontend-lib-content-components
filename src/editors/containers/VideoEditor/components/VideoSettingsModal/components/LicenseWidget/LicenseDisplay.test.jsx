import React from 'react';
import { shallow } from 'enzyme';

import { LicenseDetails } from './LicenseDetails';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({ license: ['error.license', jest.fn().mockName('error.setLicense')] })),
}));

describe('LicenseDisplay', () => {
  const props = {
    license: 'all-rights-reserved',
    details: {},
    licenseDescription: 'FormattedMessage component with license description',
    level: 'course',
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
    test('snapshots: renders as expected with level set to block and license set to select', () => {
      expect(
        shallow(<LicenseDetails {...props} level="block" license="select" />),
      ).toMatchSnapshot();
    });
    test('snapshots: renders as expected with level set to block and license set to Creative Commons', () => {
      expect(
        shallow(<LicenseDetails {...props} level="block" license="creative-commons" />),
      ).toMatchSnapshot();
    });
  });
});
