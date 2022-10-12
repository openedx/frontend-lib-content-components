import React from 'react';
import { useDispatch } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';
import messages from '../messages';
import { timerCardHooks } from '../hooks';

export const TimerCard = ({
    timeBetween,
    intl
}) => {
    const dispatch = useDispatch();
    const {handleChange} = timerCardHooks(dispatch);

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
                    onChange={handleChange}
                    floatingLabel={intl.formatMessage(messages.timerInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

TimerCard.propTypes = {
    timeBetween: PropTypes.number.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(TimerCard);