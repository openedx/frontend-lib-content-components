import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../../../data/redux'
import { thunkActions } from '../../../../../../data/redux';tems

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
  dispatch(actions.video.replaceTranscript({ newFile: e.target.files[0], newFileName: e.target.value, language }));
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

export default { transcriptLanguages, fileInput, onSelectLanguage };
