import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from '@edx/frontend-platform/i18n';
import tinyMCEKeys from '../../data/constants/tinyMCE';
import ImageSettingsModal from './ImageSettingsModal';
import SelectImageModal from './SelectImageModal';
import * as module from '.';

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
    const newImage = {
      externalUrl: selection.externalUrl,
      altText: settings.altText,
      width: settings.dimensions.width,
      height: settings.dimensions.height,
    };
    setSelection(newImage);
    let foundMatch = false;
    images.current = images.current.map((image) => {
      const matchRegex = /asset-v1.(.*).type.(.*).block.(.*)/;
      const isMatch = JSON.stringify(image.id.match(matchRegex).slice(1)) === JSON.stringify(selection.externalUrl.match(matchRegex).slice(1));
      if (isMatch) { foundMatch = true; return { ...image, width: settings.dimensions.width, height: settings.dimensions.height }; }
      return image;
    });
    if (!foundMatch) { images.current = [...images.current, newImage]; }
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
    console.log('image upload modal | selection: ', selection);
    console.log('image upload modal | images: ', images);
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
