import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  confirmLinkFormatAlertTitle: {
    id: 'confirm.link.format.alert.title',
    defaultMessage: 'URL format',
    description: 'Title message format link alert when the URL does not have a protocol',
  },
  confirmLinkFormatAlertDescription: {
    id: 'confirm.link.format.alert.description',
    defaultMessage: 'The URL you entered seems to be an external link. Do you want to add the required prefix?',
    description: 'Description message format link alert when the URL does not have a protocol',
  },
  confirmLinkFormatAlertConfirm: {
    id: 'confirm.link.format.alert.confirm',
    defaultMessage: 'Confirm',
    description: 'Confirm button alert when the URL does not have a protocol',
  },
  confirmLinkFormatAlertCancel: {
    id: 'confirm.link.format.alert.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button alert when the URL does not have a protocol',
  },
  confirmLinkFormatAlertHttpProtocol: {
    id: 'confirm.link.format.alert.http.protocol',
    defaultMessage: 'http',
    description: 'http option in the alert when the URL does not have a protocol',
  },
  confirmLinkFormatAlertHttpsProtocol: {
    id: 'confirm.link.format.alert.https.protocol',
    defaultMessage: 'https',
    description: 'https option in the alert the URL does not have a protocol',
  },
});

export default messages;
