import {
  useRef, useCallback, useState, useEffect,
} from 'react';
import tinyMCEStyles from '../../data/constants/tinyMCEStyles';
import { StrictDict } from '../../utils';
import pluginConfig from '../TextEditor/pluginConfig';
import * as module from './hooks';

export const state = StrictDict({
  refReady: (val) => useState(val),
});

export const parseContentForLabels = ({ editor, updateQuestion }) => {
  let content = editor.getContent();
  const parsedLabels = content.split(/<label>|<\/label>/gm);
  let updatedContent;
  parsedLabels.forEach((label, i) => {
    let updatedLabel = label;
    if (!label.startsWith('<') && !label.endsWith('>')) {
      let previousLabel = parsedLabels[i - 1];
      let nextLabel = parsedLabels[i + 1];
      if (!previousLabel.endsWith('<p>')) {
        previousLabel = `${previousLabel}</p><p>`;
        updatedContent = content.replace(parsedLabels[i - 1], previousLabel);
        content = updatedContent;
      }
      if (previousLabel.endsWith('</p>') && !label.startWith('<p>')) {
        updatedLabel = `<p>${label}`;
        updatedContent = content.replace(label, updatedLabel);
        content = updatedContent;
      }
      if (!nextLabel.startsWith('</p>')) {
        nextLabel = `</p><p>${nextLabel}`;
        updatedContent = content.replace(parsedLabels[i + 1], nextLabel);
        content = updatedContent;
      }
    }
  });
  updateQuestion(content);
};

export const setupCustomBehavior = ({ updateQuestion }) => (editor) => {
  // add a custom simple inline label formatter.
  const toggleLabelFormatting = () => {
    editor.execCommand('mceToggleFormat', false, 'label');
  };
  editor.ui.registry.addIcon('textToSpeech',
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 22C3.08333 22 2.72917 21.8542 2.4375 21.5625C2.14583 21.2708 2 20.9167 2 20.5V3.5C2 3.08333 2.14583 2.72917 2.4375 2.4375C2.72917 2.14583 3.08333 2 3.5 2H13L11.5 3.5H3.5V20.5H15.5V17H17V20.5C17 20.9167 16.8542 21.2708 16.5625 21.5625C16.2708 21.8542 15.9167 22 15.5 22H3.5ZM6 17.75V16.25H13V17.75H6ZM6 14.75V13.25H11V14.75H6ZM15.5 15L11.5 11H8V6H11.5L15.5 2V15ZM17 12.7V4.05C17.9333 4.4 18.6667 5.01667 19.2 5.9C19.7333 6.78333 20 7.65 20 8.5C20 9.35 19.7083 10.1917 19.125 11.025C18.5417 11.8583 17.8333 12.4167 17 12.7ZM17 16.25V14.7C18.1667 14.2833 19.2083 13.5333 20.125 12.45C21.0417 11.3667 21.5 10.05 21.5 8.5C21.5 6.95 21.0417 5.63333 20.125 4.55C19.2083 3.46667 18.1667 2.71667 17 2.3V0.75C18.7 1.2 20.125 2.1375 21.275 3.5625C22.425 4.9875 23 6.63333 23 8.5C23 10.3667 22.425 12.0125 21.275 13.4375C20.125 14.8625 18.7 15.8 17 16.25Z" fill="black"/></svg>');
  editor.ui.registry.addButton('customLabelButton', {
    icon: 'textToSpeech',
    text: 'Label',
    tooltip: 'Apply a "Question" label to specific text, recognized by screen readers. Recommended to improve accessibility.',
    onAction: toggleLabelFormatting,
  });
  editor.on('blur', () => {
    module.parseContentForLabels({
      editor,
      updateQuestion,
    });
  });
};

export const problemEditorConfig = ({
  setEditorRef,
  question,
  updateQuestion,
}) => ({
  onInit: (evt, editor) => {
    setEditorRef(editor);
  },
  initialValue: question || '',
  init: {
    skin: false,
    content_css: false,
    content_style: tinyMCEStyles,
    menubar: false,
    branding: false,
    min_height: 150,
    placeholder: 'Enter your question',
    formats: { label: { inline: 'label' } },
    setup: module.setupCustomBehavior({ updateQuestion }),
    toolbar: `${pluginConfig().toolbar} | customLabelButton`,
    plugins: 'autoresize',
  },
});

export const prepareEditorRef = () => {
  const editorRef = useRef(null);
  const setEditorRef = useCallback((ref) => {
    editorRef.current = ref;
  }, []);
  const [refReady, setRefReady] = module.state.refReady(false);
  useEffect(() => setRefReady(true), [setRefReady]);
  return { editorRef, refReady, setEditorRef };
};
