import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form, Hyperlink } from '@edx/paragon';
import { ShowAnswerTypes } from '../../../../../../data/constants/problem';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';

export const ShowAnswerCard = ({
    showAnswer,
    updateSettings,
}) => {
    const [summary, setSummary] = useState("")
    const handleAnswerTypeChange = (event) => {
        updateSettings({ showAnswer: { ...showAnswer, on: event.target.value } })
    }
    const handleAttemptChange = (event) => {
        updateSettings({ showAnswer: { ...showAnswer, afterAttempts: parseInt(event.target.value) } })
    }
    const createSummary = () => {
        for (const key in ShowAnswerTypes) {
            if (showAnswer.on === ShowAnswerTypes[key].value) {
                setSummary(ShowAnswerTypes[key].name)
                break
            }
        }
    }

    useEffect(() => {
        createSummary()
    })

    return (
        <SettingsOption title="Show Answer" summary={summary} >
            <div>
                <span>Set attempt logic for when learners can see the correct answer.</span>
            </div>
            <div>
                <Hyperlink destination="#" target="_blank">
                    Set a default value in advanced settings
                </Hyperlink>
            </div>
            <Form.Group>
                <Form.Control
                    as="select"
                    value={showAnswer.on}
                    onChange={handleAnswerTypeChange}
                >
                    {Object.keys(ShowAnswerTypes).map((showAnswerType, i) => (
                        <option
                            key={i}
                            value={ShowAnswerTypes[showAnswerType].value}
                        >
                            {ShowAnswerTypes[showAnswerType].name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={showAnswer.afterAttempts}
                    onChange={handleAttemptChange}
                    floatingLabel="Number of Attempts"
                />
            </Form.Group>
        </SettingsOption>
    )
}

ShowAnswerCard.propTypes = {
    showAnswer: problemDataProps.settings.showAnswer,
    updateSettings: PropTypes.func.isRequired,
};

export default injectIntl(ShowAnswerCard);