import React from 'react';
import PropTypes from 'prop-types';

import { Button, Stack } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import hooks from './hooks';
import messages from './messages';
import BaseModal from '../BaseModal';
import SearchSort from './SearchSort';
import Gallery from './Gallery';
import FileInput from './FileInput';
import FetchErrorAlert from '../ErrorAlerts/FetchErrorAlert';
import UploadErrorAlert from '../ErrorAlerts/UploadErrorAlert';
import FeedbackAlert from '../ErrorAlerts/FeedbackAlert';

export const SelectImageModal = ({
  isOpen,
  close,
  setSelection,
  // injected
  intl,
}) => {
  const {
    fileInput,
    galleryProps,
    searchSortProps,
    selectBtnProps,
    addImageErrorProps,
    selectImageErrorProps,
  } = hooks.imgHooks({ setSelection });
  return (
    <BaseModal
      close={close}
      confirmAction={(
        <Button {...selectBtnProps} variant="primary">
          <FormattedMessage {...messages.nextButtonLabel} />
        </Button>
      )}
      isOpen={isOpen}
      footerAction={(
        <Button iconBefore={Add} onClick={fileInput.click} variant="link">
          <FormattedMessage {...messages.uploadButtonLabel} />
        </Button>
      )}
      title={intl.formatMessage(messages.titleLabel)}
    >

      {/* Error Alerts */}
      <FetchErrorAlert />
      <UploadErrorAlert />

      {/* User Feedback Alerts */}
      <FeedbackAlert {...addImageErrorProps}>
        <FormattedMessage {...messages.addImageError} />
      </FeedbackAlert>
      <FeedbackAlert {...selectImageErrorProps}>
        <FormattedMessage {...messages.selectImageError} />
      </FeedbackAlert>

      <Stack gap={3}>
        <SearchSort {...searchSortProps} />
        <Gallery {...galleryProps} />
        <FileInput fileInput={fileInput} />
      </Stack>
    </BaseModal>

  );
};

SelectImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  setSelection: PropTypes.func.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(SelectImageModal);
