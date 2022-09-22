import React from 'react';
import { thunkActions, actions } from '../../../../../../data/redux';
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

export const hasTranscripts = (transcripts) => {
  if (transcripts && Object.keys(transcripts).length > 0) {
    return true;
  }
  return false;
};

export const onSelectLanguage = ({
  filename, dispatch, transcripts, languageBeforeChange,
}) => (e) => {
  const { [languageBeforeChange]: removedProperty, ...trimmedTranscripts } = transcripts;
  const newTranscripts = { [e.target.value]: { filename }, ...trimmedTranscripts };
  dispatch(actions.video.updateField({ transcripts: newTranscripts }));
};

export const replaceFileCallback = ({ language, dispatch }) => (e) => {
  dispatch(thunkActions.video.replaceTranscript({
    newFile: e.target.files[0],
    newFilename: e.target.files[0].name,
    language,
  }));
};

export const addFileCallback = ({ dispatch }) => (e) => {
  dispatch(thunkActions.video.uploadTranscript({
    file: e.target.files[0],
    filename: e.target.files[0].name,
    language: null,
  }));
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
