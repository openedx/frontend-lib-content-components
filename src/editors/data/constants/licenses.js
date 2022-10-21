import { StrictDict } from '../../utils';

export const LicenseNames = StrictDict({
  allRightsReserved: 'All Rights Reserved',
  creativeCommons: 'Creative Commons',
});

export const LicenseTypes = StrictDict({
  allRightsReserved: 'all-rights-reserved',
  creativeCommons: 'creative-commons',
  // publicDomainDedication: 'public-domain-dedication', // future?
});

export const LicenseLevel = StrictDict({
  block: 'block',
  course: 'course',
  library: 'library',
})

export default {
  LicenseLevel,
  LicenseNames,
  LicenseTypes,
};
