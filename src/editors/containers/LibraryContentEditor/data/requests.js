import { StrictDict } from '../../../utils';
import { RequestKeys } from '../../../data/constants/requests';
import { networkRequest } from '../../../data/redux/thunkActions/requests';

/* eslint-disable import/no-cycle */
import { actions, selectors } from '../../../data/redux';
import api from './api';

/**
 * Tracked fetchContentStore api method.
 * Tracked to the `fetchContentStore` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchContentStore = ({ ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchContentStore,
    promise: api.fetchContentStore({
      studioEndpointUrl: selectors.app.studioEndpointUrl(getState()),
    }),
    ...rest,
  }));
};

/**
 * Tracked fetchLibraryProperty api method.
 * Tracked to the `fetchLibraryProperty` request key.
 * @param {[func]} onSuccess - onSuccess method ((response) => { ... })
 * @param {[func]} onFailure - onFailure method ((error) => { ... })
 */
export const fetchLibraryProperty = ({ libraryId, ...rest }) => (dispatch, getState) => {
  dispatch(networkRequest({
    requestKey: RequestKeys.fetchLibraryProperty,
    promise: api.fetchLibraryProperty({
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
    requestKey: RequestKeys.fetchLibraryProperty,
    promise: api.fetchLibraryProperty({
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
  fetchContentStore,
  fetchLibraryProperty,
  fetchLibraryContent,
  fetchBlockContent,
});
