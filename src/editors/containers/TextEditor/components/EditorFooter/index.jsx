import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Spinner,
  ActionRow,
  Button,
  ModalDialog,
  Toast,
} from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import * as hooks from './hooks';
import messages from './messages';

export const EditorFooter = ({
  editorRef,
  // injected
  intl,
}) => {
  const dispatch = useDispatch();
  const isInitialized = hooks.isInitialized();
  const saveFailed = hooks.saveFailed();
  return (
    <div className="editor-footer mt-auto">
      {saveFailed && (
        <Toast show onClose={hooks.nullMethod}>
          <FormattedMessage {...messages.contentSaveFailed} />
        </Toast>
      )}

      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button
            aria-label={intl.formatMessage(messages.cancelButtonAriaLabel)}
            variant="tertiary"
            onClick={hooks.handleCancelClicked()}
          >
            <FormattedMessage {...messages.cancelButtonLabel} />
          </Button>
          <Button
            aria-label={intl.formatMessage(messages.saveButtonAriaLabel)}
            onClick={hooks.handleSaveClicked({ dispatch, editorRef })}
            disabled={!isInitialized}
          >
            {isInitialized
              ? <FormattedMessage {...messages.saveButtonLabel} />
              : <Spinner animation="border" className="mr-3" />}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </div>
  );
};
EditorFooter.defaultProps = {
  editorRef: null,
};
EditorFooter.propTypes = {
  editorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(EditorFooter);
