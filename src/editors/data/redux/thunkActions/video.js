import { singleVideoData } from '../../services/cms/mockVideoData';
import { actions } from '..';
import requests from './requests';

export const loadVideoData = () => (dispatch) => {
  dispatch(actions.video.load(singleVideoData));
};

export const saveVideoData = () => () => {
  // dispatch(actions.app.setBlockContent)
  // dispatch(requests.saveBlock({ });
};

// Transcript Thunks:

export const uploadTranscript = () => {};

export const deleteTranscript = ({ language }) => (dispatch) => {
  dispatch(requests.deleteTranscript({
    language,
    onSucess: () => dispatch(actions.video.deleteTranscript({ language })),
  }));
};

export const downloadTranscript = ({ language }) => (dispatch) => {
  dispatch(requests.downloadTranscript({
    language,
    onSucess: () => dispatch(actions.video.downloadTranscript({ language })),
  }));
};

export const replaceTranscript = ({ newFile, newFilename, language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;

  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => {
      dispatch(actions.video.updateField(transcripts.delete(transcripts[language])));
      dispatch(uploadTranscript({ language, filename: newFilename, file: newFile }));
    },
  }));
};

export default {
  loadVideoData,
  saveVideoData,
  deleteTranscript,
  replaceTranscript,
  downloadTranscript,
};
