import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';

export const hooks = {
  state: {
    isDismissed: (val) => React.useState(val),
  },
  dismissalHooks: ({ isError }) => {
    const [isDismissed, setIsDismissed] = hooks.state.isDismissed(false);
    React.useEffect(() => {
      setIsDismissed(isDismissed && !isError);
    },
    [isError]);
    return {
      isDismissed,
      dismissAlert: () => setIsDismissed(true),
    };
  },
};

export const FeedbackAlert = ({
  dismissError,
  isError,
  children,
}) => {
  const { isDismissed, dismissAlert } = hooks.dismissalHooks({ isError });
  if (!isError || isDismissed) {
    return null;
  }
  return (
    <Alert
      variant="danger"
      icon={Info}
      dismissible
      onClose={() => {
        dismissAlert();
        dismissError();
      }}
    >
      {children}
    </Alert>
  );
};

FeedbackAlert.propTypes = {
  isError: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default FeedbackAlert;
