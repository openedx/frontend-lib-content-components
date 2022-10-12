import React from 'react'
import { useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Button, ButtonGroup, Hyperlink } from '@edx/paragon';
import PropTypes from 'prop-types';
import messages from '../messages';
import { resetCardHooks } from '../hooks';

export const ResetCard = ({
    showResetButton,
    //injected
    intl,
}) => {
    const dispatch = useDispatch();
    const {setResetTrue, setResetFalse} = resetCardHooks(dispatch);
    return (
        <SettingsOption
            title={intl.formatMessage(messages.resetSettingsTitle)}
            summary={showResetButton ? intl.formatMessage(messages.resetSettingsTrue) : intl.formatMessage(messages.resetSettingsFalse)}
        >
            <div>
                <span>
                    <FormattedMessage {...messages.resetSettingText} />
                </span>
            </div>
            <div>
                <Hyperlink destination="#" target="_blank">
                    <FormattedMessage {...messages.advancedSettingsLinkText} />
                </Hyperlink>
            </div>
            <ButtonGroup size="lg" className="mb-2">
                <Button variant={showResetButton ? "outline-primary" : "primary"} onClick={setResetFalse} >
                    <FormattedMessage {...messages.resetSettingsFalse} />
                </Button>
                <Button variant={showResetButton ? "primary" : "outline-primary"} onClick={setResetTrue} >
                    <FormattedMessage {...messages.resetSettingsTrue} />
                </Button>
            </ButtonGroup>
        </SettingsOption>
    )
}

ResetCard.propTypes = {
    showResetButton: PropTypes.bool.isRequired,
    // injected
    intl: intlShape.isRequired,
};

export default injectIntl(ResetCard);