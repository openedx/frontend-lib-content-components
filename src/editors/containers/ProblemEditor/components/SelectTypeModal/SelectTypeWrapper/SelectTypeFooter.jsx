import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ActionRow,
  Button,
  ModalDialog,
} from '@edx/paragon';
import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';
import hooks from '../hooks';

import { actions } from '../../../../../data/redux';

export const SelectTypeFooter = ({
  onCancel,
  selected,
  // Redux
  setProblemType,
}) => (
  <div className="editor-footer position-sticky" style={{ bottom: 0 }}>
    <ModalDialog.Footer className="border-top-0">
      <ActionRow>
        <ActionRow.Spacer />
        <Button
          aria-label={intl.FormattedMessage(messages.cancelButtonAriaLabel)}
          variant="tertiary"
          onClick={onCancel}
        >
          <FormattedMessage {...messages.cancelButtonLabel} />
        </Button>
        <Button
          aria-label={intl.FormattedMessage(messages.selectButtonAriaLabel)}
          onClick={hooks.onSelect( setProblemType, selected )}
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
  onCancel: PropTypes.func.isRequired,
  selected: PropTypes.string,
};

export const mapStateToProps = () => ({
});

export const mapDispatchToProps = {
  setProblemType: actions.problem.setProblemType,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SelectTypeFooter));
