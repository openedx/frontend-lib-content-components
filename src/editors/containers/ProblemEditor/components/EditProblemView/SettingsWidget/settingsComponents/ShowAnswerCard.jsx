import React from 'react'
import { useDispatch } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form, Hyperlink } from '@edx/paragon';
import { ShowAnswerTypes, ShowAnswerTypesKeys } from '../../../../../../data/constants/problem';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';
import messages from '../messages';
import { showAnswerCardHooks } from '../hooks';

export const ShowAnswerCard = ({
    showAnswer,
    intl,
}) => {
    const dispatch = useDispatch();
    const {handleShowAnswerChange, handleAttemptsChange} = showAnswerCardHooks(showAnswer, dispatch);
    return (
        <SettingsOption
            title={intl.formatMessage(messages.showAnswerSettingsTitle)}
            summary={intl.formatMessage(ShowAnswerTypes[showAnswer.on])}
        >
            <div>
                <span>
                    <FormattedMessage {...messages.showAnswerSettingText} />
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
                    value={showAnswer.on}
                    onChange={handleShowAnswerChange}
                >
                    {Object.values(ShowAnswerTypesKeys).map((answerType, i) => (
                        <option
                            key={i}
                            value={answerType}
                        >
                            {intl.formatMessage(ShowAnswerTypes[answerType])}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={showAnswer.afterAttempts}
                    onChange={handleAttemptsChange}
                    floatingLabel={intl.formatMessage(messages.showAnswerAttemptsInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

ShowAnswerCard.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(ShowAnswerCard);