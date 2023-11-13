export const contentStore = ({ studioEndpointUrl }) => (
  `${studioEndpointUrl}/api/contentstore/v1/home`
);

export const libraryProperty = ({ studioEndpointUrl, libraryId }) => (
  `${studioEndpointUrl}/api/libraries/v2/${libraryId}/`
);

export const libraryContent = ({ studioEndpointUrl, libraryId }) => (
  `${studioEndpointUrl}/api/libraries/v2/${libraryId}/blocks/`
);

export const blockContent = ({ studioEndpointUrl, blockId }) => (
  `${studioEndpointUrl}/library/${blockId}/`
);
