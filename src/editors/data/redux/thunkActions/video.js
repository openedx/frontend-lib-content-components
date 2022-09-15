import { singleVideoData } from '../../services/cms/mockVideoData';
import { StrictDict } from '../../../utils';
import { actions, selectors } from '..';
import * as requests from './requests';

export const loadVideoData = () => (dispatch) => {
  dispatch(actions.video.load(singleVideoData));
};

export const saveVideoData = () => () => {
  // dispatch(actions.app.setBlockContent)
  // dispatch(requests.saveBlock({ });
};

// Transcript Thunks:

export const deleteTranscript = ({ language }) => (dispatch) => {
  console.log('deleting transcript');
  const { transcripts, videoSource } = selectors.video;
  dispatch(requests.deleteTranscript({
    filename: transcripts[language],
    onSuccess: () => dispatch(actions.video.updateField(transcripts.delete(transcripts[language]))),
    onFailure: () => console.log('Delete Failed'), // TODO: set Error
  }));
};
export const uploadTranscript = ({ langauge, filename, file }) => (dispatch) => {
  // TODO: Prevent the addition of dulicate keys by setting language here

  const { transcripts, videoSource } = selectors.video;
  const newTrancsripts = { ...transcripts, [langauge]: { filename } };
  dispatch(requests.uploadTranscript({
    transcript: file,
    videoId: videoSource,
    onSuccess: () => dispatch(actions.video.updateField(newTrancsripts)),
    onFailure: (e) => console.log(e), // TODO: set Error
  }));
};

// fix spelling of language
export const replaceTranscript = ({ newFile, newFileName, language }) => (dispatch) => {
  const { transcripts } = selectors.video;
  const newTrancsripts = { ...transcripts, [language]: { newFileName } };

  // To replace a transcript, first delete the old one, then add a new onSuccess

  dispatch(requests.deleteTranscript({
    filename: transcripts[language],
    onSuccess: () => {
      dispatch(actions.video.updateField(transcripts.delete(transcripts[language])));
      dispatch(requests.uploadTranscript({
        newFileName,
        newFile,
        onSuccess: () => dispatch(actions.video.updateField(newTrancsripts)),
        onFailure: () => console.log('add Transcript Failed'), // TODO: set Error
      }));
    },
    onFailure: () => console.log('Delete Failed'), // TODO: set Error
  }));
};

export const downloadTranscript = () => (dispatch) => {
  dispatch(requests.downloadTranscript({
    onSuccess: () => console.log('Download succeeded'),
    onFailure: () => console.log('Download Failed'), // TODO: set Error
  }));
};

export default StrictDict({
  loadVideoData,
  saveVideoData,
  replaceTranscript,
  deleteTranscript,
  uploadTranscript,
  downloadTranscript,
});
