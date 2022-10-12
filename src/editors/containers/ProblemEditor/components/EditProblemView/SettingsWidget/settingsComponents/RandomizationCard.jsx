import React from 'react'
import { useDispatch } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form, Hyperlink } from '@edx/paragon'
import { RandomizationType, RandomizationTypeKeys } from '../../../../../../data/constants/problem';
import PropTypes from 'prop-types';
import messages from '../messages';
import { randomizationCardHooks } from '../hooks';

export const RandomizationCard = ({
    randomization,
    intl,
}) => {
    const dispatch = useDispatch();
    const {handleChange} = randomizationCardHooks(dispatch);
    return (
        <SettingsOption
            title={intl.formatMessage(messages.randomizationSettingTitle)}
            summary={intl.formatMessage(RandomizationType[randomization])}
        >
            <div>
                <span>
                    <FormattedMessage {...messages.randomizationSettingText} />
                </span>
            </div>
            <div>
                <Hyperlink destination="#" target="_blank">
                    <FormattedMessage {...messages.advancedSettingsLinkText} />
                </Hyperlink>
            </div>
            <Form.Group>
                <Form.Control
                    as="select"
                    value={randomization}
                    onChange={handleChange}
                >
                    {Object.values(RandomizationTypeKeys).map((randomType, i) => (
                        <option
                            key={i}
                            value={randomType}
                        >
                            {intl.formatMessage(RandomizationType[randomType])}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
        </SettingsOption>
    )
}

RandomizationCard.propTypes = {
    randomization: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(RandomizationCard);