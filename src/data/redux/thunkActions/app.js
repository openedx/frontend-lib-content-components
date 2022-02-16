import { StrictDict } from 'utils';

import { actions, selectors } from 'data/redux';
import * as requests from './requests';

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

export const saveBlock = () => (dispatch, getState) => {
  dispatch(saveBlock({
    blockType: selectors.app.blockType(getState()),
    courseId: selectors.app.courseId(getState()),
    content: selectors.app.content(getState()),
    onSuccess: (response) => {
      dispatch(actions.app.setSaveResponse(response));
    },
  }));
};

export default StrictDict({ fetchBlock, fetchUnit, saveBlock });
