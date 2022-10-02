import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form, Hyperlink } from '@edx/paragon'
import { RandomizationType } from '../../../../../../data/constants/problem';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';

export const RandomizationCard = ({
    randomization,
    updateSettings,
}) => {
    const [summary, setSummary] = useState("")
    const createSummary = () => {
        for (const key in RandomizationType) {
            if (randomization === RandomizationType[key].value) {
                setSummary(RandomizationType[key].name)
                break
            }
        }
    }

    useEffect(() => {
      createSummary()
    })
    
    return (
        <SettingsOption title="Randomization" summary={summary}>
            <div>
                <span>Defines when to randomize the variables specified in the associated Python script. For problems that do not randomize values, specify "Never".</span>
            </div>
            <div>
                <Hyperlink destination="#" target="_blank">
                    Set a default value in advanced settings
                </Hyperlink>
            </div>
            <Form.Group>
                <Form.Control
                    as="select"
                    value={randomization}
                    onChange={(e) => updateSettings({ randomization:e.target.value })}
                >
                    {Object.keys(RandomizationType).map((randomType, i) => (
                        <option
                            key={i}
                            value={RandomizationType[randomType].value}
                        >
                            {RandomizationType[randomType].name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
        </SettingsOption>
    )
}

RandomizationCard.propTypes = {
    randomization: problemDataProps.settings.randomization,
    updateSettings: PropTypes.func.isRequired,
};

export default injectIntl(RandomizationCard);