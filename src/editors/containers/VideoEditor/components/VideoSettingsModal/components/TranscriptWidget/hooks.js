import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors, thunkActions } from '../../../../../../data/redux';
import * as module from './hooks';

export const state = {
  showDownloadError: (val) => React.useState(val),
};

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

export const replaceFileCallback = ({ language }) => (e) => {
  const dispatch = useDispatch();
  const selectedFile = e.target.files[0];
  dispatch(thunkActions.video.replaceTranscript({ newFile: selectedFile, newFilename: selectedFile.name, language }));
};

export const fileInput = ({ onAddFile }) => {
  const dispatch = useDispatch();
  const ref = React.useRef();
  const click = () => ref.current.click();
  const addFile = (e) => {
    if (!onAddFile === '') {
      onAddFile(e);
    } else {
      const selectedFile = e.target.files[0];
      dispatch(thunkActions.video.uploadTranscript({
        filename: selectedFile.name,
        language: 'esp',
        file: selectedFile,
      }));
    }
  };
  return {
    click,
    addFile,
    ref,
  };
};

export const downloadTranscript = ({ language }) => {
  const dispatch = useDispatch();
  const [showDownloadError, setShowDownloadError] = module.state.showDownloadError(false);
  dispatch(thunkActions.video.downloadTranscript({ language }));
};
export const deleteTranscript = ({ language }) => {
  const dispatch = useDispatch();
  dispatch(thunkActions.video.deleteTranscript({ language }));
};

export default {
  transcriptLanguages,
  fileInput,
  onSelectLanguage,
  replaceFileCallback,
  downloadTranscript,
  deleteTranscript,
};
