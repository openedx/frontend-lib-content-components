import React from 'react'
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';
import messages from '../messages';

export const ScoringCard = ({
    scoring,
    updateSettings,
    intl,
}) => {
    const handleAttemptChange = (event) => {
        let unlimitedAttempts = true
        const attemptNumber = parseInt(event.target.value)
        if (event.target.value > 0) {
            unlimitedAttempts = false
        }
        updateSettings({ scoring: { ...scoring, attempts: { number: attemptNumber, unlimited: unlimitedAttempts } } })
    }

    return (
        <SettingsOption
            title={intl.formatMessage(messages.scoringSettingsTitle)}
            summary={intl.formatMessage(messages.scoringSummary, { attempts: scoring.attempts.number, weight: scoring.weight })}
        >
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.attempts.number}
                    onChange={handleAttemptChange}
                    floatingLabel={intl.formatMessage(messages.scoringAttemptsInputLabel)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.weight}
                    onChange={(e) => updateSettings({ scoring: { ...scoring, weight: parseFloat(e.target.value) } })}
                    floatingLabel={intl.formatMessage(messages.scoringWeightInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

ScoringCard.propTypes = {
    scoring: problemDataProps.settings.scoring,
    updateSettings: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(ScoringCard);