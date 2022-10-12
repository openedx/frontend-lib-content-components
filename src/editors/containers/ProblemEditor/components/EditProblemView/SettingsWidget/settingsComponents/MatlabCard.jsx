import React from 'react';
import { useDispatch } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form, MailtoLink } from '@edx/paragon'
import PropTypes from 'prop-types';
import messages from '../messages';
import { matlabCardHooks } from '../hooks';

export const MatlabCard = ({
    matLabApiKey,
    intl,
}) => {
    const dispatch = useDispatch();
    const {summary, handleChange} = matlabCardHooks(matLabApiKey, dispatch);

    return (
        <SettingsOption
            title={intl.formatMessage(messages.matlabSettingTitle)}
            summary={summary.intl ? intl.formatMessage(summary.message, {...summary.values}) : summary.message}
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
                    onChange={handleChange}
                    floatingLabel={intl.formatMessage(messages.matlabInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

MatlabCard.propTypes = {
    matLabApiKey: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(MatlabCard);