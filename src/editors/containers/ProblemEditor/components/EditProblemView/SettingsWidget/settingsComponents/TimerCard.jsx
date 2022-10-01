import React from 'react'
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';
import messages from '../messages';

export const TimerCard = ({
    timeBetween,
    updateSettings,
    intl
}) => {

    return (
        <SettingsOption
            title={intl.formatMessage(messages.timerSettingsTitle)}
            summary={intl.formatMessage(messages.timerSummary, { time: timeBetween })}
        >
            <div>
                <span>
                    <FormattedMessage {...messages.timerSettingText} />
                </span>
            </div>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={timeBetween}
                    onChange={(e) => updateSettings({ timeBetween: e.target.value })}
                    floatingLabel={intl.formatMessage(messages.timerInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

TimerCard.propTypes = {
    timeBetween: problemDataProps.settings.timeBetween,
    updateSettings: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(TimerCard);