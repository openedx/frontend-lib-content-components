import React from 'react';

import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';

export const ErrorSummary = ({
  error,
}) => (
  <Alert
    icon={Info}
    show={!Object.values(error).every(val => !val)}
    variant="danger"
  >
    <Alert.Heading>We couldn't add your video.</Alert.Heading>
    <p>Please check your entries and try again.</p>
  </Alert>
);

export default ErrorSummary;