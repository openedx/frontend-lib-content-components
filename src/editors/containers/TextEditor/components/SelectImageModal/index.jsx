import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Button, Stack, Spinner } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { RequestKeys } from '../../../../data/constants/requests';
import hooks from './hooks';
import { acceptedImgKeys } from './utils';
import messages from './messages';
import BaseModal from '../BaseModal';
import ErrorAlert from './ErrorAlert';
import SearchSort from './SearchSort';
import Gallery from './Gallery';
import { selectors, thunkActions } from '../../../../data/redux';

export const SelectImageModal = ({
  isOpen,
  close,
  setSelection,
  // injected
  intl,
  // redux
  isFinishedLoadingImages,
  fetchImages,
  uploadImage,
}) => {
  const {
    searchSortProps,
    galleryProps,
    disableNext,
    fileInputRef,
    addFileClick,
    addFile,
    onConfirmSelection,
    error, setError,
  } = hooks.imgHooks({ fetchImages, uploadImage, setSelection });

  console.log({
    isOpen,
    close,
    setSelection,
    intl,
    isFinishedLoadingImages,
    fetchImages,
    uploadImage,
  });
  console.log({
    searchSortProps,
    galleryProps,
    disableNext,
    fileInputRef,
    addFileClick,
    addFile,
    onConfirmSelection,
    error,
    setError,
  });

  return (
    <BaseModal
      close={close}
      confirmAction={(
        <Button
          variant="primary"
          onClick={onConfirmSelection}
          disabled={disableNext}
        >
          <FormattedMessage {...messages.nextButtonLabel} />
        </Button>
      )}
      isOpen={isOpen}
      footerAction={(
        <Button iconBefore={Add} onClick={addFileClick} variant="link">
          <FormattedMessage {...messages.uploadButtonLabel} />
        </Button>
      )}
      title={intl.formatMessage(messages.titleLabel)}
    >
      <ErrorAlert
        error={error}
        setError={setError}
      />
      <Stack gap={3}>
        <SearchSort {...searchSortProps} />
        <Gallery {...galleryProps} />
        <input
          accept={Object.values(acceptedImgKeys).join()}
          className="upload d-none"
          onChange={addFile}
          ref={fileInputRef}
          type="file"
        />
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
  // redux
  fetchImages: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isFinishedLoadingImages: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchImages }),

});
export const mapDispatchToProps = {
  fetchImages: thunkActions.app.fetchImages,
  uploadImage: thunkActions.app.uploadImage,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SelectImageModal));
