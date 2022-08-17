import React from 'react';
import PropTypes from 'prop-types';

import {
    FormattedMessage,
    injectIntl,
    intlShape,
  } from '@edx/frontend-platform/i18n';


import messages from './messages';
import hooks from './hooks';
import BaseModal from '../BaseModal';
import { Button } from '@edx/paragon';

import CodeEditor from '../RawEditor/CodeEditor'

export const SourceCodeModal = ({
    isOpen,
    close,
    editorRef,
    // injected
    intl,
})=>{
    const { saveBtnProps, value, ref } = hooks.preprareSourceCodeModal({editorRef, close});
    return (
        <BaseModal
            close={close}
            confirmAction={(
            <Button {...saveBtnProps} variant="primary">
                <FormattedMessage {...messages.saveButtonLabel} />
            </Button>
            )}
            isOpen={isOpen}
            title={intl.formatMessage(messages.titleLabel)}
        >
            <CodeEditor
                innerRef = {ref}
                value= {value}
            />
        </BaseModal>
    );
}

SourceCodeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    setSelection: PropTypes.func.isRequired,
    clearSelection: PropTypes.func.isRequired,
    // injected
    intl: intlShape.isRequired,
    // redux
    inputIsLoading: PropTypes.bool.isRequired,
  };

export default injectIntl(SourceCodeModal);