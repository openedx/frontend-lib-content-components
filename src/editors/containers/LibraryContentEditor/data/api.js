import { get, post, deleteObject } from '../../../data/services/cms/utils';
import * as urls from './urls';
import * as module from './api';
import * as mockApi from './mockApi';

export const apiMethods = {
  fetchContentStore: ({ studioEndpointUrl }) => get(
    urls.contentStore({ studioEndpointUrl }),
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
