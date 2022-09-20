import { singleVideoData } from '../../services/cms/mockVideoData';
import { StrictDict } from '../../../utils';
import { actions } from '..';
import * as requests from './requests';
import { downloadVideoTranscripts } from '../../services/cms/urls';

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
    onFailure: (e) => console.log(e), // TODO: set Error
  }));
};

export const deleteTranscript = ({ language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => dispatch(actions.video.updateField(transcripts.delete(transcripts[language]))),
    onFailure: () => console.log('Delete Failed'), // TODO: set Error
  }));
};

export const replaceTranscript = ({ newFile, newFilename, language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  const newTrancsripts = { ...transcripts, [language]: { newFilename } };

  dispatch(requests.deleteTranscript({
    filename: transcripts[language],
    onSuccess: () => {
      dispatch(actions.video.updateField(transcripts.delete(transcripts[language])));
      dispatch(requests.uploadTranscript({
        language,
        videoId,
        transcript: newFile,
        onSuccess: () => dispatch(actions.video.updateField({ transcripts: newTrancsripts })),
        onFailure: () => console.log('add Transcript Failed'), // TODO: set Error
      }));
    },
    onFailure: () => console.log('Delete Failed'), // TODO: set Error
  }));
};

export default StrictDict({
  loadVideoData,
  saveVideoData,
  replaceTranscript,
  deleteTranscript,
  uploadTranscript,
});
