import { get, post, deleteObject } from '../../../data/services/cms/utils';
// import * as urls from '../../../data/services/cms/urls';
import * as urls from './urls';
import * as module from './api';
import * as mockApi from './mockApi';

export const apiMethods = {
  // fetchLibraries: ({}) => get(
  //   urls
  // ),
  fetchContentStore: ({ studioEndpointUrl }) => get(
    urls.contentStore({ studioEndpointUrl }),
  ),
  fetchLibraryContent: ({ studioEndpointUrl, libraryId }) => get(
    urls.libraryContent({ studioEndpointUrl, libraryId }),
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
