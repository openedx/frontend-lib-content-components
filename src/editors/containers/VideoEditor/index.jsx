import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectors } from '../../data/redux';

import EditorContainer from '../EditorContainer';
import VideoEditorModal from './components/VideoEditorModal';
import { errorsHook } from './hooks';

export const VideoEditor = ({
  onClose,
  // redux
  videoSettings,
}) => {
  const {
    error,
    validateEntry,
  } = errorsHook();

  return (
    <EditorContainer
      getContent={() => videoSettings}
      onClose={onClose}
      validateEntry={validateEntry}
    >
      <div className="video-editor">
        <VideoEditorModal {...{ error }} />
      </div>
    </EditorContainer>
  );
};

VideoEditor.defaultProps = {
  onClose: null,
  videoSettings: null,
};
VideoEditor.propTypes = {
  onClose: PropTypes.func,
  // redux
  videoSettings: PropTypes.shape({}),
};

export const mapStateToProps = (state) => ({
  videoSettings: selectors.video.videoSettings(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VideoEditor);
