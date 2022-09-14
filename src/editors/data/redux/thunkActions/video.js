import { singleVideoData } from '../../services/cms/mockVideoData';
import { actions } from '..';

export const loadVideoData = () => (dispatch) => {
  dispatch(actions.video.load(singleVideoData));
};

export const saveVideoData = () => () => {
  // dispatch(actions.app.setBlockContent)
  // dispatch(requests.saveBlock({ });
};

export default {
  loadVideoData,
  saveVideoData,
};

// Transcript Thunks:

export const deleteTranscript = ({ language }) => (dispatch) => {
  const { transcripts } = actions.app.video;
  dispatch(requests.deleteTranscript({
    filename: transcripts[language],
    onSuccess: () => dispatch(actions.app.video.setTranscripts(transcripts.delete(transcripts[language]))),
    onFailure: () => console.log('Delete Failed'), // TODO: set Error
  }));
};
export const addTranscript = ({ langauge, filename, file }) => (dispatch) => {
  // TODO: Prevent the addition of dulicate keys by setting language here

  const { transcripts } = actions.app.video;
  const newTrancsripts = { ...transcripts, [langauge]: { filename } };
  dispatch(requests.uploadTranscript({
    filename,
    file,
    onSuccess: () => dispatch(actions.app.video.setTranscripts(newTrancsripts)),
    onFailure: () => console.log(''), // TODO: set Error
  }));
};

// fix spelling of language
export const replaceTranscript = ({ newFile, newFileName, language }) => (dispatch) => {
  const { transcripts } = actions.app.video;
  const newTrancsripts = { ...transcripts, [language]: { newFileName } };

  // To replace a transcript, first delete the old one, then add a new onSuccess

  dispatch(requests.deleteTranscript({
    filename: transcripts[language],
    onSuccess: () => {
      dispatch(actions.app.video.setTranscripts(transcripts.delete(transcripts[language])));
      dispatch(requests.uploadTranscript({
        newFileName,
        newFile,
        onSuccess: () => dispatch(actions.app.video.setTranscripts(newTrancsripts)),
        onFailure: () => console.log('add Transcript Failed'), // TODO: set Error
      }));
    },
    onFailure: () => console.log('Delete Failed'), // TODO: set Error
  }));
};
