import { camelizeKeys } from '../../../utils';
import * as urls from './urls';
import { get, post } from './utils';
import * as module from './api';
import * as mockApi from './mockApi';

export const apiMethods = {
  fetchBlockById: ({ blockId, studioEndpointUrl }) => get(
    urls.block({ blockId, studioEndpointUrl }),
  ),
  fetchByUnitId: ({ blockId, studioEndpointUrl }) => get(
    urls.blockAncestor({ studioEndpointUrl, blockId }),
  ),
  fetchStudioView: ({ blockId, studioEndpointUrl }) => get(
    urls.blockStudioView({ studioEndpointUrl, blockId }),
  ),
  fetchImages: ({ learningContextId, studioEndpointUrl }) => get(
    urls.courseImages({ studioEndpointUrl, learningContextId }),
  ),
  uploadImage: ({
    learningContextId,
    studioEndpointUrl,
    image,
  }) => {
    const data = new FormData();
    data.append('file', image);
    return post(
      urls.courseAssets({ studioEndpointUrl, learningContextId }),
      data,
    );
  },
  normalizeContent: ({
    blockId,
    blockType,
    content,
    learningContextId,
    title,
  }) => {
    let response = {};
    if (blockType === 'html') {
      response = {
        category: blockType,
        couseKey: learningContextId,
        data: content,
        has_changes: true,
        id: blockId,
        metadata: { display_name: title },
      };
    } else if (blockType === 'problem') {
      response = {
        category: blockType,
        couseKey: learningContextId,
        has_changes: true,
        id: blockId,
        metadata: { display_name: title, markdown: content },
      };
    } else {
      throw new TypeError(`No Block in V2 Editors named /"${blockType}/", Cannot Save Content.`);
    }
    return { ...response };
  },
  saveBlock: ({
    blockId,
    blockType,
    content,
    learningContextId,
    studioEndpointUrl,
    title,
  }) => post(
    urls.block({ studioEndpointUrl, blockId }),
    module.apiMethods.normalizeContent({
      blockType,
      content,
      blockId,
      learningContextId,
      title,
    }),
  ),
};

export const loadImage = (imageData) => ({
  ...imageData,
  dateAdded: new Date(imageData.dateAdded.replace(' at', '')).getTime(),
});

export const loadImages = (rawImages) => camelizeKeys(rawImages).reduce(
  (obj, image) => ({ ...obj, [image.id]: module.loadImage(image) }),
  {},
);

export const checkMockApi = (key) => {
  if (process.env.REACT_APP_DEVGALLERY) {
    return mockApi[key];
  }
  return module.apiMethods[key];
};

export default Object.keys(apiMethods).reduce(
  (obj, key) => ({ ...obj, [key]: checkMockApi(key) }),
  {},
);
