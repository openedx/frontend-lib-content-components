import React, { useState, useEffect } from 'react'
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form, MailtoLink } from '@edx/paragon'
import { isEmpty } from 'lodash-es';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';
import messages from '../messages';

export const MatlabCard = ({
    matLabApiKey,
    updateSettings,
    intl,
}) => {
    const [summary, setSummary] = useState("")

    useEffect(() => {
        if (isEmpty(matLabApiKey)) {
            setSummary(intl.formatMessage(messages.matlabNoKeySummary))
        } else {
            setSummary(matLabApiKey)
        }
    })

    return (
        <SettingsOption
            title={intl.formatMessage(messages.matlabSettingTitle)}
            summary={summary}
        >
            <div>
                <span>
                    <FormattedMessage {...messages.matlabSettingText1} />
                </span>
            </div>
            <div>
                <span>
                    <FormattedMessage {...messages.matlabSettingText2} /> &nbsp;
                    <MailtoLink to="moocsupport@mathworks.com">
                        moocsupport@mathworks.com
                    </MailtoLink>
                </span>
            </div>
            <Form.Group>
                <Form.Control
                    value={matLabApiKey}
                    onChange={(e) => updateSettings({ matLabApiKey: e.target.value })}
                    floatingLabel={intl.formatMessage(messages.matlabInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

MatlabCard.propTypes = {
    matLabApiKey: problemDataProps.settings.timeBetween,
    updateSettings: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(MatlabCard);