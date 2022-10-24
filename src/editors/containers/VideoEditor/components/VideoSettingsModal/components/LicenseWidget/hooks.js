import { actions } from '../../../../../../data/redux';
import { LicenseLevel, LicenseTypes } from '../../../../../../data/constants/licenses';

export const determineLicense = ({
  isLibrary,
  licenseType,
  licenseDetails,
  courseLicenseType,
  courseLicenseDetails,
}) => {
  let level = LicenseLevel.course;
  if (licenseType) {
    if (isLibrary) {
      level = LicenseLevel.library;
    }
    else {
      level = LicenseLevel.block;
    }
  }

  return {
    license: licenseType ? licenseType : courseLicenseType,
    details: licenseType ? licenseDetails : courseLicenseDetails,
    level,
  };
};

export const determineText = ({ level }) => {
  // TODO intl
  let levelDescription = '';
  let licenseDescription = '';
  switch (level) {
    case LicenseLevel.course:
      levelDescription = "This license currently set at the course level";
      licenseDescription = "Licenses set at the course level appear at the bottom of courseware pages within your course.";
      break;
    case LicenseLevel.library:
      levelDescription = "This license currently set at the library level";
      licenseDescription = "Licenses set at the library level appear at the specific library video.";
      break;
    default: // default to block
      levelDescription = "This license is set specifically for this video";
      licenseDescription = "When a video has a different license than the course as a whole, learners see the license at the bottom right of the video player.";
      break;
  }

  return {
    levelDescription,
    licenseDescription,
  };
};

export const onSelectLicense = ({
  dispatch,
}) => (license) => {
  switch (license) {
    case LicenseTypes.allRightsReserved:
      dispatch(actions.video.updateField({ licenseType: LicenseTypes.allRightsReserved}));
      break;
    case LicenseTypes.creativeCommons:
      dispatch(actions.video.updateField({
        licenseType: LicenseTypes.creativeCommons,
        licenseDetails: {
          attribution: true,
          noncommercial: true,
          noDerivatives: true,
          shareAlike: false,
        },
      }));
      break;
  }
};

export default {
  determineLicense,
  determineText,
  onSelectLicense,
};