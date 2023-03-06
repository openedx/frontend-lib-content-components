import React from 'react';
import PropTypes from 'prop-types';
import TinyMceWidget from '../TinyMceWidget';
import { prepareEditorRef } from '../TinyMceWidget/hooks';
import './index.scss';

export const ExpandableTextArea = ({
  value,
  setContent,
  placeholder,
  ...props
}) => {
  const { editorRef, setEditorRef } = prepareEditorRef();

  return (
    <div className="expandable-mce">
      <TinyMceWidget
        textValue={value}
        editorRef={editorRef}
        editorType="expandable"
        setEditorRef={setEditorRef}
        updateContent={setContent}
        placeholder={placeholder}
        minHeight={150}
        {...props}
      />
    </div>
  );
};

ExpandableTextArea.defaultProps = {
  value: null,
  placeholder: null,
};

ExpandableTextArea.propTypes = {
  value: PropTypes.string,
  setContent: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default ExpandableTextArea;
