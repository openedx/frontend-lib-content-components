import React from 'react';
import PropTypes from 'prop-types';

import VideoSettingsModal from './VideoSettingsModal';
import SelectVideoModal from './SelectVideoModal';

const VideoUploadModal = ({
  isOpen,
  close,
}) => {
  const [selection, setSelection] = React.useState(null);
  const clearSelection = () => setSelection(null);
  const saveToEditor = () => { };
  const closeAndReset = () => {
    setSelection(null);
    close();
  };
  if (selection) {
    return (
      <VideoSettingsModal
        {...{
          isOpen,
          close: closeAndReset,
          selection,
          saveToEditor,
          returnToSelection: clearSelection,
        }}
      />
    );
  }
  return (<SelectVideoModal {...{ isOpen, close, setSelection }} />);
};

VideoUploadModal.defaultProps = {
  editorRef: null,
};
VideoUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  editorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};
export default VideoUploadModal;
