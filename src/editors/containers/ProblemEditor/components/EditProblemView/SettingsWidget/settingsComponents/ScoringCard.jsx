import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';

export const ScoringCard = ({
    scoring,
    updateSettings,
}) => {
    const [summary, setSummary] = useState("")
    const handleAttemptChange = (event) => {
        let unlimitedAttempts = true
        const attemptNumber = parseInt(event.target.value)
        if (event.target.value > 0) {
            unlimitedAttempts = false
        }
        updateSettings({ scoring: { ...scoring, attempts: { number: attemptNumber, unlimited: unlimitedAttempts } } })
    }
    const handleWeightChange = (event) => {
        updateSettings({ scoring: { ...scoring, weight: parseFloat(event.target.value) } })
    }
    const createSummary = () => {
        let text = ""
        if (scoring.attempts.number > 0) {
            text += scoring.attempts.number + " attempts"
        } else {
            text += "Unlimited attempts"
        }
        text += " - "
        if (scoring.weight > 0) {
            text += scoring.weight + " points"
        } else {
            text += "Ungraded"
        }
        setSummary(text)
    }

    useEffect(() => {
        createSummary()
    })

    return (
        <SettingsOption title="Scoring" summary={summary}>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.attempts.number}
                    onChange={handleAttemptChange}
                    floatingLabel="Attempts"
                />
            </Form.Group>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.weight}
                    onChange={handleWeightChange}
                    floatingLabel="Weight"
                />
            </Form.Group>
        </SettingsOption>
    )
}

ScoringCard.propTypes = {
    scoring: problemDataProps.settings.scoring,
    updateSettings: PropTypes.func.isRequired,
};

export default injectIntl(ScoringCard);