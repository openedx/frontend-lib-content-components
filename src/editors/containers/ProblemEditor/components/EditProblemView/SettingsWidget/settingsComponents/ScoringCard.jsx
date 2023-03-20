import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form, Hyperlink } from '@edx/paragon';
import { selectors } from '../../../../../../data/redux';
import SettingsOption from '../SettingsOption';
import messages from '../messages';
import { scoringCardHooks } from '../hooks';

export const ScoringCard = ({
  scoring,
  defaultValue,
  updateSettings,
  // inject
  intl,
  // redux
  studioEndpointUrl,
  learningContextId,
}) => {
  const {
    handleMaxAttemptChange,
    handleWeightChange,
    handleOnChange,
    local,
  } = scoringCardHooks(scoring, updateSettings, defaultValue);

  const getScoringSummary = (weight, attempts, unlimited) => {
    let summary = intl.formatMessage(messages.weightSummary, { weight });
    summary += ` ${String.fromCharCode(183)} `;
    summary += unlimited
      ? intl.formatMessage(messages.unlimitedAttemptsSummary)
      : intl.formatMessage(messages.attemptsSummary, { attempts });
    return summary;
  };

  return (
    <SettingsOption
      title={intl.formatMessage(messages.scoringSettingsTitle)}
      summary={getScoringSummary(scoring.weight, scoring.attempts.number, scoring.attempts.unlimited)}
      className="scoringCard"
    >
      <Form.Label className="mb-4">
        <FormattedMessage {...messages.scoringSettingsLabel} />
      </Form.Label>
      <Form.Group>
        <Form.Control
          type="number"
          value={scoring.weight}
          onChange={handleWeightChange}
          floatingLabel={intl.formatMessage(messages.scoringWeightInputLabel)}
        />
        <Form.Control.Feedback>
          <FormattedMessage {...messages.weightHint} />
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Control
          value={local}
          onChange={handleOnChange}
          onBlur={handleMaxAttemptChange}
          floatingLabel={intl.formatMessage(messages.scoringAttemptsInputLabel)}
        />
        <Form.Control.Feedback>
          <FormattedMessage {...messages.attemptsHint} />
        </Form.Control.Feedback>
      </Form.Group>
      <Hyperlink destination={`${studioEndpointUrl}/settings/advanced/${learningContextId}#max_attempts`} target="_blank">
        <FormattedMessage {...messages.advancedSettingsLinkText} />
      </Hyperlink>
    </SettingsOption>
  );
};

ScoringCard.propTypes = {
  intl: intlShape.isRequired,
  // eslint-disable-next-line
  scoring: PropTypes.any.isRequired,
  updateSettings: PropTypes.func.isRequired,
  defaultValue: PropTypes.number.isRequired,
  // redux
  studioEndpointUrl: PropTypes.string.isRequired,
  learningContextId: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
  learningContextId: selectors.app.learningContextId(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ScoringCard));
