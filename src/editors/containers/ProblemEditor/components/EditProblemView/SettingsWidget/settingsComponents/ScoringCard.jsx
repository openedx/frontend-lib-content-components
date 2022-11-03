import React from 'react'
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form } from '@edx/paragon';
import messages from '../messages';
import { scoringCardHooks } from '../hooks';

export const ScoringCard = ({
    scoring,
    updateSettings,
    //inject
    intl,
}) => {
    const { handleMaxAttemptChange, handleWeightChange } = scoringCardHooks(scoring, updateSettings);

    return (
        <SettingsOption
            title={intl.formatMessage(messages.scoringSettingsTitle)}
            summary={intl.formatMessage(messages.scoringSummary, { attempts: scoring.attempts.number, weight: scoring.weight })}
        >
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.attempts.number}
                    onChange={handleMaxAttemptChange}
                    floatingLabel={intl.formatMessage(messages.scoringAttemptsInputLabel)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.weight}
                    onChange={handleWeightChange}
                    floatingLabel={intl.formatMessage(messages.scoringWeightInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

ScoringCard.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(ScoringCard);
