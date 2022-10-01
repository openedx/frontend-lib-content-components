import React from 'react'
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import SettingsOption from '../SettingsOption';
import { Button, ButtonGroup, Form, Hyperlink } from '@edx/paragon';
import PropTypes from 'prop-types';
import { problemDataProps } from '../../../../../../data/services/cms/types';
import messages from '../messages';

export const ResetCard = ({
    showResetButton,
    updateSettings,
    intl,
}) => {

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
                <Button variant={showResetButton ? "outline-primary" : "primary"} onClick={() => updateSettings({ showResetButton: false })} >
                    <FormattedMessage {...messages.resetSettingsFalse} />
                </Button>
                <Button variant={showResetButton ? "primary" : "outline-primary"} onClick={() => updateSettings({ showResetButton: true })} >
                    <FormattedMessage {...messages.resetSettingsTrue} />
                </Button>
            </ButtonGroup>
        </SettingsOption>
    )
}

ResetCard.propTypes = {
    showResetButton: problemDataProps.settings.timeBetween,
    updateSettings: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
};

export default injectIntl(ResetCard);