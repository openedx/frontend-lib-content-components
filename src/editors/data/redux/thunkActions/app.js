import { StrictDict, camelizeKeys } from '../../../utils';
import { actions } from '..';
import * as requests from './requests';
import * as module from './app';

export const fetchBlock = () => (dispatch) => {
  dispatch(requests.fetchBlock({
    onSuccess: (response) => dispatch(actions.app.setBlockValue(response)),
    onFailure: (e) => dispatch(actions.app.setBlockValue(e)),
  }));
};

export const fetchUnit = () => (dispatch) => {
  dispatch(requests.fetchUnit({
    onSuccess: (response) => dispatch(actions.app.setUnitUrl(response)),
    onFailure: (e) => dispatch(actions.app.setUnitUrl(e)),
  }));
};

/**
 * @param {string} studioEndpointUrl
 * @param {string} blockId
 * @param {string} courseId
 * @param {string} blockType
 */
export const initialize = (data) => (dispatch) => {
  dispatch(actions.app.initialize(data));
  dispatch(module.fetchBlock());
  dispatch(module.fetchUnit());
};

/**
 * @param {func} onSuccess
 */
export const saveBlock = ({ content, returnToUnit }) => (dispatch) => {
  dispatch(actions.app.setBlockContent(content));
  dispatch(requests.saveBlock({
    content,
    onSuccess: (response) => {
      dispatch(actions.app.setSaveResponse(response));
      returnToUnit();
    },
  }));
};

export const fetchImages = ({ setImages }) => (dispatch) => {
  dispatch(requests.fetchImages({
    onSuccess: (response) => {
      const processedData = camelizeKeys(response.data.assets).reduce(
        (obj, el) => {
          const dateAdded = new Date(el.dateAdded.replace(' at', '')).getTime();
          return { ...obj, [el.id]: { ...el, dateAdded } };
        },
        {},
      );
      return setImages(processedData);
    },
    onFailure: (e) => setImages(e),
  }));
};

export const uploadImage = ({ file, setSelection }) => (dispatch) => {
  dispatch(requests.uploadImage({
    image: file,
    onSuccess: (response) => setSelection(camelizeKeys(response.data.asset)),
  }));
};

export default StrictDict({
  fetchBlock,
  fetchUnit,
  initialize,
  saveBlock,
  fetchImages,
  uploadImage,
});
