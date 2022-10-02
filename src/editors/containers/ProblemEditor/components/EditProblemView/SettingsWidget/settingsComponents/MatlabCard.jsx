import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form, MailtoLink } from '@edx/paragon'
import { isEmpty } from 'lodash-es';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';

export const MatlabCard = ({
    matLabApiKey,
    updateSettings,
}) => {
    const [summary, setSummary] = useState("")
    const createSummary = () => {
        if (isEmpty(matLabApiKey)) {
            setSummary("None")
        } else {
            setSummary(matLabApiKey)
        }

    }

    useEffect(() => {
        createSummary()
    })

    return (
        <SettingsOption title="MATLAB API Key" summary={summary}>
            <div>
                <span>Enter the API key provided by MathWorks for accessing the MATLAB Hosted Service. This key is granted for exclusive use by this course for the specified duration.</span>
            </div>
            <div>
                <span>
                    Please do not share the API key with other courses and notify MathWorks immediately if you believe the key is exposed or compromised. To obtain a key for your course, or to report an issue please contact	&nbsp;
                    <MailtoLink to="moocsupport@mathworks.com">
                        moocsupport@mathworks.com
                    </MailtoLink>
                </span>
            </div>
            <Form.Group>
                <Form.Control
                    value={matLabApiKey}
                    onChange={(e) => updateSettings({ matLabApiKey: e.target.value })}
                    floatingLabel="API Key"
                />
            </Form.Group>
        </SettingsOption>
    )
}

MatlabCard.propTypes = {
    matLabApiKey: problemDataProps.settings.timeBetween,
    updateSettings: PropTypes.func.isRequired,
};

export default injectIntl(MatlabCard);