import {
  useRef, useEffect, useCallback, useState,
} from 'react';

import { StrictDict } from '../../utils';
import pluginConfig from './pluginConfig';
import * as module from './hooks';

export const state = StrictDict({
  isModalOpen: (val) => useState(val),
  imageSelection: (val) => useState(val),
  refReady: (val) => useState(val),
});

export const openModalWithSelectedImage = (editor, setImage, openModal) => () => {
  const imgHTML = editor.selection.getNode();
  setImage({
    externalUrl: imgHTML.src,
    altText: imgHTML.alt,
    width: imgHTML.width,
    height: imgHTML.height,
  });
  openModal();
};

export const addImageUploadBehavior = ({ openModal, setImage }) => (editor) => {
  editor.ui.registry.addButton('imageuploadbutton', {
    icon: 'image',
    onAction: openModal,
  });
  editor.ui.registry.addButton('editimagesettings', {
    icon: 'image',
    onAction: module.openModalWithSelectedImage(editor, setImage, openModal),
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
  setSelection,
  lmsEndpointUrl,
}) => ({
  onInit: (evt, editor) => module.initializeEditorRef(setEditorRef, initializeEditor)(editor),
  initialValue: blockValue ? blockValue.data.data : '',
  init: {
    setup: module.addImageUploadBehavior({ openModal, setImage: setSelection }),
    plugins: pluginConfig.plugins,
    imagetools_toolbar: pluginConfig.imageToolbar,
    toolbar: pluginConfig.toolbar,
    imagetools_cors_hosts: [lmsEndpointUrl],
    ...pluginConfig.config,
  },
});

export const selectedImage = (val) => {
  const [selection, setSelection] = module.state.imageSelection(val);
  return {
    clearSelection: () => setSelection(null),
    selection,
    setSelection,
  };
};

export const modalToggle = () => {
  const [isOpen, setIsOpen] = module.state.isModalOpen(false);
  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  };
};

export const prepareEditorRef = () => {
  const editorRef = useRef(null);
  const setEditorRef = useCallback((ref) => {
    editorRef.current = ref;
  }, []);
  const [refReady, setRefReady] = module.state.refReady(false);
  useEffect(() => setRefReady(true), []);
  return { editorRef, refReady, setEditorRef };
};

export const navigateTo = (destination) => {
  window.location.assign(destination);
};

export const navigateCallback = (destination) => () => module.navigateTo(destination);

export const saveBlock = ({
  editorRef,
  returnUrl,
  saveFunction,
}) => {
  saveFunction({
    returnToUnit: module.navigateCallback(returnUrl),
    content: editorRef.current.getContent(),
  });
};
