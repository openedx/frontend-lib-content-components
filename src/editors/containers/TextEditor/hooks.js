import { useState } from 'react';
import * as module from './hooks';

export const addImageUploadButton = (openModal) => (editor) => {
  console.log(openModal)
  editor.ui.registry.addButton('imageuploadbutton', {
    icon: 'image',
    onAction() { openModal(null); },
  });
  editor.ui.registry.addButton('editimagesettings', {
    icon: 'image',
    onAction() { openModal(editor.selection.getNode()); },
  });
};

export const initializeEditorRef = (setRef, initializeEditor) => (editor) => {
  setRef(editor);
  initializeEditor();
};

// for toast onClose to avoid console warnings
export const nullMethod = () => {};

export const editorConfig = ({
  setEditorRef,
  blockValue,
  openModal,
  initializeEditor,
}) => ({
  onInit: (evt, editor) => module.initializeEditorRef(setEditorRef, initializeEditor)(editor),
  initialValue: blockValue ? blockValue.data.data : '',
  init: {
    setup: module.addImageUploadButton(openModal),
    plugins: 'link codesample emoticons table charmap code autoresize imagetools',
    menubar: false,
    toolbar: 'undo redo | formatselect | '
      + 'bold italic backcolor | alignleft aligncenter '
      + 'alignright alignjustify | bullist numlist outdent indent |'
      + 'imageuploadbutton | link | emoticons | table | codesample | charmap |'
      + 'removeformat | hr |code',
    imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimagesettings',
    imagetools_cors_hosts: ['courses.edx.org'],
    height: '100%',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    min_height: 1000,
    branding: false,
  },
});

export const modalToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  };
};
