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
    level: 'course',
    licenseDescription: 'FormattedMessage component with license description',
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
});
