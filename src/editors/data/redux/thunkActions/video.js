import { singleVideoData } from '../../services/cms/mockVideoData';
import { actions } from '..';
import api from '../../services/cms/api';

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
    onSuccess: () => dispatch(actions.app.video.addTranscript({ langauge, fileName })),
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
    onSuccess: () => dispatch(actions.app.video.replaceTranscript({
      toReplace: oldFileName,
      replacement: newFileName,
      language,
    })),
    onFailure: () => console.log(''), // TODO: set Error
  }));
};

export const requests = {
  replaceTranscript: (
    fileName,
    langauge,
    ...rest
  ) => (
    dispatch,
    getState,
  ) => {
    dispatch(module.networkRequest({
      requestKey: RequestKeys.replaceTranscript,
      promise: api.video.replaceTranscript({
        studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
        blockId: selectors.app.blockId(getState()),
        file,
      }),
      ...rest,
    }));
  },
  addTranscript: (langauge, fileName, file, ...rest) => (dispatch, getState) => {
    dispatch(module.networkRequest({
      requestKey: RequestKeys.addTranscript,
      promise: api.video.addTranscript({
        studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
        blockId: selectors.app.blockId(getState()),
        fileName,
        langauge,
        file,
      }),
      ...rest,
    }));
  },
  deleteTranscript: (newFile, newFileName, language, oldFileName, ...rest) => (dispatch, getState) => {
    dispatch(module.networkRequest({
      requestKey: RequestKeys.deleteTranscript,
      promise: api.video.addTranscript({
        studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
        blockId: selectors.app.blockId(getState()),
        fileName,
        langauge,
      }),
      ...rest,
    }));
  },

};

export default {
  loadVideoData,
  saveVideoData,
  deleteTranscript,
  addTranscript,
  replaceTranscript,
};
