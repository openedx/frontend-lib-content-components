import { useRef, useCallback, useState, useEffect } from 'react';
import { StrictDict } from '../../utils';
import * as module from './hooks';

export const state = StrictDict({
    refReady: (val) => useState(val),
  });

export const problemEditorConfig = ({
    setEditorRef,
    editorRef,
    question,
    updateQuestion
  }) => ({
    onInit: (evt, editor) => {
      setEditorRef(editor);
    },
    initialValue: question ? question : '',
    onFocusOut: () =>{
      let content = editorRef.current.getContent({format: 'text'});
      updateQuestion(content);
    },
  });

  export const prepareEditorRef = () => {
    const editorRef = useRef(null);
    const setEditorRef = useCallback((ref) => {
      editorRef.current = ref;
    }, []);
    const [refReady, setRefReady] = module.state.refReady(false);
    useEffect(() => setRefReady(true), []);
    return { editorRef, refReady, setEditorRef };
  };
