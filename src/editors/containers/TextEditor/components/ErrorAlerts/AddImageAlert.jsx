import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from '../SelectImageModal/messages';
import FeedbackAlert from './FeedbackAlert';

export const AddImageAlert = ({
  dismissAddImageError,
  isAddImageError,
}) => (
  <FeedbackAlert
    dismissCallback={dismissAddImageError}
    isError={isAddImageError}
  >
    <FormattedMessage
      {...messages.addImageError}
    />
  </FeedbackAlert>
);

AddImageAlert.propTypes = {
  dismissSelectImageError: PropTypes.func.isRequired,
  isSelectImageError: PropTypes.bool.isRequired,
};
export default AddImageAlert;
