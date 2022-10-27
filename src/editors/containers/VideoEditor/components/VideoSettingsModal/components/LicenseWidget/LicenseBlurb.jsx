import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from '@edx/frontend-platform/i18n';
import { Form, Icon } from '@edx/paragon';
import {
  Attribution,
  Copyright,
  Cc,
  Nd,
  Nc,
  Sa,
} from '@edx/paragon/icons';

import messages from './messages';
import { LicenseTypes } from '../../../../../../data/constants/licenses';

// TODO: currently using attribution and copyright for placeholder icons. check https://2u-internal.atlassian.net/browse/PAR-815
export const LicenseBlurb = ({
  license,
  details,
}) => (
  <div className="d-flex flex-row flex-row">
    {/* TODO: creative commons should have the rights reserved icon */}
    {license === LicenseTypes.allRightsReserved
      ? <Icon src={Copyright} />
      : <Icon src={Cc} />}
    {details.attribution ? <Icon src={Attribution} /> : null}
    {details.noncommercial ? <Icon src={Nc} /> : null}
    {details.noDerivatives ? <Icon src={Nd} /> : null}
    {details.shareAlike ? <Icon src={Sa} /> : null}
    {license === LicenseTypes.allRightsReserved
      ? <Form.Text><FormattedMessage {...messages.allRightsReservedIconsLabel} /></Form.Text>
      : <Form.Text><FormattedMessage {...messages.creativeCommonsIconsLabel} /></Form.Text>}
  </div>
);

LicenseBlurb.propTypes = {
  license: PropTypes.string.isRequired,
  details: PropTypes.shape({
    attribution: PropTypes.bool.isRequired,
    noncommercial: PropTypes.bool.isRequired,
    noDerivatives: PropTypes.bool.isRequired,
    shareAlike: PropTypes.bool.isRequired,
  }).isRequired,
};

export default injectIntl(LicenseBlurb);
