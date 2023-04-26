import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from '@edx/frontend-platform/i18n';
import tinyMCEKeys from '../../data/constants/tinyMCE';
import ImageSettingsModal from './ImageSettingsModal';
import SelectImageModal from './SelectImageModal';
import * as module from '.';
import { updateImageDimensions } from '../TinyMceWidget/hooks';

export const propsString = (props) => (
  Object.keys(props).map((key) => `${key}="${props[key]}"`).join(' ')
);

export const imgProps = ({
  settings,
  selection,
  lmsEndpointUrl,
  editorType,
}) => {
  let url = selection.externalUrl;
  if (url.startsWith(lmsEndpointUrl) && editorType !== 'expandable') {
    const sourceEndIndex = lmsEndpointUrl.length;
    url = url.substring(sourceEndIndex);
  }
  return {
    src: url,
    alt: settings.isDecorative ? '' : settings.altText,
    width: settings.dimensions.width,
    height: settings.dimensions.height,
  };
};

export const hooks = {
  createSaveCallback: ({
    close,
    images,
    editorRef,
    editorType,
    setSelection,
    selection,
    lmsEndpointUrl,
  }) => (
    settings,
  ) => {
    const newSelection = module.hooks.imgTag({
      settings,
      selection,
      lmsEndpointUrl,
      editorType,
    });

    editorRef.current.execCommand(
      tinyMCEKeys.commands.insertContent,
      false,
      newSelection,
    );

    const { height, width } = settings.dimensions;

    const newImage = {
      externalUrl: selection.externalUrl,
      altText: settings.altText,
      width,
      height,
    };

    const { result: updatedImages, foundMatch } = updateImageDimensions({
      images: images.current, url: selection.externalUrl, height, width,
    });
    images.current = updatedImages;

    if (!foundMatch) {
      images.current = [...images.current, newImage];
    }

    setSelection(newImage);
    close();
  },
  onClose: ({ clearSelection, close }) => () => {
    clearSelection();
    close();
  },
  imgTag: ({
    settings,
    selection,
    lmsEndpointUrl,
    editorType,
  }) => {
    const props = module.imgProps({
      settings,
      selection,
      lmsEndpointUrl,
      editorType,
    });
    return `<img ${propsString(props)} />`;
  },
};

export const ImageUploadModal = ({
  // eslint-disable-next-line
  editorRef,
  isOpen,
  close,
  clearSelection,
  selection,
  setSelection,
  images,
  editorType,
  lmsEndpointUrl,
}) => {
  if (selection) {
    return (
      <ImageSettingsModal
        {...{
          isOpen,
          close: module.hooks.onClose({ clearSelection, close }),
          selection,
          images,
          saveToEditor: module.hooks.createSaveCallback({
            close,
            images,
            editorRef,
            editorType,
            selection,
            setSelection,
            lmsEndpointUrl,
          }),
          returnToSelection: clearSelection,
        }}
      />
    );
  }
  return (
    <SelectImageModal
      {...{
        isOpen,
        close,
        setSelection,
        clearSelection,
        images,
      }}
    />
  );
};

ImageUploadModal.defaultProps = {
  editorRef: null,
  editorType: null,
  selection: null,
};
ImageUploadModal.propTypes = {
  clearSelection: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  editorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  isOpen: PropTypes.bool.isRequired,
  selection: PropTypes.shape({
    url: PropTypes.string,
    externalUrl: PropTypes.string,
    altText: PropTypes.bool,
  }),
  setSelection: PropTypes.func.isRequired,
  images: PropTypes.shape({}).isRequired,
  lmsEndpointUrl: PropTypes.string.isRequired,
  editorType: PropTypes.string,
};

export default injectIntl(ImageUploadModal);
