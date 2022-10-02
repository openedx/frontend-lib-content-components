import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Button, ButtonGroup, Form, Hyperlink } from '@edx/paragon';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';

export const ResetCard = ({
    showResetButton,
    updateSettings,
}) => {
    const [summary, setSummary] = useState("")
    const [falseVariant, setFalseVariant] = useState("primary")
    const [trueVariant, setTrueVariant] = useState("outline-primary")
    const handleClick = (selectedButton) => {
        updateSettings({ showResetButton: selectedButton })
    }
    // const handleAttemptChange = (event) => {
    //     let unlimitedAttempts = true
    //     const attemptNumber = parseInt(event.target.value)
    //     if (event.target.value > 0) {
    //         unlimitedAttempts = false
    //     }
    //     updateSettings({ scoring: { ...scoring, attempts: { number: attemptNumber, unlimited: unlimitedAttempts } } })
    // }
    // const handleWeightChange = (event) => {
    //     updateSettings({ scoring: { ...scoring, weight: parseFloat(event.target.value) } })
    // }
    useEffect(() => {
        let text = ""
        if (showResetButton) {
            text = "True"
            setFalseVariant("outline-primary")
            setTrueVariant("primary")
        } else {
            text = "False"
            setFalseVariant("primary")
            setTrueVariant("outline-primary")
        }
        setSummary(text)
    })

    return (
        <SettingsOption title="Show reset option" summary={summary}>
            <div>
                <span>Determines whether a 'Reset' button is shown so the user may reset their answer, generally for use in practice or formative assessments.</span>
            </div>
            <div>
                <Hyperlink destination="#" target="_blank">
                    Set default value in advanced settings
                </Hyperlink>
            </div>
            <ButtonGroup size="lg" className="mb-2">
                <Button variant={falseVariant} onClick={() => updateSettings({ showResetButton: false })} >False</Button>
                <Button variant={trueVariant}  onClick={() => updateSettings({ showResetButton: true })} >True</Button>
            </ButtonGroup>
        </SettingsOption>
    )
}

ResetCard.propTypes = {
    showResetButton: problemDataProps.settings.timeBetween,
    updateSettings: PropTypes.func.isRequired,
};

export default injectIntl(ResetCard);