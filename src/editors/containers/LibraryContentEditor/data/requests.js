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
 * Tracked fetchlibraryMetadata api method.
 * Tracked to the `fetchlibraryMetadata` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchlibraryMetadata = ({ libraryId, ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchlibraryMetadata,
    promise: api.fetchlibraryMetadata({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
      libraryId,
    }),
    ...rest,
  }));
};

/**
 * Tracked fetchLibraryContent api method.
 * Tracked to the `fetchLibraryContent` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchLibraryContent = ({ libraryId, ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchLibraryContent,
    promise: api.fetchLibraryContent({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
      libraryId,
    }),
    ...rest,
  }));
};

/**
 * Tracked fetchBlockContent api method.
 * Tracked to the `fetchBlockContent` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchBlockContent = ({ blockId, ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchBlockContent,
    promise: api.fetchBlockContent({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
      blockId,
    }),
    ...rest,
  }));
};

export default StrictDict({
  fetchV2Libraries,
  fetchlibraryMetadata,
  fetchLibraryContent,
  fetchBlockContent,
});
