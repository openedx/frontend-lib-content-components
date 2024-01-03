import { StrictDict } from '../../../utils';
import { RequestKeys } from '../../../data/constants/requests';
import { networkRequest } from '../../../data/redux/thunkActions/requests';

/* eslint-disable import/no-cycle */
import { selectors } from '../../../data/redux';
import api from './api';

/**
 * Tracked fetchV1Libraries api method.
 * Tracked to the `fetchV1Libraries` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchV1Libraries = ({ ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchV1Libraries,
    promise: api.fetchV1Libraries({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
    }),
    ...rest,
  }));
};

/**
 * Tracked fetchV2Libraries api method.
 * Tracked to the `fetchV2Libraries` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchV2Libraries = ({ ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchV2Libraries,
    promise: api.fetchV2Libraries({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
    }),
    ...rest,
  }));
};

/**
 * Tracked fetchV2LibraryContent api method.
 * Tracked to the `fetchV2LibraryContent` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchV2LibraryContent = ({ libraryId, ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchV2LibraryContent,
    promise: api.fetchV2LibraryContent({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
      libraryId,
    }),
    ...rest,
  }));
};

/**
 * Tracked fetchChildrenInfo api method.
 * Tracked to the `fetchChildrenInfo` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchChildrenInfo = ({ ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchChildrenInfo,
    promise: api.fetchChildrenInfo({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
      blockId: selectors.app.blockId(getState()),
    }),
    ...rest,
  }));
};

export default StrictDict({
  fetchV1Libraries,
  fetchV2Libraries,
  fetchV2LibraryContent,
  fetchChildrenInfo,
});
