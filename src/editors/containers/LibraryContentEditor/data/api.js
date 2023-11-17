import { get } from '../../../data/services/cms/utils';
import * as urls from './urls';
import * as module from './api';
import * as mockApi from './mockApi';

export const apiMethods = {
  fetchV1Libraries: ({ studioEndpointUrl }) => get(
    urls.v1Libraries({ studioEndpointUrl }),
  ),
  fetchV2Libraries: ({ studioEndpointUrl }) => get(
    urls.v2Libraries({ studioEndpointUrl }),
  ),
  fetchLibraryProperty: ({ studioEndpointUrl, libraryId }) => get(
    urls.libraryProperty({ studioEndpointUrl, libraryId }),
  ),
  fetchLibraryContent: ({ studioEndpointUrl, libraryId }) => get(
    urls.libraryContent({ studioEndpointUrl, libraryId }),
  ),
  fetchBlockContent: ({ studioEndpointUrl, blockId }) => get(
    urls.blockContent({ studioEndpointUrl, blockId }),
  ),
};

export const checkMockApi = (key) => {
  if (process.env.REACT_APP_DEVGALLERY) {
    return mockApi[key] ? mockApi[key] : mockApi.emptyMock;
  }
  return module.apiMethods[key];
};

export default Object.keys(apiMethods).reduce(
  (obj, key) => ({ ...obj, [key]: checkMockApi(key) }),
  {},
);
