import { singleVideoData } from '../../services/cms/mockVideoData';
import { StrictDict } from '../../../utils';
import { actions } from '..';
import * as requests from './requests';
import { downloadVideoTranscripts } from '../../services/cms/urls';
// import * as thunkActions from './';

export const loadVideoData = () => (dispatch) => {
  dispatch(actions.video.load(singleVideoData));
};

export const saveVideoData = () => () => {
  // dispatch(actions.app.setBlockContent)
  // dispatch(requests.saveBlock({ });
};

export const uploadTranscript = ({ language, filename, file }) => (dispatch, getState) => {
  // TODO: Prevent the addition of dulicate keys by setting language here
  const state = getState();
  const { transcripts, videoId } = state.video;
  const { studioEndpointUrl, blockId } = state.app;
  const downloadLink = downloadVideoTranscripts({ studioEndpointUrl, blockId, language });
  dispatch(requests.uploadTranscript({
    language,
    videoId,
    transcript: file,
    onSuccess: () => dispatch(actions.video.updateField({
      transcripts: {
        ...transcripts,
        [language]: { filename, downloadLink },
      },
    })),
  }));
};

export const deleteTranscript = ({ language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => {
      const updateTranscripts = {};
      Object.keys(transcripts).forEach((key) => {
        if (key !== language) {
          updateTranscripts[key] = transcripts[key];
        }
      });
      dispatch(actions.video.updateField({ transcripts: updateTranscripts }));
    },
  }));
};

export const replaceTranscript = ({ newFile, newFilename, language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => {
      const updateTranscripts = {};
      Object.keys(transcripts).forEach((key) => {
        if (key !== language) {
          updateTranscripts[key] = transcripts[key];
        }
      });
      dispatch(actions.video.updateField({ transcripts: updateTranscripts }));
      dispatch(uploadTranscript({ language, file: newFile, filename: newFilename }));
    },
  }));
};

export default StrictDict({
  loadVideoData,
  saveVideoData,
  replaceTranscript,
  deleteTranscript,
  uploadTranscript,
});
