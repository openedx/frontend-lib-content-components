import React from 'react';
import { actions } from '../../../../../../data/redux';
import * as module from './hooks';

export const state = {
  inDeleteConfirmation: (args) => React.useState(args),
};

export const transcriptLanguages = (transcripts) => {
  const languages = [];
  if (Object.keys(transcripts).length > 0) {
    Object.keys(transcripts).forEach(transcript => {
      languages.push(transcript);
    });
    return languages.join(', ');
  }
  return 'None';
};

export const onSelectLanguage = ({
  fileName, dispatch, transcripts, languageBeforeChange,
}) => (e) => {
  const { [languageBeforeChange]: removedProperty, ...trimmedTranscripts } = transcripts;
  const newTranscripts = { [e.target.value]: { fileName }, ...trimmedTranscripts };
  dispatch(actions.video.updateField({ transcripts: newTranscripts }));
};

export const replaceFileCallback = ({ language, dispatch }) => (e) => {
  dispatch(actions.video.replaceTranscript({ newFile: e.target.files[0], newFileName: e.target.value, language }));
};

export const addFileCallback = ({ dispatch }) => (e) => {
  dispatch(actions.video.addTranscript({ file: e.target.files[0], fileName: e.target.value }));
};

export const fileInput = ({ onAddFile }) => {
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

export const setUpDeleteConfirmation = () => {
  const [inDeleteConfirmation, setInDeleteConfirmation] = module.state.inDeleteConfirmation(false);
  return {
    inDeleteConfirmation,
    launchDeleteConfirmation: () => setInDeleteConfirmation(true),
    cancelDelete: () => setInDeleteConfirmation(false),
  };
};

export default {
  transcriptLanguages, fileInput, onSelectLanguage, replaceFileCallback, addFileCallback, setUpDeleteConfirmation,
};
