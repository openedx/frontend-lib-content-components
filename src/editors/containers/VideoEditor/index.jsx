import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { thunkActions } from '../../data/redux';

import EditorContainer from '../EditorContainer';
import VideoEditorModal from './components/VideoEditorModal';
import { errorsHook } from './hooks';

export const VideoEditor = ({
  onClose,
}) => {
  const {
    error,
    validateEntry,
  } = errorsHook();
  const fetchVideoContent = () => ({ dispatch }) => (
    dispatch(thunkActions.video.uploadThumbnail())
  );
  return (
    <EditorContainer
      getContent={fetchVideoContent()}
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
};
VideoEditor.propTypes = {
  onClose: PropTypes.func,
};

export const mapStateToProps = () => {};

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(VideoEditor);
