import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@edx/paragon';

export const RawEditor = ({
  editorRef,
  text,
}) => {
  return (
    <div class="form-group" style={{padding: '10px 30px'}}>
      <Alert variant="danger">
        You are using the raw HTML editor.
      </Alert>
      <textarea
        class="form-control"
        ref={editorRef}
        rows="12"
      >
        {text}
      </textarea>
    </div>
  );
};
RawEditor.defaultProps = {};
RawEditor.propTypes = {
  editorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  text: PropTypes.string.isRequired,
};

export default RawEditor;
