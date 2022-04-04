import React from 'react';
import PropTypes from 'prop-types';

import { Button, Stack, Spinner } from '@edx/paragon';
import { Add } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { RequestKeys } from '../../../../data/constants/requests';
import { selectors, thunkActions } from '../../../../data/redux';
import hooks from './hooks';
import messages from './messages';
import BaseModal from '../BaseModal';
import SearchSort from './SearchSort';
import Gallery from './Gallery';

export const SelectImageModal = ({
  isOpen,
  close,
  setSelection,
  // injected
  intl,
  // redux
  isUploadingImage,
  fetchImages,
  uploadImage,
}) => {
  const {
    searchSortProps,
    galleryProps,
    selectBtnProps,
    fileInput,
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
      {(isUploadingImage
        ? <Spinner animation="border" className="mie-3" screenReaderText="loading" />
        : (
          <Stack gap={3}>
            <SearchSort {...searchSortProps} />
            <Gallery {...galleryProps} />
            <input
              accept={Object.values(acceptedImgKeys).join()}
              className="upload d-none"
              onChange={fileInput.addFile}
              ref={fileInput.ref}
              type="file"
            />
          </Stack>
        )
        )}

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
  isUploadingImage: PropTypes.bool.isRequired,
  fetchImages: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isUploadingImage: selectors.requests.isPending(state, { requestKey: RequestKeys.uploadImage }),

});
export const mapDispatchToProps = {
  fetchImages: thunkActions.app.fetchImages,
  uploadImage: thunkActions.app.uploadImage,
};

export default injectIntl(SelectImageModal);
