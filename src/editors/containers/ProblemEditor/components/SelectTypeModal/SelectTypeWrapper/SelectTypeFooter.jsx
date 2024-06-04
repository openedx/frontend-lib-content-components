import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ActionRow,
  Button,
  ModalDialog,
} from '@openedx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';
import hooks from '../hooks';

import { actions, selectors } from '../../../../../data/redux';

export const SelectTypeFooter = ({
  onCancel,
  selected,
  // redux
  defaultSettings,
  updateField,
  setBlockTitle,
  // injected,
  intl,
}) => (
  <div className="editor-footer fixed-bottom">
    <ModalDialog.Footer className="border-top-0">
      <ActionRow>
        <ActionRow.Spacer />
        <Button
          aria-label={intl.formatMessage(messages.cancelButtonAriaLabel)}
          variant="tertiary"
          onClick={onCancel}
        >
          <FormattedMessage {...messages.cancelButtonLabel} />
        </Button>
        <Button
          aria-label={intl.formatMessage(messages.selectButtonAriaLabel)}
          onClick={hooks.onSelect({
            selected,
            updateField,
            setBlockTitle,
            defaultSettings,
          })}
          disabled={!selected}
        >
          <FormattedMessage {...messages.selectButtonLabel} />
        </Button>
      </ActionRow>
    </ModalDialog.Footer>
  </div>
);

SelectTypeFooter.defaultProps = {
  selected: null,
};

SelectTypeFooter.propTypes = {
  defaultSettings: PropTypes.shape({
    maxAttempts: PropTypes.number,
    rerandomize: PropTypes.string,
    showResetButton: PropTypes.bool,
    showanswer: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  selected: PropTypes.string,
  updateField: PropTypes.func.isRequired,
  setBlockTitle: PropTypes.func.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  defaultSettings: selectors.problem.defaultSettings(state),
});

export const mapDispatchToProps = {
  updateField: actions.problem.updateField,
  setBlockTitle: actions.app.setBlockTitle,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SelectTypeFooter));
