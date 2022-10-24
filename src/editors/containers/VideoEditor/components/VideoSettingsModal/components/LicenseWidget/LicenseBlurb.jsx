import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import { Form, Icon } from '@edx/paragon';
import { Attribution, Copyright } from '@edx/paragon/icons';

import { LicenseTypes } from '../../../../../../data/constants/licenses';

// TODO: currently using attribution and copyright for placeholder icons. check https://2u-internal.atlassian.net/browse/PAR-815
export const LicenseBlurb = ({
  license,
  details,
  // injected
  intl,
}) => {
  return (
    <div className="d-flex flex-row flex-row">
    {/* TODO: creative commons should have the rights reserved icon */}
      {license === LicenseTypes.allRightsReserved
        ? <Icon src={Copyright} />
        : <Icon src={Copyright} />}
      {details.attribution ? <Icon src={Attribution} /> : null}
      {details.noncommercial ? <Icon src={Attribution} /> : null}
      {details.noDerivatives ? <Icon src={Attribution} /> : null}
      {details.shareAlike ? <Icon src={Attribution} /> : null}
      {license === LicenseTypes.allRightsReserved
        ? <Form.Text>All Rights Reserved</Form.Text>
        : <Form.Text>Creative Commons</Form.Text>}
    </div>
  );
};

LicenseBlurb.propTypes = {
  license: PropTypes.string.isRequired,
  details: PropTypes.shape({}).isRequired,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(LicenseBlurb);