import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Form } from '@edx/paragon';

const GeneralEditor = ({ placeholder, config }) => {
  const [engineState, setEngineState] = useState(placeholder);
  const updateEngineText = (content) => {
    setEngineState(content);
  };

  return (
    <Editor
      apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
      init={config.init}
      onInit={config.onInit}
      initialValue={placeholder}
      value={engineState}
      onEditorChange={updateEngineText}
    />
  );
};

export const ExpandableTextArea = ({ value }) => {
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

  return (
    <>
      {!edit && (
        <Form.Control
          value={value}
          onClick={handleClick}
        />
      )}
      <div style={{ display: edit ? 'block' : 'none' }}>
        <GeneralEditor
          placeholder="Editor 1"
          config={{
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
          }}
        />
      </div>
    </>
  );
};

export default ExpandableTextArea;
