import React from 'react'
import { useDispatch } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';
import messages from '../messages';
import { scoringCardHooks } from '../hooks';

export const ScoringCard = ({
    scoring,
    intl,
}) => {
    const dispatch = useDispatch();
    const {handleMaxAttemptChange, handleWeightChange} = scoringCardHooks(scoring, dispatch);

    return (
        <SettingsOption
            title={intl.formatMessage(messages.scoringSettingsTitle)}
            summary={intl.formatMessage(messages.scoringSummary, { attempts: scoring.attempts.number, weight: scoring.weight })}
        >
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.attempts.number}
                    onChange={handleMaxAttemptChange}
                    floatingLabel={intl.formatMessage(messages.scoringAttemptsInputLabel)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Control
                    type="number"
                    value={scoring.weight}
                    onChange={handleWeightChange}
                    floatingLabel={intl.formatMessage(messages.scoringWeightInputLabel)}
                />
            </Form.Group>
        </SettingsOption>
    )
}

ScoringCard.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(ScoringCard);