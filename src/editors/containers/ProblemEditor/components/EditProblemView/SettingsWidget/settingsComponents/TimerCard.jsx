import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';

export const TimerCard = ({
    timeBetween,
    updateSettings,
}) => {
    const [summary, setSummary] = useState("")

    useEffect(() => {
        setSummary(timeBetween + " seconds")
    })
    
    return (
        <SettingsOption title="Time Between Attempts" summary={summary}>
            <div>
                <span>Seconds a student must wait between submissions for a problem with multiple attempts.</span>
            </div>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={timeBetween}
                    onChange={(e) => updateSettings({ timeBetween: e.target.value })}
                    floatingLabel="Attempts"
                />
            </Form.Group>
        </SettingsOption>
    )
}

TimerCard.propTypes = {
    timeBetween: problemDataProps.settings.timeBetween,
    updateSettings: PropTypes.func.isRequired,
};

export default injectIntl(TimerCard);