import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { blockTypes } from 'data/constants/app';
import { thunkActions } from 'data/redux';

import TextEditor from './TextEditor/TextEditor';
import VideoEditor from './VideoEditor/VideoEditor';
import ProblemEditor from './ProblemEditor/ProblemEditor';
import EditorFooter from './EditorFooter';
import EditorHeader from './EditorHeader';

export const messages = {
  id: 'authoring.editorpage.selecteditor.error',
  defaultMessage: 'Error: Could Not find Editor',
  description: 'Error Message Dispayed When An unsopported Editor is desired in V2',
};

export const supportedEditors = {
  [blockTypes.html]: TextEditor,
  [blockTypes.video]: VideoEditor,
  [blockTypes.problem]: ProblemEditor,
};

export const initializeApp = ({ initialize, data }) => useEffect(() => initialize(data), []);
export const prepareEditorRef = () => {
  const editorRef = useRef(null);
  const setEditorRef = (ref) => {
    editorRef.current = ref;
  };
  const [refReady, setRefReady] = useState(false);
  useEffect(() => setRefReady(true), []);
  return { editorRef, refReady, setEditorRef };
};

export const EditorPage = ({
  courseId,
  blockType,
  blockId,
  studioEndpointUrl,
  // redux
  initialize,
}) => {
  module.initializeApp({
    initialize,
    data: {
      blockId,
      blockType,
      courseId,
      studioEndpointUrl,
    },
  });

  const {
    editorRef,
    refReady,
    setEditorRef,
  } = module.prepareEditorRef();

  const Editor = supportedEditors[blockType];

  return (
    <div className="d-flex flex-column vh-100">
      <div
        className="pgn__modal-fullscreen"
        role="dialog"
        aria-label={blockType}
      >
        <EditorHeader />

        {refReady && (
          (Editor !== undefined)
            ? <Editor {...{ editorRef, setEditorRef }} />
            : <FormattedMessage {...messages.couldNotFindEditor} />
        )}

        <EditorFooter />
      </div>
    </div>
  );
};
EditorPage.defaultProps = {
  courseId: null,
  blockId: null,
  studioEndpointUrl: null,
};

EditorPage.propTypes = {
  courseId: PropTypes.string,
  blockType: PropTypes.string.isRequired,
  blockId: PropTypes.string,
  studioEndpointUrl: PropTypes.string,
  // redux
  initialize: PropTypes.func.isRequired,
};
export const mapStateToProps = () => ({});
export const mapDispatchToProps = {
  initialize: thunkActions.app.initialize,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage);
