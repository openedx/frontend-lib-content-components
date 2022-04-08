import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Spinner,
  ActionRow,
  Button,
  ModalDialog,
  Toast,
} from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import * as appHooks from '../../../../hooks';
import * as textEditorHooks from '../../hooks';

import { RequestKeys } from '../../../../data/constants/requests';
import { selectors, thunkActions } from '../../../../data/redux';

import messages from './messages';
import * as module from '.';

export const hooks = {
  handleSaveClicked: ({ dispatch, editorRef }) => () => textEditorHooks.saveBlock({
    editorRef,
    saveBlockContent: (...args) => dispatch(thunkActions.app.saveBlock(...args)),
    returnUrl: useSelector(selectors.app.returnUrl),
  }),
  handleCancelClicked: () => appHooks.navigateCallback(useSelector(selectors.app.returnUrl)),
  isInitialized: () => useSelector(selectors.app.isInitialized),
  saveFailed: () => useSelector((state) => (
    selectors.requests.isFailed(state, { requestKey: RequestKeys.saveBlock })
  )),
  studioEndpointUrl: () => useSelector(selectors.app.studioEndpointUrl),
};

export const EditorFooter = ({
  editorRef,
  // injected
  intl,
}) => {
  const dispatch = useDispatch();
  const isInitialized = module.hooks.isInitialized();
  const saveFailed = module.hooks.saveFailed();
  return (
    <div className="editor-footer mt-auto">
      {saveFailed && (
        <Toast show onClose={textEditorHooks.nullMethod}>
          <FormattedMessage {...messages.contentSaveFailed} />
        </Toast>
      )}

      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button
            aria-label={intl.formatMessage(messages.cancelButtonAriaLabel)}
            variant="tertiary"
            onClick={module.hooks.handleCancelClicked()}
          >
            <FormattedMessage {...messages.cancelButtonLabel} />
          </Button>
          <Button
            aria-label={intl.formatMessage(messages.saveButtonAriaLabel)}
            onClick={module.hooks.handleSaveClicked({ dispatch, editorRef })}
            disabled={!isInitialized}
          >
            {isInitialized
              ? <FormattedMessage {...messages.addToCourse} />
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
