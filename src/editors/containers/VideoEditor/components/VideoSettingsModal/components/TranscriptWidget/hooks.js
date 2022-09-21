import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors, thunkActions } from '../../../../../../data/redux';

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
  const currentTranscripts = useSelector(selectors.video.transcripts);
  const newTranscripts = { [e.target.value]: { fileName }, ...currentTranscripts };
  const dispatch = useDispatch();
  dispatch(actions.video.updateField({ transcripts: newTranscripts }));
};

export const replaceFileCallback = ({ language, dispatch }) => (e) => {
  const selectedFile = e.target.files[0];
  dispatch(thunkActions.video.replaceTranscript({ newFile: selectedFile, newFilename: selectedFile.name, language }));
};

export const fileInput = ({ onAddFile }) => {
  const dispatch = useDispatch();
  const ref = React.useRef();
  const click = () => ref.current.click();
  const addFile = (e) => {
    if (typeof onAddFile === 'function') {
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

export const deleteTranscript = ({ language, dispatch }) => {
  dispatch(thunkActions.video.deleteTranscript({ language }));
};

export default {
  transcriptLanguages,
  fileInput,
  onSelectLanguage,
  replaceFileCallback,
  deleteTranscript,
};
