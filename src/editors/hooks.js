import {
  useRef, useEffect, useCallback, useState,
} from 'react';
import * as module from './hooks';

export const initializeApp = ({ initialize, data }) => useEffect(() => initialize(data), []);

export const prepareEditorRef = () => {
  const editorRef = useRef(null);
  const setEditorRef = useCallback((ref) => {
    editorRef.current = ref;
  }, []);
  const [refReady, setRefReady] = useState(false);
  useEffect(() => setRefReady(true), []);
  return { editorRef, refReady, setEditorRef };
};

export const navigateTo = (destination) => {
  window.location.assign(destination);
};

export const navigateCallback = (destination) => () => navigateTo(destination);

export const saveTextBlock = ({
  editorRef,
  returnUrl,
  saveBlock,
}) => {
  console.log(editorRef);
  saveBlock({
    returnToUnit: module.navigateCallback(returnUrl),
    content: editorRef.current.getContent(),
  });
};

// for toast onClose to avoid console warnings
export const nullMethod = () => {};
