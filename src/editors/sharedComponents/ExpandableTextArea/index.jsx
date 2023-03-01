import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Form } from '@edx/paragon';
import PropTypes from 'prop-types';

export const ExpandableTextArea = ({ value, onChange, configOverrides }) => {
  /*
    usage:

    const [value, setValue] = useState('Something');
  return (
    < ExpandableTextArea
        value={value}
        onChange = (newContent) => setValue(newContent)
    />

  );
    */

  const ref = React.useRef();

  const showEditor = () => {
    console.log('show editor');
    console.log({ ref });
    ref.current.show();
  };

  const [edit, setEdit] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    if (!edit) {
      setEdit(true);
      showEditor();
    }
  };

  const config = {
    init: {
      setup: (editor) => {
        ref.current = editor;
        editor.on('init', (e) => {
          console.log('The Editor has initialized.');
          editor.hide();
        });
        editor.on('blur', (e) => {
          e.stopImmediatePropagation();
          console.log('The Editor has Blurred.');
          editor.hide();
          setEdit(false);
        });
      },
      height: 500,
      menubar: 'file edit view',
      plugins: [
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
      ],
    },
    onInit: {},
  };

  return (
    <>
      {!edit && (
        <Form.Control
          value={value}
          onClick={handleClick}
        />
      )}
      <div style={{ display: edit ? 'block' : 'none' }}>
        <Editor
          init={config.init}
          onInit={config.onInit}
          initialValue={value}
          value={value}
          onEditorChange={onChange}
        />
      </div>
    </>
  );
};

ExpandableTextArea.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    configOverrides: PropTypes.object,
  };



export default ExpandableTextArea;
