import React from 'react';
import PropTypes from 'prop-types';

import {
  FormattedMessage,
  injectIntl,
} from '@edx/frontend-platform/i18n';
import {
  Card,
  Form,
  Hyperlink,
} from '@edx/paragon';

import { LicenseLevel, LicenseTypes } from '../../../../../../data/constants/licenses';

import LicenseBlurb from './LicenseBlurb';
import { messages } from './messages';
/**
 * Collapsible Form widget controlling videe license type and details
 */
// TODO change placeholder icons for NC, ND, SA
export const LicenseDisplay = ({
  license,
  details,
  licenseDescription,
  level,
}) => (
  license !== LicenseTypes.select ? (
    <div className="border-primary-100 border-top pb-4">
      <Form.Group>
        <Form.Label className="mt-3">
          <FormattedMessage {...messages.displaySubsectionTitle} />
        </Form.Label>
        <Card className="mb-3">
          <Card.Header title={<LicenseBlurb license={license} details={details} />} />
          <Card.Section>{licenseDescription}</Card.Section>
        </Card>
        {level !== LicenseLevel.course ? (
          <Hyperlink destination="https://creativecommons.org/about" target="_blank">
            <FormattedMessage {...messages.viewLicenseDetailsLabel} />
          </Hyperlink>
        ) : null }
      </Form.Group>
    </div>
  ) : null
);

LicenseDisplay.propTypes = {
  license: PropTypes.string.isRequired,
  details: PropTypes.shape({
    attribution: PropTypes.bool.isRequired,
    noncommercial: PropTypes.bool.isRequired,
    noDerivatives: PropTypes.bool.isRequired,
    shareAlike: PropTypes.bool.isRequired,
  }).isRequired,
  level: PropTypes.string.isRequired,
  licenseDescription: PropTypes.func.isRequired,
};

export default injectIntl(LicenseDisplay);
