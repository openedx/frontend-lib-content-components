import React from 'react';
import PropTypes from 'prop-types';

import ImageSettingsModal from './ImageSettingsModal';
import SelectImageModal from './SelectImageModal';

const ImageUploadModal = ({
  // eslint-disable-next-line
  editorRef,
  isOpen,
  close,
  selection,
  setSelection,
}) => {
  const saveToEditor = (settings) => {
    editorRef.current.execCommand('mceInsertContent', false, `<img src="${selection.externalUrl}" alt="${settings.isDecorative ? '' : settings.altText}" width="${settings.dimensions.width}" height="${settings.dimensions.height}">`);
    setSelection(null);
    close();
  };
  const closeAndReset = () => {
    setSelection(null);
    close();
  };
  if (selection) {
    return (
      <ImageSettingsModal
        {...{
          isOpen,
          close: closeAndReset,
          selection,
          saveToEditor,
          returnToSelection: () => setSelection(null),
        }}
      />
    );
  }
  return (<SelectImageModal {...{ isOpen, close, setSelection }} />);
};

ImageUploadModal.defaultProps = {
  editorRef: null,
};
ImageUploadModal.propTypes = {
  selection: PropTypes.shape({
    url: PropTypes.string,
    externalUrl: PropTypes.string,
    altText: PropTypes.bool,
  }).isRequired,
  setSelection: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  editorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};
export default ImageUploadModal;
