import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../../../data/redux';

export const transcriptLanguages = (transcripts) => {
  const languages = [];
  if (transcripts) {
    Object.keys(transcripts).forEach(transcript => {
      languages.push(transcript);
    });
    return languages.join(', ');
  }
  return 'None';
};

export const onSelectLanguage = ({ fileName }) => (e) => {
  const currentTranscripts = useSelector(selectors.app.video.transcripts);
  const newTranscripts = { [e.target.value]: { fileName }, ...currentTranscripts };
  const dispatch = useDispatch();
  dispatch(actions.video.updateField({ transcripts: newTranscripts }));
};

export const replaceFileCallback = ({ language, dispatch }) => (e) => {
  dispatch(actions.video.replaceTranscript({ newFile: e.target.files[0], newFileName: e.target.value, language }));
};

export const addFileCallback = ({ dispatch }) => (e) => {
  dispatch(actions.video.addTranscript({ file: e.target.files[0], fileName: e.target.value }));
};

export const fileInput = ({ onAddFile }) => {
  console.log('wotero', onAddFile);
  const ref = React.useRef();
  const click = () => ref.current.click();
  const addFile = (e) => {
    onAddFile(e);
  };
  return {
    click,
    addFile,
    ref,
  };
};

export default {
  transcriptLanguages, fileInput, onSelectLanguage, replaceFileCallback,
};
