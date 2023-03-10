import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import SettingsOption from '../SettingsOption';
import messages from '../messages';
import { correctAnswerFeedbackHooks } from '../hooks';

export const CorrectAnswerFeedbackCard = ({
  correctAnswerFeedback,
  updateSettings,
  // inject
  intl,
}) => {
  const { summary, handleChange } = correctAnswerFeedbackHooks(correctAnswerFeedback, updateSettings);
  return (
    <SettingsOption
      title={intl.formatMessage(messages.correctAnswerFeedbackSettingTitle)}
      summary={summary.intl ? intl.formatMessage(summary.message) : summary.message}
      none={!correctAnswerFeedback}
    >
      <div className="halfSpacedMessage">
        <span>
          <FormattedMessage {...messages.correctAnswerFeedbackSettingText} />
        </span>
      </div>
      <Form.Group>
        <Form.Control
          value={correctAnswerFeedback}
          onChange={handleChange}
          floatingLabel={intl.formatMessage(messages.correctAnswerFeedbackInputLabel)}
        />
      </Form.Group>
    </SettingsOption>
  );
};

CorrectAnswerFeedbackCard.propTypes = {
  correctAnswerFeedback: PropTypes.string.isRequired,
  updateSettings: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(CorrectAnswerFeedbackCard);
