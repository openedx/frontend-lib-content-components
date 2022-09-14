import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../../../data/redux'

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
  const dispatch = useDispatch();
  const currentTranscripts = useSelector(selectors.app.video.transcripts);
  const currentTranscript = Object.keys(currentTranscripts).find(key => currentTranscripts[key] === { fileName });
  const transcriptsWithoutReplaced = (({ currentTranscript, ...transcripts }) => transcripts)(currentTranscripts);
  const newTranscripts = transcriptsWithoutReplaced[e.target.value] = { fileName };
  dispatch(actions.video.updateField({ transcripts: newTranscripts }));
};

export const fileInput = () => {
  const ref = React.useRef();
  const click = () => ref.current.click();
  const addFile = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
  };

  return {
    click,
    addFile,
    ref,
  };
};

export default { transcriptLanguages, fileInput, onSelectLanguage};
