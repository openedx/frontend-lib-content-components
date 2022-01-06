import React, {useContext}from "react";
import { Spinner, Toast } from "@edx/paragon";
import { Editor} from '@tinymce/tinymce-react';
import {EditorPageContext} from "../EditorPageProvider";

const TextEditor = () => {
  const {editorRef,blockValue,blockError,blockLoading} = useContext(EditorPageContext);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div className="editor-body row-8">
        {blockError != null &&
         <Toast>"TODO: MAKE ERROR MESSAGE"</Toast>
        }
        {blockLoading === true
        ? <Spinner animation="border" className="m-3" screenReaderText="loading" />
        : <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue= {blockValue.data}
          init={{
            height: 900,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

          }}
        />
      }
    </div>
  );
};

export default TextEditor;