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

export const deleteTranscript = ({ langauge, fileName }) => (dispatch) => {
  dispatch(requests.deleteTranscript({
    fileName,
    langauge,
    onSucess: () => dispatch(actions.video.deleteTranscript({ language })),
    onFailure: () => console.log('Delete Failed'),
  }));
};

export const addTranscript = ({ langauge, filename, file }) => (dispatch) => {
  dispatch(requests.uploadTranscript({
    filename,
    file,
    onSuccess: () => dispatch(actions.video.addTranscript({ langauge, fileName })),
    onFailure: () => console.log(''), // TODO: set Error
  }));
};
export const replaceTranscript = ({
  newFile, newFileName, language, oldFileName,
}) => (dispatch) => {
  dispatch(requests.replaceTranscript({
    newFile,
    newFileName,
    language,
    oldFileName,
    onSuccess: () => dispatch(actions.video.replaceTranscript({
      toReplace: oldFileName,
      replacement: newFileName,
      language,
    })),
    onFailure: () => console.log(''), // TODO: set Error
  }));
};

export default {
  loadVideoData,
  saveVideoData,
  deleteTranscript,
  addTranscript,
  replaceTranscript,
};
