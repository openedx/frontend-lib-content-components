import React from 'react';
import PropTypes from 'prop-types';

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
    <Alert.Heading>We couldn&apos;t add your video.</Alert.Heading>
    <p>Please check your entries and try again.</p>
  </Alert>
);

ErrorSummary.defaultProps = {
  error: {
    duration: null,
    handout: null,
    license: null,
    thumbnail: null,
    transcripts: null,
    videoSource: null,
  },
};
ErrorSummary.propTypes = {
  error: PropTypes.node,
};

export default ErrorSummary;
