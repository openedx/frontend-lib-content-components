import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';

export const ErrorAlert = ({
  error,
  clearError,
}) => {
  if (!error) {
    return null;
  }
  return (
    <Alert
      variant="danger"
      icon={Info}
      dismissible
      onClose={clearError}
    >
      <Alert.Heading>
        Image not uploaded
      </Alert.Heading>
      <p>
        Something went wrong while uploading your image. Please try again.
      </p>
    </Alert>
  );
};

ErrorAlert.propTypes = {
  error: PropTypes.string.isRequired,
  clearError: PropTypes.func.isRequired,
};

export default ErrorAlert;
