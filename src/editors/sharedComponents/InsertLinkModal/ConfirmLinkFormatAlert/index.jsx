import { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form,
  AlertModal,
  ActionRow,
  Button,
} from '@openedx/paragon';
import { Warning } from '@openedx/paragon/icons';

import messages from './messages';

const ConfirmLinkFormatAlert = ({
  url,
  onCloseAlert,
  editorRef,
}) => {
  const intl = useIntl();
  const [protocol, setProtocol] = useState('');
  const handleChangeProtocol = e => setProtocol(e.target.value);

  const handleCancel = () => onCloseAlert();

  /* istanbul ignore next */
  const handleConfirm = () => {
    const editor = editorRef.current;
    if (editor) {
      const selectedText = editor.selection.getContent({ format: 'text' });
      const urlPath = `${protocol}${url}`;

      if (selectedText.trim() !== '') {
        const linkHtml = `<a href="${urlPath}" data-mce-href="${urlPath}" target="_blank">${selectedText}</a>`;
        editor.selection.setContent(linkHtml);
      }
    }
    onCloseAlert();
  };

  return (
    <AlertModal
      title={intl.formatMessage(messages.confirmLinkFormatAlertTitle)}
      isOpen
      onClose={onCloseAlert}
      variant="warning"
      icon={Warning}
      footerNode={(
        <ActionRow>
          <Button
            variant="tertiary"
            onClick={handleCancel}
            data-testid="cancel-button"
          >
            {intl.formatMessage(messages.confirmLinkFormatAlertCancel)}
          </Button>
          <Button
            variant="primary"
            disabled={!protocol}
            data-testid="confirm-button"
            onClick={handleConfirm}
          >
            {intl.formatMessage(messages.confirmLinkFormatAlertConfirm)}
          </Button>
        </ActionRow>
      )}
    >
      <Form.Group>
        <Form.Label className="my-4">
          {intl.formatMessage(messages.confirmLinkFormatAlertDescription)}
        </Form.Label>
        <Form.RadioSet
          name="colors"
          onChange={handleChangeProtocol}
          value={protocol}
        >
          <Form.Radio value="http://" data-testid="radio-http">
            {intl.formatMessage(messages.confirmLinkFormatAlertHttpProtocol)}
          </Form.Radio>
          <Form.Radio value="https://" data-testid="radio-https">
            {intl.formatMessage(messages.confirmLinkFormatAlertHttpsProtocol)}
          </Form.Radio>
        </Form.RadioSet>
      </Form.Group>
    </AlertModal>
  );
};

ConfirmLinkFormatAlert.propTypes = {
  url: PropTypes.string.isRequired,
  onCloseAlert: PropTypes.func.isRequired,
  editorRef: PropTypes.shape({
    current: PropTypes.shape({
      selection: PropTypes.shape({
        getContent: PropTypes.func,
        setContent: PropTypes.func,
      }),
    }),
  }).isRequired,
};

export default ConfirmLinkFormatAlert;
