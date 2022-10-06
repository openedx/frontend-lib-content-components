import React from 'react';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';
import messages from './messages';
import { ErrorContext } from '../../../hooks';

export const ErrorSummary = () => {
  const error = React.useContext(ErrorContext);
  const hasError = (errHook) => (Object.keys(errHook[0]).length !== 0);
  return (
    <Alert
      icon={Info}
      show={Object.values(error).every(hasError)}
      variant="danger"
    >
      <Alert.Heading>
        <FormattedMessage {...messages.validateErrorTitle} />
      </Alert.Heading>
      <p>
        <FormattedMessage {...messages.validateErrorBody} />
      </p>
    </Alert>
  );
};

export default ErrorSummary;
