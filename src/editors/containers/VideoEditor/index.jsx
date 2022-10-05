import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EditorContainer from '../EditorContainer';
import VideoEditorModal from './components/VideoEditorModal';
import { errorsHook } from './hooks';
import { useDispatch } from 'react-redux';

export const VideoEditor = ({
  onClose,
}) => {
  const {
    error,
    validateEntry,
  } = errorsHook();

  const getContent = () => ({dispatch}) => {
    console.log('it was called', dispatch);
    dispatch();
  }

  return (
    <EditorContainer
      getContent={getContent()}
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
