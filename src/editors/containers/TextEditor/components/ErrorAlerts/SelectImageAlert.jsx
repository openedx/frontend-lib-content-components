import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from '../SelectImageModal/messages';
import FeedbackAlert from './FeedbackAlert';

export const SelectImageAlert = ({
  dismissSelectImageError,
  isSelectImageError,
}) => (
  <FeedbackAlert
    dismissCallback={dismissSelectImageError}
    isError={isSelectImageError}
  >
    <FormattedMessage
      {...messages.selectImageError}
    />
  </FeedbackAlert>
);

SelectImageAlert.propTypes = {
  dismissSelectImageError: PropTypes.func.isRequired,
  isSelectImageError: PropTypes.bool.isRequired,
};
export default SelectImageAlert;
